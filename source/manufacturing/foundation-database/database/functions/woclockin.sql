CREATE OR REPLACE FUNCTION xtmfg.woClockIn(pWoid INTEGER,
                                           pUsername TEXT,
                                           pTimein TIMESTAMP WITH TIME ZONE,
                                           pWooperid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
    _wostatus	TEXT;
    _explodeRet	INTEGER;
    _p		RECORD;
    _r		RECORD;
    _itemlocSeries	INTEGER;
    _returnVal	INTEGER := 0;

BEGIN
    SELECT wo_status INTO _wostatus
    FROM wo
    WHERE (wo_id=pWoid)
    FOR UPDATE;

    IF (_wostatus = 'O') THEN
      _explodeRet := explodeWo(pWoid, TRUE);
      IF (_explodeRet < 0) THEN
	_returnVal := _explodeRet;
	return _returnVal;
      ELSE
	_wostatus := 'E';
      END IF;
    END IF;

    IF (_wostatus = 'C') THEN
      _returnVal := -12;
      PERFORM logWOTCEvent(pWoid, pUsername, 'WOClockInOnClosedJob');
      return _returnVal;
    END IF;

    IF (fetchmetrictext('TimeAttendanceMethod') = 'Employee') THEN 
      -- Employee --
      IF EXISTS(SELECT 1
                FROM xtmfg.wotc
               WHERE ((wotc_emp_code = pUsername)
                 AND  (wotc_wo_id    = pWoid)
                 AND  (wotc_timeout IS NULL)
                 AND  (COALESCE(wotc_wooper_id, -1)=COALESCE(pWooperid, -1))))
      THEN
        _returnVal := -13;
        PERFORM logWOTCEvent(pWoid, pUsername, 'WODoubleClockIn');
        RETURN _returnVal;
      END IF;

      INSERT INTO xtmfg.wotc (wotc_id, wotc_wo_id, wotc_emp_code, wotc_timein,
	  	      wotc_wooper_id)
	  VALUES (DEFAULT, pWoid, pUsername, pTimein,
	          CASE WHEN pWooperid = -1 THEN NULL ELSE pWooperid END)
          RETURNING wotc_id INTO _returnVal;
          
    ELSE -- User --
      IF EXISTS(SELECT 1
                FROM xtmfg.wotc
               WHERE ((wotc_username = pUsername)
                 AND  (wotc_wo_id    = pWoid)
                 AND  (wotc_timeout IS NULL)
                 AND  (COALESCE(wotc_wooper_id, -1)=COALESCE(pWooperid, -1))))
      THEN
        _returnVal := -13;
        PERFORM logWOTCEvent(pWoid, pUsername, 'WODoubleClockIn');
        RETURN _returnVal;
      END IF;

      INSERT INTO xtmfg.wotc (wotc_id, wotc_wo_id, wotc_username, wotc_timein,
	  	      wotc_wooper_id)
	  VALUES (DEFAULT, pWoid, pUsername, pTimein,
	          CASE WHEN pWooperid = -1 THEN NULL ELSE pWooperid END)
          RETURNING wotc_id INTO _returnVal;
    END IF;
    
    RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
