CREATE OR REPLACE FUNCTION _docassTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (NEW.docass_source_type = 'INCDT') THEN
    UPDATE incdt SET incdt_updated = now() WHERE incdt_id = NEW.docass_source_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropifexists('TRIGGER' ,'docassTrigger');
CREATE TRIGGER docassTrigger AFTER INSERT OR UPDATE ON docass FOR EACH ROW EXECUTE PROCEDURE _docassTrigger();

CREATE OR REPLACE FUNCTION _docassdeletetrigger()
  RETURNS trigger AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    CASE OLD.docass_target_type
      WHEN 'URL' THEN DELETE FROM url WHERE url_id = OLD.docass_target_id;
      WHEN 'FILE' THEN DELETE FROM file WHERE file_id = OLD.docass_target_id;
    END CASE;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

SELECT dropifexists('TRIGGER' ,'docassdeleteTrigger');
CREATE TRIGGER docassdeleteTrigger AFTER DELETE ON docass FOR EACH ROW EXECUTE PROCEDURE _docassdeleteTrigger();
