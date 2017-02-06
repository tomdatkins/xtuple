CREATE OR REPLACE FUNCTION xt.deleteUnusedPOTypes() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  DELETE FROM xt.potype
  WHERE (potype_id NOT IN (SELECT DISTINCT COALESCE(vendinfoext_potype_id, -1) FROM xt.vendinfoext))
    AND (potype_id NOT IN (SELECT DISTINCT COALESCE(poheadext_potype_id, -1) FROM xt.poheadext));

  RETURN 0;

END;
$$ LANGUAGE plpgsql;
