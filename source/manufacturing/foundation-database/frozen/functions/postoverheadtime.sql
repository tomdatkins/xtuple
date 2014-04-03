-- Function: xtmfg.postoverheadtime(integer, date)

-- DROP FUNCTION xtmfg.postoverheadtime(integer, date);

CREATE OR REPLACE FUNCTION xtmfg.postoverheadtime(pemployee integer, pdate date)
  RETURNS integer AS
$BODY$
-- Copyright (c) 2013 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.

-- Time and Attendance post Overhead Time to G/L
DECLARE
  _emp		TEXT;
  _shift	INTEGER;
  _clearingGL	INTEGER;
  _overheadGL	INTEGER;
  _overtimeMultiplier  NUMERIC;
  _emprate	NUMERIC;
  _ohtime	NUMERIC;
  _overtime	NUMERIC;
  _value	NUMERIC;
  _notes	TEXT;
  
BEGIN

-- Get the Employee's shift Overhead GL account
   SELECT emp_shift_id, emp_code, tashift_overtimemultiplier 
	INTO _shift, _emp, _overtimeMultiplier
	FROM xtmfg.tashift
	JOIN emp ON (emp_shift_id=tashift_shift_id)
	WHERE emp_id = pEmployee;

   IF (NOT FOUND) THEN
     RAISE EXCEPTION 'Missing Employee and/or Shift configuration.';
     RETURN -1;
   END IF;  

-- Get the Overhead Liability Account
   SELECT fetchmetricvalue('LaborOverheadClearingAccnt') INTO _clearingGL;   	 

   IF (NOT FOUND OR _clearingGL IS NULL) THEN
     RAISE EXCEPTION 'Missing Overhead configuration. You must assign a Clearing GL Account in configuration';
     RETURN -2;
   END IF;  

-- Get the Employee Rate Or the Shift Rate
   SELECT xtmfg.calcrate(emp_wage, emp_wage_period) INTO _emprate
     FROM emp WHERE emp_id = pEmployee;

   IF (NOT FOUND OR _emprate = 0.00) THEN  
     SELECT COALESCE(lbrrate_rate, 0) INTO _emprate
	FROM xtmfg.tashift
	JOIN xtmfg.lbrrate ON (tashift_labor_rate = lbrrate_id)
	WHERE tashift_shift_id = _shift;
     IF (NOT FOUND OR _emprate = 0.00) THEN
       RAISE EXCEPTION 'You have not maintained an Employee or Shift Labor Rate.  Please configure this before posting.';
       RETURN -3;
     END IF;  
   END IF;  

-- Get the Employees overhead and overtime hours for the date     
  SELECT tatc_glaccnt_id, COALESCE((SUM(EXTRACT(epoch FROM (CASE WHEN (tatc_type IN ('OH', 'BR')) THEN to_char((tatc_timeout::timestamp - tatc_timein::timestamp),'HH24:MI') ELSE '00:00' END)::interval)/3600))
   + SUM( CASE WHEN (tatc_type = 'RE') THEN tatc_adjust ELSE 0 END ),0), 
    COALESCE(SUM(tatc_overtime),0) INTO _overheadGL, _ohtime, _overtime
  FROM xtmfg.tatc
  WHERE tatc_emp_id=pEmployee
   AND tatc_type IN ('OH','BR', 'RE')
   AND tatc_paid = true
   AND COALESCE(tatc_posted, false) = false
   AND tatc_timein::date = pDate
  GROUP BY tatc_glaccnt_id;

  IF (_ohtime = 0) THEN
   -- Nothing to Post
   RETURN -9;
  END IF; 

-- Execute the posting
   _notes := 'Overhead hours for ' || _emp || ' on ' || pDate;
   _value := ((_ohtime - _overtime) * _emprate) + (_overtime * (_emprate * _overtimeMultiplier));
    PERFORM insertGLTransaction( 'T/A', 'TA', _emp, _notes,
                                 _clearingGL, _overheadGL, -1,
                                 _value, pDate);

    -- Update the time and attendance item
    UPDATE xtmfg.tatc SET 
      tatc_posted = true
    WHERE tatc_emp_id=pEmployee
     AND tatc_type IN ('OH','BR', 'RE')
     AND tatc_paid = true
     AND COALESCE(tatc_posted, false) = false
     AND tatc_timein::date = pDate;
  
  RETURN 0;  
   	 
  
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xtmfg.postoverheadtime(integer, date)
  OWNER TO admin;
