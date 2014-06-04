CREATE OR REPLACE FUNCTION xtmfg.taclockin(pwotc integer, pemployee integer, poverhead integer, pclockin timestamp with time zone)
  RETURNS integer AS
$BODY$
-- Copyright (c) 2013 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.

-- Time and Attendance.  Clock in Employee and manage overhead and breaks
DECLARE
  _rec 		RECORD;
  _shift 	RECORD;
  _shifttime 	RECORD;
  _currtime 	TIMESTAMP WITH TIME ZONE;
  _init 	BOOLEAN :=false;
  _exist 	INTEGER;
  _oh		INTEGER;
BEGIN	

-- Get Shift details
   SELECT *,
     (tashift_starttime - (tashift_rndbeforestart::text || 'min')::interval) as start1,    
     (tashift_starttime + (tashift_rndafterstart::text || 'min')::interval) as start2 
     INTO _shift
     FROM xtmfg.tashift
     JOIN emp ON (emp_shift_id = tashift_shift_id)
     WHERE emp_id = pEmployee;
       
   _currtime = pClockIn;  

-- Check if first entry
   SELECT count(*) INTO _exist
   FROM xtmfg.tatc
     WHERE tatc_emp_id = pEmployee
     AND   tatc_timein::date = pClockIn::date;

-- Check Overhead Check In to prevent double starting shift
   IF (_exist <> 0 AND pWotc IS NULL) THEN
     SELECT count(*) INTO _oh
      FROM xtmfg.tatc
      WHERE tatc_emp_id = pEmployee
       AND   tatc_timein::date = pClockIn::date
       AND   tatc_type IN ('BR', 'OH')
       AND   tatc_timeout IS NULL;
     IF _oh > 0 THEN
       RETURN -2;
     END IF;
   END IF;    

-- Work Out Shift Start time rounding
   IF (_exist = 0 AND (pClockIn::time BETWEEN _shift.start1 AND _shift.start2)) THEN
     _currtime = current_date + _shift.tashift_starttime;
   ELSIF (_exist = 0 AND (pClockIn::time < _shift.start1)) THEN
     _currtime = greatest(
	date_trunc('hour', pClockIn) + INTERVAL '6 min' * ROUND(date_part('minute', pClockIn) / 6.0),
	date_trunc('hour', pClockIn) + INTERVAL '6 min' * ROUND(date_part('minute', pClockIn + interval '3 min') / 6.0));   
   END IF;  

-- Auto Clock out of existing (previous) time entry
   PERFORM xtmfg.taClockOut(pWotc, pEmployee, pClockIn, true);
     
-- Now create new entries          
   INSERT INTO xtmfg.tatc VALUES (DEFAULT, pEmployee,CASE WHEN (pWotc IS NULL) THEN 'OH' ELSE 'WO' END,pWotc, null, _currtime, 
		null, null, null, poverhead, false);
   
   RETURN 0;	 
  
END;
$BODY$
  LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION xtmfg.taclockin(integer, integer, integer, timestamp with time zone)
  OWNER TO admin;
