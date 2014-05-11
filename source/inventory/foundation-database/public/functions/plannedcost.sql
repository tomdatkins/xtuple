
CREATE OR REPLACE FUNCTION plannedCost(INTEGER, INTEGER, CHARACTER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlancodeid ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;
  pCostType ALIAS FOR $3;
  pPeriodid ALIAS FOR $4;
  _cost NUMERIC;

BEGIN

  IF (pCostType = ''S'') THEN
    SELECT SUM(planord_qty * stdcost(itemsite_item_id)) INTO _cost
    FROM planord, itemsite, item
    WHERE ( (planord_itemsite_id=itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (item_sold)
     AND (itemsite_plancode_id=pPlancodeid)
     AND (itemsite_warehous_id=pWarehousid)
     AND (planord_duedate BETWEEN findPeriodStart(pPeriodid) AND findPeriodEnd(pPeriodid)) );

  ELSIF (pCostType = ''A'') THEN
    SELECT SUM(planord_qty * actcost(itemsite_item_id)) INTO _cost
    FROM planord, itemsite, item
    WHERE ( (planord_itemsite_id=itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (item_sold)
     AND (itemsite_plancode_id=pPlancodeid)
     AND (itemsite_warehous_id=pWarehousid)
     AND (planord_duedate BETWEEN findPeriodStart(pPeriodid) AND findPeriodEnd(pPeriodid)) );

  ELSE
    _cost := 0;
  END IF;

  RETURN _cost;

END;
' LANGUAGE 'plpgsql';

