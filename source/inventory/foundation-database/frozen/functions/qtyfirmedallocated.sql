CREATE OR REPLACE FUNCTION qtyFirmedAllocated(INTEGER, DATE, DATE) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _qty NUMERIC;

BEGIN

  SELECT COALESCE(SUM(planreq_qty), 0.0) INTO _qty
  FROM planreq, planord
  WHERE ( (planreq_source=''P'')
   AND (planreq_source_id=planord_id)
   AND (planord_firm)
   AND (planreq_itemsite_id=pItemsiteid)
   AND (planord_startdate BETWEEN pStartDate AND pEndDate) );

  RETURN _qty;

END;
' LANGUAGE 'plpgsql';
