CREATE OR REPLACE FUNCTION xwd._catcommTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  IF (OLD.catcomm_level != NEW.catcomm_level) THEN
    PERFORM updateCommLevel(NEW.catcomm_pik, NEW.catcomm_level, 0);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'catcommTrigger', 'xwd');
CREATE TRIGGER catcommTrigger AFTER UPDATE ON xwd.catcomm FOR EACH ROW EXECUTE PROCEDURE xwd._catcommTrigger();
