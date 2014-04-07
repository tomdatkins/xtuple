CREATE OR REPLACE FUNCTION qtyPlanned(INTEGER, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _total NUMERIC := 0.0;
  _qty NUMERIC;

BEGIN

  -- Show planned orders
  SELECT COALESCE(SUM(planord_qty),0) INTO _qty
  FROM planord
  WHERE ((planord_itemsite_id=pItemsiteid)
   AND (planord_duedate BETWEEN pStartDate AND pEndDate));

  _total := _total + _qty;

  -- Show purchase requests
  SELECT COALESCE(SUM(pr_qtyreq),0.0) INTO _qty
    FROM pr
   WHERE ((pr_itemsite_id=pItemsiteid)
     AND  (pr_duedate BETWEEN pStartDate AND pEndDate));

  _total := _total + _qty;

  -- Show tools that will be returned
  SELECT COALESCE(SUM(planreq_qty),0.0) INTO _qty
    FROM planreq
      JOIN itemsite ON (itemsite_id=planreq_itemsite_id)
      JOIN item ON (item_id=itemsite_item_id)
      JOIN planord ON ((planreq_source_id=planord_id)
                  AND (planreq_source='P'))
   WHERE ((planreq_itemsite_id=pItemsiteid)
     AND  (item_type='T')
     AND  (planord_duedate BETWEEN pStartDate AND pEndDate));

  _total := _total + _qty;

  RETURN _total;
END;
$$ LANGUAGE 'plpgsql';
