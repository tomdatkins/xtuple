CREATE OR REPLACE FUNCTION qtyPlannedDemand(INTEGER, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _qty NUMERIC;

BEGIN
  SELECT COALESCE(SUM(qty), 0.0) INTO _qty
  FROM (
-- Planned material requirements
  SELECT COALESCE(planreq_qty, 0.0) AS qty
    FROM planreq, planord
   WHERE ( (planreq_source='P')
     AND   (planreq_source_id=planord_id)
     AND   (planreq_itemsite_id=pItemsiteid)
     AND   (planord_startdate between pStartDate AND pEndDate) )
  UNION ALL
-- Planned Transfer Order supply sites
  SELECT COALESCE(planord_qty, 0.0) AS qty
    FROM planord
   WHERE ( (planord_type='T')
     AND   (planord_supply_itemsite_id=pItemsiteid)
     AND   (planord_startdate between pStartDate AND pEndDate) )
       ) AS data;

  RETURN _qty;
END;
$$ LANGUAGE 'plpgsql';
