
CREATE OR REPLACE FUNCTION plannedRevenue(INTEGER, INTEGER, CHARACTER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlancodeid ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;
  pPriceType ALIAS FOR $3;
  pPeriodid ALIAS FOR $4;
  _revenue NUMERIC;

BEGIN

  RETURN plannedRevenue(pPlancodeid, pWarehousid, pPriceType, pPeriodid, startOfTime(), endOfTime());

END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION plannedRevenue(INTEGER, INTEGER, CHARACTER, INTEGER, DATE, DATE) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlancodeid ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;
  pPriceType ALIAS FOR $3;
  pPeriodid ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pEndDate ALIAS FOR $6;
  _revenue NUMERIC;

BEGIN

  IF (pPriceType = ''L'') THEN
    SELECT SUM(planord_qty * item_listprice) INTO _revenue
    FROM planord, itemsite, item
    WHERE ( (planord_itemsite_id=itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (item_sold)
     AND (itemsite_plancode_id=pPlancodeid)
     AND (itemsite_warehous_id=pWarehousid)
     AND (planord_duedate BETWEEN findPeriodStart(pPeriodid) AND findPeriodEnd(pPeriodid)) );

  ELSE
    SELECT SUM(planord_qty *
               CASE WHEN(averageSalesPrice(itemsite_id, pStartDate, pEndDate) = 0) THEN item_listprice
                    ELSE averageSalesPrice(itemsite_id, pStartDate, pEndDate)
               END
              ) INTO _revenue
    FROM planord, itemsite, item
    WHERE ( (planord_itemsite_id=itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (item_sold)
     AND (itemsite_plancode_id=pPlancodeid)
     AND (itemsite_warehous_id=pWarehousid)
     AND (planord_duedate BETWEEN findPeriodStart(pPeriodid) AND findPeriodEnd(pPeriodid)) );

  END IF;

  RETURN _revenue;

END;
' LANGUAGE 'plpgsql';

