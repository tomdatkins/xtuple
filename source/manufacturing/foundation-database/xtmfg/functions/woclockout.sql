CREATE OR REPLACE FUNCTION xtmfg.woClockOut(pWotcid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
    _p            RECORD;
BEGIN
    SELECT * INTO _p
    FROM xtmfg.wotc WHERE wotc_id = pWotcid;

-- Employee versus Username setting
  IF(fetchmetrictext('TimeAttendanceMethod') = 'Employee') THEN
    RETURN xtmfg.woClockOut(_p.wotc_wo_id, _p.wotc_emp_code, NOW(), _p.wotc_wooper_id);
  ELSE
    RETURN xtmfg.woClockOut(_p.wotc_wo_id, _p.wotc_username, NOW(), _p.wotc_wooper_id);
  END IF;
    
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xtmfg.woClockOut(pWoid INTEGER,
                                            pUsername TEXT,
                                            pTimeout TIMESTAMP WITH TIME ZONE,
                                            pWooperid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
    _wooperid	INTEGER;
    _count	INTEGER;
    _wotc_id	INTEGER;

BEGIN
    SELECT count(*) INTO _count
    FROM xtmfg.wooper
    WHERE (wooper_id=pWooperid);
    IF (_count <> 0) THEN
      _wooperid := pWooperid;
    END IF;

    IF (fetchmetrictext('TimeAttendanceMethod') = 'Employee') THEN 
    -----------------------------------------------------------------------------------
    -- Employee
    -----------------------------------------------------------------------------------
      SELECT wotc_id INTO _wotc_id
      FROM xtmfg.wotc
      WHERE ((wotc_wo_id=pWoid)
        AND  (wotc_emp_code=pUsername)
        AND  (wotc_wooper_id=_wooperid OR
	     (wotc_wooper_id IS NULL AND _wooperid IS NULL))
        AND  (wotc_timeout IS NULL)
        AND  (wotc_timein IN (SELECT MAX(wotc_timein)
	  		    FROM xtmfg.wotc
	  		    WHERE ((wotc_wo_id=pWoid)
	 		      AND  (wotc_emp_code=pUsername)
			      AND  (wotc_wooper_id=_wooperid OR
				   (wotc_wooper_id IS NULL AND _wooperid IS NULL))
			      AND  (wotc_timeout IS NULL)) )));

      IF NOT FOUND THEN
        INSERT INTO xtmfg.wotc (wotc_id, wotc_wo_id, wotc_emp_code,
                                wotc_timeout, wotc_wooper_id )
                        VALUES (DEFAULT, pWoid, pUsername,
                                pTimeout,
                                CASE WHEN _wooperid = -1 THEN NULL
                                     ELSE _wooperid END)
                        RETURNING wotc_id INTO _wotc_id;
	SELECT count(*) INTO _count
	FROM xtmfg.wotc
	WHERE ((wotc_emp_code = pUsername)
	  AND  (wotc_wo_id  = pWoid));
	IF (_count > 0) THEN
	    PERFORM logWOTCEvent(pWoid, pUsername, 'WODoubleClockOut');
	ELSE
	    PERFORM logWOTCEvent(pWoid, pUsername, 'WOClockOutWNoClockIn');
	END IF;
      ELSE
        UPDATE xtmfg.wotc SET wotc_timeout=pTimeout
        WHERE (wotc_id=_wotc_id);
      END IF;  
	  			      
    ELSE
    -----------------------------------------------------------------------------------
    -- User
    -----------------------------------------------------------------------------------
      SELECT wotc_id INTO _wotc_id
      FROM xtmfg.wotc
      WHERE ((wotc_wo_id=pWoid)
        AND  (wotc_username=pUsername)
        AND  (wotc_wooper_id=_wooperid OR
	     (wotc_wooper_id IS NULL AND _wooperid IS NULL))
        AND  (wotc_timeout IS NULL)
        AND  (wotc_timein IN (SELECT MAX(wotc_timein)
	  		    FROM xtmfg.wotc
	  		    WHERE ((wotc_wo_id=pWoid)
	 		      AND  (wotc_username=pUsername)
			      AND  (wotc_wooper_id=_wooperid OR
				   (wotc_wooper_id IS NULL AND _wooperid IS NULL))
			      AND  (wotc_timeout IS NULL)) )));
    
      IF NOT FOUND THEN
        INSERT INTO xtmfg.wotc (wotc_id, wotc_wo_id, wotc_username,
                                wotc_timeout, wotc_wooper_id )
                        VALUES (DEFAULT, pWoid, pUsername,
                                pTimeout,
                                CASE WHEN _wooperid = -1 THEN NULL
                                     ELSE _wooperid END)
                        RETURNING wotc_id INTO _wotc_id;
                        
	SELECT count(*) INTO _count
	FROM xtmfg.wotc
	WHERE ((wotc_username = pUsername)
	  AND  (wotc_wo_id  = pWoid));
 	  
	IF (_count > 0) THEN
	    PERFORM logWOTCEvent(pWoid, pUsername, 'WODoubleClockOut');
	ELSE
	    PERFORM logWOTCEvent(pWoid, pUsername, 'WOClockOutWNoClockIn');
	END IF;
      ELSE
        UPDATE xtmfg.wotc SET wotc_timeout=pTimeout
        WHERE (wotc_id=_wotc_id);
      END IF;

    END IF; -- User vs Employee

    RETURN _wotc_id;
END;
$$ LANGUAGE 'plpgsql';
