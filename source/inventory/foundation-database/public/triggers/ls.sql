CREATE OR REPLACE FUNCTION _lsAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  DELETE
  FROM charass
  WHERE charass_target_type = 'LS'
    AND charass_target_id = OLD.ls_id;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'lsAfterDeleteTrigger');
CREATE TRIGGER lsAfterDeleteTrigger
  AFTER DELETE
  ON ls
  FOR EACH ROW
  EXECUTE PROCEDURE _lsAfterDeleteTrigger();
