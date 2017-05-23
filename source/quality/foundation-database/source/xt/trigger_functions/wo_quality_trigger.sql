CREATE OR REPLACE FUNCTION xt.woqualitytrigger()
  RETURNS trigger AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

--  If a WO is closed/recalled also cancel related quality tests
   IF (TG_OP = 'DELETE' OR (OLD.wo_status = 'R' AND NEW.wo_status = 'E')) THEN
     UPDATE xt.qthead SET qthead_status = 'C'
     WHERE qthead_ordtype = 'WO'
      AND qthead_ordnumber = formatwonumber(OLD.wo_id);
   END IF;  

   IF (TG_OP = 'DELETE') THEN
     RETURN OLD;
   ELSE  
     RETURN NEW;
   END IF;

END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION xt.woqualitytrigger() OWNER TO admin;
GRANT EXECUTE ON FUNCTION xt.woqualitytrigger() TO xtrole;

DROP TRIGGER IF EXISTS woqualityupdatetrigger ON public.wo;

CREATE TRIGGER woqualityupdatetrigger
  AFTER UPDATE OR DELETE
  ON public.wo
  FOR EACH ROW
  EXECUTE PROCEDURE xt.woqualitytrigger();

