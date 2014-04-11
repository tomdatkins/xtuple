-- Function: xtmfg.taclockout(integer, integer, timestamp with time zone, boolean)

-- DROP FUNCTION xtmfg.taclockout(integer, integer, timestamp with time zone, boolean);

CREATE OR REPLACE FUNCTION xtmfg.taclockout(pwotc integer, pemployee integer, pclockout timestamp with time zone, pin boolean DEFAULT false)
  RETURNS integer AS
$BODY$
-- Copyright (c) 2013 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.

-- Time and Attendance.  Clock Out Employee and manage overhead and breaks
-- 			  In particular insert breaks into WO time.
DECLARE
  _rec 		RECORD;
  _shift 	RECORD;
  _shifttime 	RECORD;
  _currtime 	TIMESTAMP WITHOUT TIME ZONE;
  _init 	BOOLEAN:=false;
  _wotc   	INTEGER;
  _hours	NUMERIC;
  _shiftDate	DATE;
  _time		TIME := null;
  _othours	NUMERIC;
  _ohaccnt	INTEGER;
  _count	INTEGER := 0;
BEGIN	

-- Get Shift details
   SELECT *,
     (tashift_endtime - (tashift_rndbeforeend::text || 'min')::interval) as end1,    
     (tashift_endtime + (tashift_rndafterend::text || 'min')::interval) as end2 
     INTO _shift
     FROM xtmfg.tashift
     JOIN emp ON (emp_shift_id = tashift_shift_id)
     WHERE emp_id = pEmployee;
    
-- Return last open Time Clock entry for Employee
   SELECT * INTO _rec
      FROM xtmfg.tatc
      WHERE 1=1 --CASE WHEN (pWotc IS NOT NULL) THEN tatc_wotc_id = pWotc ELSE 1=1 END
       AND  tatc_emp_id = pEmployee
       AND  tatc_timeout IS NULL
      ORDER BY tatc_id DESC LIMIT 1;
   
   IF FOUND THEN
	_currtime = _rec.tatc_timein;
	_shiftDate = _currtime::DATE;  
	_wotc 	= _rec.tatc_wotc_id;
   ELSE 
	RETURN 0;
   END IF;	

   -- Determine Default Overhead Account Id from Overhead Categories
   SELECT ovrhead_accnt_id INTO _ohaccnt FROM xtmfg.ovrhead WHERE ovrhead_default;
   IF (NOT FOUND) THEN
       -- Default to Shift Overhead Account
	SELECT tashift_overhead_accnt_id INTO _ohaccnt
	FROM xtmfg.tashift
	JOIN emp ON (emp_shift_id=tashift_shift_id)
	WHERE emp_id = pEmployee;
   END IF;	

-- --------------------------------------------------------------------------------
-- Loop through Shift until clockout (or auto-clockout) taking into account breaks
-- --------------------------------------------------------------------------------
     <<interim_postings>>
     FOR _shifttime IN
       SELECT * FROM xtmfg.vw_tashift
       WHERE tashift_shift_id = _shift.tashift_shift_id       
         AND stime BETWEEN (_currtime::time  + interval '1 min') AND pClockOut::time
         AND type NOT IN ('S','E')
       ORDER BY sorder  
     LOOP
     -- Increment Day if necessary
	IF (_shifttime.stime < _time AND _time IS NOT NULL) THEN
	  _shiftDate = _shiftDate + 1;
	END IF;
	  
        _time = _shifttime.stime;
       
     -- Determine Overtime Hours
       IF _shifttime.type = 'B' THEN
         _othours = 0;
       ELSE  
         _hours = EXTRACT(epoch FROM to_char(((_shiftDate + _shifttime.stime) - _currtime),'HH24:MI')::interval)/3600;
         SELECT xtmfg.returnovertimehours(pEmployee, _hours) INTO _othours;
       END IF;  
       
       IF (_shifttime.openclose = 'O') THEN
           -- Close previous record
           UPDATE xtmfg.tatc SET  tatc_timeout=(_shiftDate + _shifttime.stime), tatc_overtime = _othours
           WHERE tatc_emp_id = pEmployee
            AND  tatc_timein = _currtime;
          -- Start new record  
          INSERT INTO xtmfg.tatc VALUES (DEFAULT, pEmployee, CASE WHEN _shifttime.type = 'B' THEN 'BR' ELSE 'OH' END,null, null, _shiftDate + _shifttime.stime, 
		null, null, null, _ohaccnt, _shifttime.paid);
       ELSE
         UPDATE xtmfg.tatc SET  tatc_timeout=(_shiftDate + _shifttime.stime), tatc_overtime = _othours, tatc_paid=_shifttime.paid 
           WHERE tatc_emp_id = pEmployee
            AND  tatc_timein = _currtime;
         -- Reopen time if needed
         IF (_shifttime.type = 'D') THEN -- Auto Clockout
            EXIT interim_postings;
         ELSE   
           IF ((_shiftDate + _shifttime.stime) < pClockOut) THEN
             INSERT INTO xtmfg.tatc VALUES (DEFAULT, pEmployee, CASE WHEN _wotc IS NULL THEN 'OH' ELSE 'WO' END,_wotc, null, (_shiftDate + _shifttime.stime), 
	  	null, null, null, _ohaccnt, false);
           END IF; 
         END IF;  

       END IF;     
		
       _currtime = _shiftDate + _shifttime.stime;
       
     END LOOP interim_postings;


