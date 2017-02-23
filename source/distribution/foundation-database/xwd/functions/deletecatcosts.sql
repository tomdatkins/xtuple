CREATE OR REPLACE FUNCTION xwd.deleteCatCosts() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _count INTEGER;

BEGIN

  PERFORM deleteCatCostItem(catcost_id)
  FROM xwd.catcost;

  GET DIAGNOSTICS _count := ROW_COUNT;
  RETURN _count;

END;
$$ LANGUAGE 'plpgsql';
