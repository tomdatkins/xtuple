-- calculate the amount of effort spent on a specified wotc record
CREATE OR REPLACE FUNCTION xtmfg.wotcTime(pWotcid INTEGER) RETURNS INTERVAL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
    _returnVal	INTERVAL	:= interval '0 min';
    _numJobs	INTEGER		:= 0;	-- # of jobs the user is split across
    _effort	FLOAT;
    _p		RECORD;
    _u		RECORD;
    _startTime	TIMESTAMP WITH TIME ZONE;
    _endTime	TIMESTAMP WITH TIME ZONE;
    _prevTime	TIMESTAMP WITH TIME ZONE;
    _midPt	TIMESTAMP WITH TIME ZONE;
    _debug	BOOLEAN	:= FALSE;
    _username  TEXT;
    _employee  TEXT;
    _useEmpl   BOOLEAN := FALSE;

BEGIN
  IF(fetchmetrictext('TimeAttendanceMethod') = 'Employee') THEN
    _useEmpl = true;
  END IF;
    
  SELECT wotc_timein, wotc_timeout, wotc_username, wotc_emp_code
	INTO _startTime, _endTime, _username, _employee
  FROM xtmfg.wotc
  WHERE wotc_id = pWotcid;

  IF (_startTime IS NULL) THEN
    RETURN NULL;
  END IF;

  IF (_endTime IS NULL) THEN
    _endTime = now();
  END IF;

  IF (_debug) THEN
    RAISE NOTICE '% ran wotcid % from % to %',
		  COALESCE(_employee,_username), pWotcid, _startTime, _endTime;
  END IF;

  _prevTime = _startTime;

  IF (_debug) THEN
    RAISE NOTICE 'wotc    prevTime                     wotc_time                    D Effort';
  END IF;

  IF (_useEmpl) THEN
    -- Employee Loop
    FOR _p IN SELECT wotc_id, wotc_time, wotc_dir
	        FROM xtmfg.wotcLinearized
	        WHERE(((wotc_id = pWotcid)
		   OR  (wotc_time BETWEEN _startTime AND _endTime))
                  AND (wotc_emp_code = _employee))
  	      ORDER BY wotc_time, wotc_dir DESC LOOP
      IF (_p.wotc_time IS NOT NULL) THEN
        _effort := 0.0;
        _midPt := _prevTime + (_p.wotc_time - _prevTime) / 2;

	  SELECT COUNT(*) INTO _numJobs
	  FROM xtmfg.wotc
	  WHERE ((_midPt BETWEEN wotc_timein AND COALESCE(wotc_timeout, _endTime))
	    AND  (wotc_emp_code = _employee));

	  IF (_numJobs > 0) THEN
	    _effort := 1.0 / _numJobs;
	  END IF;

        _returnVal := _returnVal + (_p.wotc_time - _prevTime) * _effort;

        IF (_debug) THEN
  	RAISE NOTICE '% % % % % %', _p.wotc_id, _prevTime, _p.wotc_time,
				      _p.wotc_dir, _effort, _returnVal;
        END IF;
        _prevTime := _p.wotc_time;
      END IF;
    END LOOP;
  ELSE  -- User Loop
    FOR _p IN SELECT wotc_id, wotc_time, wotc_dir
	        FROM xtmfg.wotcLinearized
	        WHERE(((wotc_id = pWotcid)
		   OR  (wotc_time BETWEEN _startTime AND _endTime))
                  AND (wotc_username = _username))
  	      ORDER BY wotc_time, wotc_dir DESC LOOP
      IF (_p.wotc_time IS NOT NULL) THEN
        _effort := 0.0;
        _midPt := _prevTime + (_p.wotc_time - _prevTime) / 2;

	  SELECT COUNT(*) INTO _numJobs
	  FROM xtmfg.wotc
	  WHERE ((_midPt BETWEEN wotc_timein AND COALESCE(wotc_timeout, _endTime))
	    AND  (wotc_username = _username));

	  IF (_numJobs > 0) THEN
	    _effort := 1.0 / _numJobs;
	  END IF;

        _returnVal := _returnVal + (_p.wotc_time - _prevTime) * _effort;

        IF (_debug) THEN
  	RAISE NOTICE '% % % % % %', _p.wotc_id, _prevTime, _p.wotc_time,
				      _p.wotc_dir, _effort, _returnVal;
        END IF;
        _prevTime := _p.wotc_time;
      END IF;
    END LOOP;

  END IF;  

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
