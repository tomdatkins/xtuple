CREATE OR REPLACE FUNCTION _lsregAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  DELETE
  FROM charass
  WHERE charass_target_type = 'LSR'
    AND charass_target_id = OLD.lsreg_id;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'lsregAfterDeleteTrigger');
CREATE TRIGGER lsregAfterDeleteTrigger
  AFTER DELETE
  ON lsreg
  FOR EACH ROW
  EXECUTE PROCEDURE _lsregAfterDeleteTrigger();
