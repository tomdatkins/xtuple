CREATE OR REPLACE FUNCTION xtmfg.taclockout(pwotc integer, pemployee integer, pclockout timestamp with time zone, pin boolean DEFAULT false)
  RETURNS integer AS
$BODY$
-- Copyright (c) 2013-2014 by OpenMFG LLC, d/b/a xTuple. 
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
  _paid		BOOLEAN;
  _count	INTEGER := 0;
BEGIN	

-- Get Shift details
   SELECT *,
     (tashift_endtime - (tashift_rndbeforeend::text || 'min')::interval) as end1,    
     (tashift_endtime + (tashift_rndafterend::text || 'min')::interval) as end2,
     CASE WHEN (tashift_starttime > tashift_endtime) THEN true ELSE false END as splitday 
     INTO _shift
     FROM xtmfg.tashift
     JOIN emp ON (emp_shift_id = tashift_shift_id)
     WHERE emp_id = pEmployee;

     RAISE NOTICE 'Multi-Day Shift: %', _shift.splitday;
    
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
-- #23766, #22132 Also has to handle auto-clock out and shifts spanning calendar days
-- --------------------------------------------------------------------------------
     <<interim_postings>>
     FOR _shifttime IN
      SELECT * FROM (
        -- Previous Day
        SELECT 'PD' as prevday, _shiftDate as sdate, * FROM xtmfg.vw_tashift
         WHERE tashift_shift_id = _shift.tashift_shift_id
          AND (stime BETWEEN (_currtime::time  + interval '1 min') AND _shift.tashift_default_clockout)
          AND ("type" NOT IN ('S','E'))
        UNION   
        -- Current Day
        SELECT 'CD' as prevday, pClockOut::date as sdate, * FROM xtmfg.vw_tashift
         WHERE tashift_shift_id = _shift.tashift_shift_id       
          AND (stime BETWEEN (_currtime::time  + interval '1 min') AND pClockOut::time)
          AND ("type" NOT IN ('S','E'))
        UNION
        -- Split Day (shift spans calendar days)
        SELECT * FROM
         (SELECT 'MD' as prevday, _shiftDate::date as sdate, * FROM xtmfg.vw_tashift
            WHERE tashift_shift_id = _shift.tashift_shift_id       
              AND ((_shiftDate::date + stime) BETWEEN (_currtime  + interval '1 min')::timestamp AND (_shiftDate::date + ' 23:59:59'::time)::timestamp)
              AND ((_shiftDate::date + stime) < pClockOut::timestamp)
              AND ("type" NOT IN ('S','E'))  
	  UNION SELECT 'MD' as prevday, (_shiftDate::date + interval '1 day') as sdate, * FROM xtmfg.vw_tashift
            WHERE tashift_shift_id = _shift.tashift_shift_id       
              AND (((_shiftDate::date + interval '1 day') + stime) BETWEEN ((_shiftDate::date + interval '1 day')::date + ' 00:00:00'::time)::timestamp AND pClockOut::timestamp)
              AND ("type" NOT IN ('S','E'))
          ) as multi  
          
     ) data
       WHERE CASE WHEN _shift.splitday THEN prevday = 'MD'
		WHEN _shiftDate < pClockOut::date THEN prevday = 'PD'
		ELSE prevday = 'CD' END
       ORDER BY sdate, sorder	
  
     LOOP  
        _time = _shifttime.stime;
       
     -- Determine Overtime Hours
       IF _shifttime.type = 'B' THEN
         _othours = 0;
         _paid = _shifttime.paid;
       ELSE  
         _hours = EXTRACT(epoch FROM ((_shifttime.sdate + _shifttime.stime) - _currtime))/3600;
         SELECT xtmfg.returnovertimehours(pEmployee, _hours) INTO _othours;
         _paid = TRUE;
       END IF;  
       
       IF (_shifttime.openclose = 'O') THEN
           -- Close previous record
           UPDATE xtmfg.tatc SET  tatc_timeout=(_shifttime.sdate + _shifttime.stime), tatc_overtime = _othours
           WHERE tatc_emp_id = pEmployee
            AND  tatc_timein = _currtime;
          -- Start new record  
          raise notice 'Check time %', _shifttime.sdate + _shifttime.stime;
          INSERT INTO xtmfg.tatc (tatc_id, tatc_emp_id, tatc_type, tatc_wotc_id, tatc_wo_id, tatc_timein, tatc_timeout, tatc_overtime, tatc_notes, tatc_glaccnt_id, tatc_posted, tatc_paid)
            VALUES (DEFAULT, pEmployee, CASE WHEN _shifttime.type = 'B' THEN 'BR' ELSE 'OH' END,null, null, _shifttime.sdate + _shifttime.stime, 
		null, null, null, _ohaccnt, false, _paid);
       ELSE
         UPDATE xtmfg.tatc SET  tatc_timeout=(_shifttime.sdate + _shifttime.stime), tatc_overtime = _othours, tatc_paid= _paid 
           WHERE tatc_emp_id = pEmployee
            AND  tatc_timein = _currtime;
         -- Reopen time if needed
         IF (_shifttime.type = 'D') THEN -- Auto Clockout
            _currtime = _shifttime.sdate + _shifttime.stime;
            EXIT interim_postings;
         ELSE   
           IF ((_shifttime.sdate + _shifttime.stime) < pClockOut) THEN
             INSERT INTO xtmfg.tatc (tatc_id, tatc_emp_id, tatc_type, tatc_wotc_id, tatc_wo_id, tatc_timein, tatc_timeout, tatc_overtime, tatc_notes, tatc_glaccnt_id, tatc_posted, tatc_paid)
               VALUES (DEFAULT, pEmployee, CASE WHEN _wotc IS NULL THEN 'OH' ELSE 'WO' END,_wotc, null, (_shifttime.sdate + _shifttime.stime), 
	  	null, null, null, _ohaccnt, false, true);
           END IF; 
         END IF;  

       END IF;     
		
       _currtime = _shifttime.sdate + _shifttime.stime;
       
     END LOOP interim_postings;

    _shiftDate = pClockOut::date;

