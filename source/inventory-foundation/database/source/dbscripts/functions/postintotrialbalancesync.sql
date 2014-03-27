CREATE OR REPLACE FUNCTION postIntoTrialBalanceSync(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
BEGIN
  RETURN postIntoTrialBalanceSync(pSequence, '');
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postIntoTrialBalanceSync(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  pNotes ALIAS FOR $2;
  _trialbalid INTEGER;
  _currid INTEGER;
  _posted BOOLEAN;
  _r RECORD;
  _sequence INTEGER;

BEGIN

--  Identify and handle rounding issues
  -- Look for rounding issues and create an entry to address if found
  
  FOR _r IN
    SELECT *
    FROM (
      SELECT sum(gltrans_amount) AS discrepency, 
        period_id, period_end,
        gltranssync_curr_id, company_id, company_dscrp_accnt_id
      FROM gltranssync
        JOIN accnt ON (accnt_id=gltrans_accnt_id)
        JOIN company ON (accnt_company=company_number)
        JOIN period ON (period_id=gltranssync_period_id)
      WHERE ((gltrans_sequence=pSequence)
        AND  (NOT gltrans_posted))
      GROUP BY period_id, period_end, gltranssync_curr_id,
             company_id, company_dscrp_accnt_id  ) data
    WHERE (discrepency > 0)
  LOOP
    
    INSERT INTO gltranssync ( gltrans_exported, gltrans_created, 
      gltrans_date, gltrans_sequence, gltrans_accnt_id, gltrans_source, 
      gltrans_docnumber, gltrans_misc_id, gltrans_amount, gltrans_notes, 
      gltrans_journalnumber, gltrans_posted, gltrans_doctype, gltrans_rec, 
      gltrans_username, gltrans_deleted, gltranssync_company_id, 
      gltranssync_period_id, gltranssync_curr_amount, 
      gltranssync_curr_id, gltranssync_curr_rate ) 
    VALUES (false, now(), _r.period_end, pSequence, 
      _r.company_dscrp_accnt_id, 'G/L', '', -1, 
      _r.discrepency *-1, 
      pNotes, -1, false, 
      '', false, getEffectiveXtUser(), false, 
      _r.company_id, _r.period_id, 
      0, _r.gltranssync_curr_id, 0 );

  END LOOP;

--  March through all of the G/L Transactions for the passed sequence that are not posted
  FOR _r IN SELECT gltrans_id, gltrans_date, gltrans_accnt_id, gltrans_amount, 
                   accnt_forwardupdate, period_id, period_closed, period_freeze,
                   gltranssync_curr_id, gltranssync_curr_amount
            FROM accnt, gltranssync LEFT OUTER JOIN period ON (gltrans_date BETWEEN period_start AND period_end)
            WHERE ( (gltrans_accnt_id=accnt_id)
             AND (NOT gltrans_posted)
             AND (NOT gltrans_deleted)
             AND (gltrans_sequence=pSequence) ) LOOP

--  If we can post into a Trial Balance, do so
    IF ( (NOT _r.period_closed) AND ( (NOT _r.period_freeze) OR (checkPrivilege('PostFrozenPeriod')) ) ) THEN

--  Try to find an existing trialbal
      SELECT trialbal_id, trialbalsync_curr_id, trialbalsync_curr_posted INTO _trialbalid, _currid, _posted
      FROM trialbalsync
      WHERE ( (trialbal_period_id=_r.period_id)
       AND (trialbal_accnt_id=_r.gltrans_accnt_id) );
      IF (FOUND) THEN
        --  Validate: these things should never happen
        IF ( _r.gltranssync_curr_id != _currid) THEN
          RAISE EXCEPTION 'Transaction currency and trial balance currency do not match.';
        ELSIF (_posted) THEN
          RAISE EXCEPTION 'Can not post into a trial balance that already has a currency adjustment posted.';
        END IF;
--  We found a trialbal, update it with the G/L Transaction
--  Note - two stage update to avoid any funny value caching logic
        IF (_r.gltrans_amount > 0) THEN
          UPDATE trialbalsync
          SET trialbal_credits = (trialbal_credits + _r.gltrans_amount),
              trialbalsync_curr_credits = (trialbalsync_curr_credits + _r.gltranssync_curr_amount)
          WHERE (trialbal_id=_trialbalid);
        ELSE
          UPDATE trialbalsync
          SET trialbal_debits = (trialbal_debits + (_r.gltrans_amount * -1)),
              trialbalsync_curr_debits = (trialbalsync_curr_debits + (_r.gltranssync_curr_amount * -1))
          WHERE (trialbal_id=_trialbalid);
        END IF;

        UPDATE trialbalsync
        SET trialbal_ending = (trialbal_beginning - trialbal_debits + trialbal_credits),
            trialbalsync_curr_ending = (trialbalsync_curr_beginning - trialbalsync_curr_debits + trialbalsync_curr_credits),
            trialbal_dirty=TRUE
        WHERE (trialbal_id=_trialbalid);
      ELSE

--  No existing trialbal, make one
        SELECT NEXTVAL('trialbal_trialbal_id_seq') INTO _trialbalid;
        INSERT INTO trialbalsync
        ( trialbal_id, trialbal_accnt_id, trialbal_period_id, trialbal_dirty,
          trialbal_beginning, 
          trialbal_ending,
          trialbal_credits,
          trialbal_debits,
          trialbalsync_curr_id,
          trialbalsync_curr_beginning, 
          trialbalsync_curr_ending,
          trialbalsync_curr_credits,
          trialbalsync_curr_debits )
        VALUES
        ( _trialbalid, _r.gltrans_accnt_id, _r.period_id, TRUE,
          0, 
          _r.gltrans_amount,
          CASE WHEN (_r.gltrans_amount > 0) THEN _r.gltrans_amount
               ELSE 0
          END,
          CASE WHEN (_r.gltrans_amount < 0) THEN (_r.gltrans_amount * -1)
               ELSE 0
          END,
          _r.gltranssync_curr_id,   
          0, 
          _r.gltranssync_curr_amount, 
          CASE WHEN (_r.gltranssync_curr_amount > 0) THEN _r.gltranssync_curr_amount
               ELSE 0
          END,
          CASE WHEN (_r.gltranssync_curr_amount < 0) THEN (_r.gltranssync_curr_amount * -1)
               ELSE 0
          END );
      END IF;

--  Forward update if we should
/*  (We'll do this later)
      IF (_r.accnt_forwardupdate AND fetchmetricbool('ManualForwardUpdate')) THEN
        PERFORM forwardUpdateTrialBalance(_trialbalid);
      END IF;
*/
--  Mark the G/L Transaction as posted
      UPDATE gltrans
      SET gltrans_posted=TRUE
      WHERE (gltrans_id=_r.gltrans_id);

    END IF;

  END LOOP;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

