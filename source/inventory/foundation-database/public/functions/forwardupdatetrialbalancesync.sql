
CREATE OR REPLACE FUNCTION forwardUpdateTrialBalanceSync(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pTrialbalid ALIAS FOR $1;
  _p RECORD;
  _r RECORD;
  _ending NUMERIC;
  _currEnding NUMERIC;
  _prevYear INTEGER;
  _currYear INTEGER;
BEGIN

  SELECT trialbal_accnt_id, trialbal_ending, trialbalsync_curr_ending,
         trialbalsync_curr_id,
         period_end, accnt_type IN ('E', 'R') AS revexp INTO _p
  FROM trialbalsync, period, accnt
  WHERE ( (trialbal_period_id=period_id)
   AND (trialbal_accnt_id=accnt_id)
   AND (trialbal_id=pTrialbalid) );

  _ending = _p.trialbal_ending;
  _currEnding = _p.trialbalsync_curr_ending;

  SELECT yearperiod_id INTO _prevYear
    FROM yearperiod
   WHERE (_p.period_end BETWEEN yearperiod_start AND yearperiod_end);
  IF (NOT FOUND) THEN
    _prevYear := -1;
  END IF;

--  Find all of the subsequent periods and their trialbal, if they exist
  FOR _r IN SELECT period_id, period_end,
                   trialbal_id, trialbal_debits, trialbal_credits,
                   trialbal_yearend, trialbal_ending,
                   trialbalsync_curr_debits, trialbalsync_curr_credits,
                   trialbalsync_curr_yearend, COALESCE(trialbalsync_curr_posted, false) AS posted
            FROM period LEFT OUTER JOIN trialbalsync
                 ON ( (trialbal_period_id=period_id) AND (trialbal_accnt_id=_p.trialbal_accnt_id) )
            WHERE (period_start > _p.period_end)
            ORDER BY period_start LOOP

    -- This should never happen
    IF (_r.posted) THEN
      RAISE EXCEPTION 'Can not forward update a trial balance for % on % which the currency adjustment is already posted.',
                      formatglaccountlong(_p.trialbal_accnt_id), _r.period_end;
    END IF;
    
    SELECT yearperiod_id INTO _currYear
      FROM yearperiod
     WHERE (_r.period_end BETWEEN yearperiod_start AND yearperiod_end);
    IF (NOT FOUND) THEN
      _currYear := -1;
    END IF;

    IF (_p.revexp AND _currYear != _prevYear) THEN
      _ending := 0;
    END IF;

    _prevYear := _currYear;

    IF (_r.trialbal_id IS NULL) THEN
      INSERT INTO trialbalsync
      ( trialbal_period_id, trialbal_accnt_id,
        trialbal_beginning, trialbal_ending,
        trialbal_debits, trialbal_credits, trialbal_dirty,
        trialbalsync_curr_id, 
        trialbalsync_curr_beginning, trialbalsync_curr_ending )
      VALUES
      ( _r.period_id, _p.trialbal_accnt_id,
        _ending, _ending,
        0, 0, FALSE,
        _p.trialbalsync_curr_id,
        _currEnding, _currEnding );
    ELSE
      UPDATE trialbalsync
      SET trialbal_beginning = (_ending + trialbal_yearend),
          trialbal_ending = (_ending + trialbal_yearend - _r.trialbal_debits + _r.trialbal_credits),
          trialbalsync_curr_beginning = (_currEnding + trialbalsync_curr_yearend),
          trialbalsync_curr_ending = (_currEnding + trialbalsync_curr_yearend - _r.trialbalsync_curr_debits + _r.trialbalsync_curr_credits),
          trialbal_dirty = FALSE
      WHERE (trialbal_id=_r.trialbal_id);  

      _ending = (_ending + _r.trialbal_yearend - _r.trialbal_debits + _r.trialbal_credits);
      _currEnding = (_currEnding + _r.trialbalsync_curr_yearend - _r.trialbalsync_curr_debits + _r.trialbalsync_curr_credits);
    END IF;
  END LOOP;

  UPDATE trialbal
  SET trialbal_dirty = FALSE
  WHERE (trialbal_id=pTrialbalid);

  RETURN pTrialbalid;

END;
$$ LANGUAGE 'plpgsql';

