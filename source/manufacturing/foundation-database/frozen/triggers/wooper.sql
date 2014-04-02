CREATE OR REPLACE FUNCTION xtmfg.triggerWooper() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  IF ((TG_OP = 'INSERT') OR (TG_OP = 'UPDATE')) THEN
--  wooper_rnqtyper of 0 is valid, do not override
--    IF (NEW.wooper_rnqtyper = 0) THEN
--      NEW.wooper_rnqtyper = 1;
--    END IF;

    IF (NEW.wooper_invproduomratio = 0) THEN
      NEW.wooper_invproduomratio = 1;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
  

SELECT dropIfExists('TRIGGER', 'wooperTrigger', 'xtmfg');
CREATE TRIGGER wooperTrigger BEFORE INSERT OR UPDATE ON xtmfg.wooper FOR EACH ROW EXECUTE PROCEDURE xtmfg.triggerWooper();

CREATE OR REPLACE FUNCTION xtmfg.triggerWooperAfter() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  UPDATE womatl SET womatl_wooper_id=-1 WHERE womatl_wooper_id=OLD.wooper_id;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';
  

SELECT dropIfExists('TRIGGER', 'wooperTriggerAfter', 'xtmfg');
CREATE TRIGGER wooperTriggerAfter AFTER DELETE ON xtmfg.wooper FOR EACH ROW EXECUTE PROCEDURE xtmfg.triggerWooperAfter();
