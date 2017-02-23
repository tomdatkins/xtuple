CREATE OR REPLACE FUNCTION xwd.deleteCatCostItem(pCatcostId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  DELETE FROM xwd.catcost
  WHERE catcost_id= pCatcostId;

  RETURN pCatcostId;
END;
$$ LANGUAGE 'plpgsql';
