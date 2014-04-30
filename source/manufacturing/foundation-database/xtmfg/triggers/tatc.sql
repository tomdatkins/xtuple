CREATE OR REPLACE FUNCTION xtmfg.triggertatcafter() RETURNS TRIGGER AS $$
-- Copyright (c) 2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  IF (TG_OP = 'INSERT') THEN
      PERFORM postComment('ChangeLog', 'TATC', NEW.tatc_id, 'Time Entered');

  ELSIF (TG_OP = 'UPDATE') THEN

    IF (OLD.tatc_timein <> NEW.tatc_timein 
	  OR OLD.tatc_timeout <> NEW.tatc_timeout) THEN
      PERFORM postComment( 'ChangeLog', 'TATC', NEW.tatc_id,
                            ('Hours changed from ' || to_char((OLD.tatc_timeout::timestamp - OLD.tatc_timein::timestamp),'HH24:MI') ||
                             ' to ' || to_char((NEW.tatc_timeout::timestamp - NEW.tatc_timein::timestamp),'HH24:MI')) );
    END IF;
    	
    IF (OLD.tatc_overtime <> NEW.tatc_overtime) THEN
      PERFORM postComment( 'ChangeLog', 'TATC', NEW.tatc_id,
                            ('Overtime changed from ' || OLD.tatc_overtime || ' to ' || NEW.tatc_overtime) );
    END IF;
    
  END IF;  
        
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
  

SELECT dropIfExists('TRIGGER', 'tatcTriggerAfter', 'xtmfg');
CREATE TRIGGER tatcTriggerAfter AFTER INSERT OR UPDATE OR DELETE ON xtmfg.tatc FOR EACH ROW EXECUTE PROCEDURE xtmfg.triggertatcafter();