-- ---------------------------------------------------
-- Close the Time Entry in question
-- ---------------------------------------------------
    IF pWotc IS NOT NULL THEN
    -- Close open WO record
         _hours = EXTRACT(epoch FROM (pClockOut - _currtime))/3600;
         SELECT xtmfg.returnovertimehours(pEmployee, _hours) INTO _othours;

         -- incident 21560; always set tatc_paid to true, don't know how to determine
         UPDATE  xtmfg.tatc SET  tatc_timeout=pClockOut, tatc_overtime = _othours, tatc_paid=true
           WHERE tatc_emp_id = pEmployee
            AND  tatc_wotc_id IS NULL
            AND  tatc_timeout IS NULL;
            
         UPDATE xtmfg.tatc SET  tatc_timeout=pClockOut, tatc_overtime = _othours, 
             tatc_posted=true, tatc_paid=true, tatc_glaccnt_id=null
           WHERE tatc_emp_id = pEmployee
            AND  tatc_timein = _currtime
            AND  tatc_wotc_id = pWotc
            AND  tatc_timeout IS NULL;

    -- Check all WO time has been closed and if so open OH time 
    -- but only if still within shift hours
           SELECT count(*) INTO _wotc
            FROM xtmfg.tatc
            WHERE tatc_emp_id = pEmployee
	      AND   tatc_timein::date = pClockOut::date
	      AND   tatc_timeout IS NULL
	      AND   tatc_type = 'WO';
     
	   IF (_wotc = 0 AND NOT pIn) THEN     
	     IF (pClockout < _shiftDate + _shift.tashift_endtime) THEN
               PERFORM xtmfg.taClockIn(null, pEmployee,_ohaccnt, pClockout);
             END IF;  
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
     SELECT EXTRACT(epoch FROM (_currtime - tatc_timein))/3600 
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
   UPDATE xtmfg.tatc SET tatc_posted=true, tatc_glaccnt_id=null 
     WHERE tatc_posted=false 
     AND   tatc_emp_id = pEmployee
     AND   tatc_type = 'WO'
     AND   tatc_timeout IS NOT NULL;
     
   RETURN 0;	 
  
END;
$BODY$
  LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION xtmfg.taclockout(integer, integer, timestamp with time zone, boolean)
  OWNER TO admin;
