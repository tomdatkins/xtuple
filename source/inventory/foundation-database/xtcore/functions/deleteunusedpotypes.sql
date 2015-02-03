CREATE OR REPLACE FUNCTION xtcore.deleteUnusedPOTypes() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  DELETE FROM xtcore.potype
  WHERE (potype_id NOT IN (SELECT DISTINCT vend_potype_id FROM vendinfo))
    AND (potype_id NOT IN (SELECT DISTINCT pohead_potype_id FROM pohead));

  RETURN 0;

END;
$$ LANGUAGE plpgsql;
