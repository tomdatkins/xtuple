CREATE OR REPLACE FUNCTION xtmfg.wooperTime(pWooperid INTEGER) RETURNS INTERVAL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
    RETURN xtmfg.wooperTime(pWooperid, NULL);
END;
$$ LANGUAGE 'plpgsql';

-- calculate the amount of effort spent on a specified work order operation by a
-- specified user or by all users
CREATE OR REPLACE FUNCTION xtmfg.wooperTime(pWooperid INTEGER,
                                            pUsername TEXT) RETURNS INTERVAL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
    _returnVal  INTERVAL        := interval '0 min';
    _numJobs    INTEGER         := 0;   -- # of jobs the user is split across
    _numWOs     INTEGER         := 0;   -- # of non-wooper jobs the user is working
    _p          RECORD;
    _u          RECORD;
    _startTime  TIMESTAMP WITH TIME ZONE;
    _endTime    TIMESTAMP WITH TIME ZONE;
    _prevTime   TIMESTAMP WITH TIME ZONE;
    _midPt      TIMESTAMP WITH TIME ZONE;
    _empId      INTEGER;
    _employee   TEXT;
    _useEmpl    BOOLEAN := FALSE;

BEGIN
  IF(fetchmetrictext('TimeAttendanceMethod') = 'Employee') THEN
    _useEmpl = true;
  END IF;
  
  SELECT MIN(wotc_time), MAX(wotc_time) INTO _startTime, _endTime
  FROM xtmfg.wotcLinearized
  WHERE wotc_wooper_id = pWooperid;
  
  IF (_startTime IS NULL AND _endTime IS NULL) THEN
    RETURN NULL;
  END IF;

  RAISE DEBUG 'start wooperid % at %, end @ % for user %',
              pWooperid, _startTime, _endTime, pUsername;

  _prevTime = _startTime;

  RAISE DEBUG E'midPt\t\t\t\tendTime\t\t\t\tuser\tjobs\teffort\trunning total';
  
  IF (_useEmpl) THEN
  -- Employee Loop
      FOR _p IN SELECT wotc_wooper_id, wotc_time, wotc_dir
                FROM xtmfg.wotcLinearized
                WHERE ((wotc_time BETWEEN _startTime AND _endTime)
                   AND (wotc_emp_code IN (SELECT wotc_emp_code
                                            FROM xtmfg.wotc
                                           WHERE (wotc_wooper_id = pWooperid))))
                ORDER BY wotc_time, wotc_dir DESC LOOP
      IF (_p.wotc_time IS NOT NULL) THEN
        _midPt := _prevTime + (_p.wotc_time - _prevTime) / 2;
        FOR _u IN SELECT DISTINCT wotc_emp_code 
            FROM xtmfg.wotc
            WHERE ((_midPt BETWEEN wotc_timein AND COALESCE(wotc_timeout, _endTime))
              AND  (wotc_wooper_id=pWooperid)) LOOP

          SELECT COUNT(DISTINCT wotc_wooper_id) INTO _numJobs
          FROM xtmfg.wotc
          WHERE ((_midPt BETWEEN wotc_timein AND COALESCE(wotc_timeout, _endTime))
            AND  (wotc_emp_code = _u.wotc_emp_code));

          SELECT COUNT(DISTINCT wotc_wo_id) INTO _numWOs
          FROM xtmfg.wotc
          WHERE ((_midPt BETWEEN wotc_timein AND COALESCE(wotc_timeout, _endTime))
             AND (wotc_emp_code = _u.wotc_emp_code)
             AND (wotc_wooper_id IS NULL));

          _numJobs := _numJobs + _numWOs;

          IF (_numJobs > 0 AND (_u.wotc_emp_code = pUsername OR pUsername IS NULL)) THEN
            _returnVal := _returnVal + (_p.wotc_time - _prevTime) * 1.0 / _numJobs;
          END IF;
        
          RAISE DEBUG E'%\t%\t%\t%\t%\t%', _midPt, _endTime, _u.wotc_emp_code, _numJobs,
                    (_p.wotc_time - _prevTime) * 1.0 / _numJobs, _returnVal;

        END LOOP;

        _prevTime := _p.wotc_time;
      END IF;
    END LOOP;

  ELSE
  -- User Loop
    FOR _p IN SELECT wotc_wooper_id, wotc_time, wotc_dir
                FROM xtmfg.wotcLinearized
                WHERE ((wotc_time BETWEEN _startTime AND _endTime)
                   AND (wotc_username IN (SELECT wotc_username
                                            FROM xtmfg.wotc
                                           WHERE (wotc_wooper_id = pWooperid))))
                ORDER BY wotc_time, wotc_dir DESC LOOP
      IF (_p.wotc_time IS NOT NULL) THEN
        _midPt := _prevTime + (_p.wotc_time - _prevTime) / 2;
        FOR _u IN SELECT DISTINCT wotc_username
            FROM xtmfg.wotc
            WHERE ((_midPt BETWEEN wotc_timein AND COALESCE(wotc_timeout, _endTime))
              AND  (wotc_wooper_id=pWooperid)) LOOP

          SELECT COUNT(DISTINCT wotc_wooper_id) INTO _numJobs
          FROM xtmfg.wotc
          WHERE ((_midPt BETWEEN wotc_timein AND COALESCE(wotc_timeout, _endTime))
            AND  (wotc_username = _u.wotc_username));

          SELECT COUNT(DISTINCT wotc_wo_id) INTO _numWOs
          FROM xtmfg.wotc
          WHERE ((_midPt BETWEEN wotc_timein AND COALESCE(wotc_timeout, _endTime))
             AND (wotc_username = _u.wotc_username)
             AND (wotc_wooper_id IS NULL));

          _numJobs := _numJobs + _numWOs;

          IF (_numJobs > 0 AND (_u.wotc_username = pUsername OR pUsername IS NULL)) THEN
            _returnVal := _returnVal + (_p.wotc_time - _prevTime) * 1.0 / _numJobs;
          END IF;
        
          RAISE DEBUG E'%\t%\t%\t%\t%\t%', _midPt, _endTime, _u.wotc_username, _numJobs,
                    (_p.wotc_time - _prevTime) * 1.0 / _numJobs, _returnVal;

        END LOOP;

        _prevTime := _p.wotc_time;
      END IF;
    END LOOP;
    
  END IF; -- End Employee vs User loop
  
  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
