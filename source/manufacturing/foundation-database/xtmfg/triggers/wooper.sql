CREATE OR REPLACE FUNCTION xtmfg.triggerWooper() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  IF ((TG_OP = 'INSERT') OR (TG_OP = 'UPDATE')) THEN
    IF (NEW.wooper_invproduomratio = 0) THEN
      NEW.wooper_invproduomratio = 1;
    END IF;
  END IF;

  IF (TG_OP = 'UPDATE' AND (OLD.wooper_rncomplete = false AND NEW.wooper_rncomplete = true)) THEN
    NEW.wooper_rncomplete_date = CURRENT_TIMESTAMP;
  END IF;

  IF (TG_OP = 'UPDATE' AND (OLD.wooper_scheduled <> NEW.wooper_scheduled)) THEN
    UPDATE womatl SET womatl_duedate=NEW.wooper_scheduled
    WHERE womatl_wo_id = NEW.wooper_wo_id
    AND   womatl_wooper_id = NEW.wooper_id
    AND   womatl_schedatwooper;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
  

SELECT dropIfExists('TRIGGER', 'wooperTrigger', 'xtmfg');
CREATE TRIGGER wooperTrigger BEFORE INSERT OR UPDATE ON xtmfg.wooper FOR EACH ROW EXECUTE PROCEDURE xtmfg.triggerWooper();

CREATE OR REPLACE FUNCTION xtmfg.triggerWooperAfter() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  UPDATE womatl SET womatl_wooper_id=-1 WHERE womatl_wooper_id=OLD.wooper_id;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';
  

SELECT dropIfExists('TRIGGER', 'wooperTriggerAfter', 'xtmfg');
CREATE TRIGGER wooperTriggerAfter AFTER DELETE ON xtmfg.wooper FOR EACH ROW EXECUTE PROCEDURE xtmfg.triggerWooperAfter();
