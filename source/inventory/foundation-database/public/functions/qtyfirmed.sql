CREATE OR REPLACE FUNCTION qtyFirmed(INTEGER, DATE, DATE) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _qty NUMERIC;

BEGIN

  SELECT COALESCE(SUM(planord_qty),0.0) INTO _qty
  FROM planord
  WHERE ((planord_itemsite_id=pItemsiteid)
   AND (planord_firm)
   AND (planord_duedate BETWEEN pStartDate AND pEndDate));

  RETURN _qty;

END;
' LANGUAGE 'plpgsql';
