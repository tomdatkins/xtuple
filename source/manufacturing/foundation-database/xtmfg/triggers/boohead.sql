CREATE OR REPLACE FUNCTION xtmfg._booheadTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
-- Privilege Checks
  IF (NOT checkPrivilege('MaintainBOOs')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Bills of Operations.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'booheadTrigger', 'xtmfg');
CREATE TRIGGER booheadTrigger AFTER INSERT OR UPDATE OR DELETE ON xtmfg.boohead FOR EACH ROW EXECUTE PROCEDURE xtmfg._booheadTrigger();
