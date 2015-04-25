CREATE OR REPLACE FUNCTION _sourceBeforeUpsertTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.source_created := CURRENT_TIMESTAMP;
  ELSE
    NEW.source_created := OLD.source_created;
    NEW.source_enum    := COALESCE(NEW.source_enum, OLD.source_enum);
  END IF;

  IF COALESCE(NEW.source_module, '') = '' THEN
    NEW.source_module = 'System';
  END IF;
  IF NEW.source_enum IS NULL OR
     EXISTS(SELECT 1 FROM source
             WHERE source_enum = NEW.source_enum
               AND source_id != NEW.source_id) THEN
    SELECT max(source_enum) + 1 FROM SOURCE INTO NEW.source_enum;
  END IF;
  NEW.source_last_modified := CURRENT_TIMESTAMP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

SELECT dropIfExists('TRIGGER', 'sourceBeforeUpsertTrigger');
CREATE TRIGGER sourceBeforeUpsertTrigger BEFORE INSERT OR UPDATE ON source
   FOR EACH ROW EXECUTE PROCEDURE _sourceBeforeUpsertTrigger();