-- ---------------------------------------------------
-- Close the Time Entry in question
-- ---------------------------------------------------
    IF pWotc IS NOT NULL THEN
    -- Close open WO record
         _hours = EXTRACT(epoch FROM to_char((pClockOut - _currtime),'HH24:MI')::interval)/3600;
         SELECT xtmfg.returnovertimehours(pEmployee, _hours) INTO _othours;

         -- incident 21560; always set tatc_paid to true, don't know how to determine
         UPDATE  xtmfg.tatc SET  tatc_timeout=pClockOut, tatc_overtime = _othours, tatc_paid=true
           WHERE tatc_emp_id = pEmployee
            AND  tatc_wotc_id IS NULL
            AND  tatc_timeout IS NULL;
            
         UPDATE xtmfg.tatc SET  tatc_timeout=pClockOut, tatc_overtime = _othours, tatc_posted=true, tatc_paid=true
           WHERE tatc_emp_id = pEmployee
            AND  tatc_timein = _currtime
            AND  tatc_wotc_id = pWotc;

    -- Check all WO time has been closed and if so open OH time 
           SELECT count(*) INTO _wotc
            FROM xtmfg.tatc
            WHERE tatc_emp_id = pEmployee
	      AND   tatc_timein::date = pClockOut::date
	      AND   tatc_timeout IS NULL
	      AND   tatc_type = 'WO';
     
	   IF (_wotc = 0 AND NOT pIn) THEN     
             PERFORM xtmfg.taClockIn(null, pEmployee,_ohaccnt, pClockout);
   	   END IF;	
   ELSE
-- Close Overhead Time and thus the shift.
-- Work Out Shift End time rounding
     IF (pWotc IS NULL AND (pClockOut::time BETWEEN _shift.end1 AND _shift.end2)) THEN
       _currtime = _shiftDate + _shift.tashift_endtime;
     ELSIF (pWotc IS NULL AND (pClockout::time > _shift.end2)) THEN
       _currtime = least(
	  date_trunc('hour', pClockOut) + INTERVAL '6 min' * ROUND(date_part('minute', pClockOut) / 6.0),
	  date_trunc('hour', pClockOut) + INTERVAL '6 min' * ROUND(date_part('minute', pClockOut - interval '3 min') / 6.0));  
     ELSE 
       _currtime = pClockOut;  
     END IF;       

     -- First determine closing hours and overtime
     SELECT EXTRACT(epoch FROM to_char((_currtime - tatc_timein),'HH24:MI')::interval)/3600 
     INTO _hours
     FROM xtmfg.tatc
     WHERE tatc_emp_id = pEmployee
         AND  tatc_timein::date = _currtime::date
         AND  tatc_type = 'OH'
         AND  tatc_timeout IS NULL;

     SELECT xtmfg.returnovertimehours(pEmployee, _hours) INTO _othours;    

     UPDATE xtmfg.tatc SET  tatc_timeout=_currtime, tatc_overtime = _othours,
                            tatc_paid = CASE WHEN tatc_type='OH' THEN TRUE
                                             ELSE tatc_paid END
       WHERE tatc_emp_id = pEmployee
         AND  tatc_timein::date = _currtime::date
         AND  tatc_type = 'OH'
         AND  tatc_timeout IS NULL;
         
   END IF; -- end wo versus overhead clockout   

-- WO time gets posted elsewhere so mark posted here. 
   UPDATE xtmfg.tatc SET tatc_posted=true 
     WHERE tatc_posted=false 
     AND   tatc_emp_id = pEmployee
     AND   tatc_type = 'WO'
     AND   tatc_timeout IS NOT NULL;
     
   RETURN 0;	 
  
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xtmfg.taclockout(integer, integer, timestamp with time zone, boolean)
  OWNER TO admin;
