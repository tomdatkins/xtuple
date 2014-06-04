-- Function: xtmfg.returnovertimehours(integer, numeric)

-- DROP FUNCTION xtmfg.returnovertimehours(integer, numeric);

CREATE OR REPLACE FUNCTION xtmfg.returnovertimehours(pemployee integer, phours numeric)
  RETURNS numeric AS
$BODY$
-- Copyright (c) 2013 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.

-- Time and Attendance.  Calculate Overtime hours
DECLARE
  _hours	NUMERIC;
  _shift 	RECORD;
BEGIN	

  -- Get Shift details
   SELECT *
     INTO _shift
     FROM xtmfg.tashift
     JOIN emp ON (emp_shift_id = tashift_shift_id)
     WHERE emp_id = pEmployee;

  -- Check for Overtime otherwise do nothing
   IF _shift.tashift_overtimehours_week < 1 THEN
     RETURN 0; -- No weekly overtime
   END IF;  

  -- Get Hours for Current Week
   SELECT SUM(EXTRACT(epoch FROM to_char((tatc_timeout::timestamp - tatc_timein::timestamp),'HH24:MI')::interval)/3600)
   INTO _hours
   FROM xtmfg.tatc
   WHERE tatc_emp_id = pEmployee
   AND tatc_type <> 'BR'
   AND tatc_timein BETWEEN (date_trunc('week', now())::date - 1) AND (date_trunc('week', (now())::date + INTERVAL '1 week' - INTERVAL '1 day'));

   IF ((_hours + pHours) - _shift.tashift_overtimehours_week) > pHours THEN
     RETURN pHours;
   ELSE 
     RETURN GREATEST(((_hours + pHours) - _shift.tashift_overtimehours_week),0);	 
   END IF;
  
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xtmfg.returnovertimehours(integer, numeric)
  OWNER TO admin;
