CREATE OR REPLACE FUNCTION xt.deleteUnusedPOTypes() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  DELETE FROM xt.potype
  WHERE (potype_id NOT IN (SELECT DISTINCT vendinfoext_potype_id FROM xt.vendinfoext))
    AND (potype_id NOT IN (SELECT DISTINCT poheadext_potype_id FROM xt.poheadext));

  RETURN 0;

END;
$$ LANGUAGE plpgsql;
