
CREATE OR REPLACE FUNCTION postCurrAdjustSync(INTEGER, TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pTrialbalId ALIAS FOR $1;
  pNotes ALIAS FOR $2;
  _currRate NUMERIC := 0;
  _rows INTEGER;
  _r RECORD;
  _g RECORD;
  _enddate DATE;
  _sequence INTEGER;
  _amount NUMERIC;
  _glaccntid INTEGER;
  _companyid INTEGER;
BEGIN

  SELECT company_id, COALESCE(company_unrlzgainloss_accnt_id,-1) INTO _companyid, _glaccntid
  FROM trialbal
    JOIN accnt ON (trialbal_accnt_id=accnt_id)
    JOIN company ON (accnt_company=company_number)
  WHERE ((trialbal_id=pTrialbalId)
    AND (company_external));

  GET DIAGNOSTICS _rows = ROW_COUNT;
  IF (_rows = 0) THEN
    RAISE EXCEPTION 'External company not found';
  ELSIF (_glaccntid = -1) THEN
    RAISE EXCEPTION 'No gain/loss acconut set on external company.';
  END IF;  
      
  -- Fetch trial balance that needs to be evaluated
  FOR _r IN
    SELECT trialbal_id, trialbal_period_id, trialbal_accnt_id, trialbal_beginning, trialbal_ending, 
      trialbal_debits, trialbal_credits, trialbalsync_curr_id, trialbalsync_curr_ending,
      period_end
    FROM trialbalsync
      JOIN accnt ON (accnt_id=trialbal_accnt_id)
      JOIN period ON (period_id=trialbal_period_id)
    WHERE ((NOT trialbalsync_curr_posted)
      AND (accnt_type IN ('A','L'))
      AND (trialbal_id=pTrialbalId))
    ORDER BY accnt_id, period_end
  LOOP
    -- If there has been activity let's post an adjustment
    IF (_r.trialbal_beginning > 0 OR _r.trialbal_debits > 0 OR _r.trialbal_debits > 0) THEN
      SELECT currRate(_r.trialbalsync_curr_id, curr_expires), period_end INTO _currRate, _enddate
      FROM curr_rate, period
      WHERE ((period_id=_r.trialbal_period_id)
        AND (curr_id=_r.trialbalsync_curr_id)
        AND (period_end BETWEEN curr_effective AND curr_expires))
      ORDER BY curr_expires DESC;

      GET DIAGNOSTICS _rows = ROW_COUNT;
      IF (_rows = 0) THEN
        SELECT currRate(_r.trialbalsync_curr_id, curr_expires), curr_expires INTO _currRate, _enddate
        FROM curr_rate, period
        WHERE ((period_id=_r.trialbal_period_id)
         AND (curr_id=_r.trialbalsync_curr_id)
         AND (curr_expires BETWEEN period_start AND period_end))
        ORDER BY curr_expires DESC;
        
      -- This should never happen, how else could the transactions been imported successfully?
        GET DIAGNOSTICS _rows = ROW_COUNT;
        IF (_rows = 0) THEN
          RAISE EXCEPTION 'No currency exchange rate found for trial balance account % on %.',
                          formatGLAccountLong(_r.trialbal_accnt_id),formatDate(_r.period_end);
        END IF;
      END IF;      

      _sequence := fetchGLSequence();
      _amount := _r.trialbal_ending - round(currToBase(_r.trialbalsync_curr_id, _r.trialbalsync_curr_ending, _enddate),2);

      IF (_amount != 0) THEN
      
        INSERT INTO gltranssync ( gltrans_exported, gltrans_created, 
          gltrans_date, gltrans_sequence, gltrans_accnt_id, gltrans_source, 
          gltrans_docnumber, gltrans_misc_id, gltrans_amount, gltrans_notes, 
          gltrans_journalnumber, gltrans_posted, gltrans_doctype, gltrans_rec, 
          gltrans_username, gltrans_deleted, gltranssync_company_id, 
          gltranssync_period_id, gltranssync_curr_amount, 
          gltranssync_curr_id, gltranssync_curr_rate) 
        VALUES ( false, now(), _enddate, _sequence, 
          _r.trialbal_accnt_id,'G/L', '', -1, 
          _amount * -1, 
          pNotes, -1, false, 
          '', false, getEffectiveXtUser(), false, 
          _companyid, _r.trialbal_period_id, 
          0, _r.trialbalsync_curr_id, _currRate);

        INSERT INTO gltranssync ( gltrans_exported, gltrans_created, 
          gltrans_date, gltrans_sequence, gltrans_accnt_id, gltrans_source, 
          gltrans_docnumber, gltrans_misc_id, gltrans_amount, gltrans_notes, 
          gltrans_journalnumber, gltrans_posted, gltrans_doctype, gltrans_rec, 
          gltrans_username, gltrans_deleted, gltranssync_company_id, 
          gltranssync_period_id, gltranssync_curr_amount, 
          gltranssync_curr_id, gltranssync_curr_rate ) 
        VALUES (false, now(), _enddate, _sequence, 
          _glaccntid,'G/L', '', -1, 
          _amount, 
          pNotes, -1, false, 
          '', false, getEffectiveXtUser(), false, 
          _companyid, _r.trialbal_period_id, 
          0, _r.trialbalsync_curr_id, _currRate);

        PERFORM postIntoTrialBalanceSync(_sequence);
        PERFORM forwardUpdateTrialBalanceSync(_r.trialbal_id);
        PERFORM forwardUpdateTrialBalanceSync(trialbal_id)
        FROM trialbalsync
        WHERE ((trialbal_period_id=_r.trialbal_period_id)
          AND (trialbal_accnt_id=_glaccntid));
      END IF;
    END IF;
    
    UPDATE trialbalsync SET 
      trialbalsync_curr_rate=_currRate,
      trialbalsync_curr_posted=true 
    WHERE trialbal_id = _r.trialbal_id;
  END LOOP;

  RETURN true;

END;
$$ LANGUAGE 'plpgsql';

