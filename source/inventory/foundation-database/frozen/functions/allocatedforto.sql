CREATE OR REPLACE FUNCTION allocatedForTo(INTEGER, DATE, DATE) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid	ALIAS FOR $1;
  pStartDate	ALIAS FOR $2;
  pEndDate	ALIAS FOR $3;
  _metric	TEXT;
  _qty		NUMERIC;

BEGIN

  IF (NOT fetchMetricBool(''MultiWhs'')) THEN
    RETURN 0;
  END IF;

  SELECT COALESCE(SUM(noNeg(toitem_qty_ordered - (toitem_qty_shipped + qtyAtShipping(''TO'', toitem_id)))), 0.0) INTO _qty
  FROM toitem, tohead, itemsite
  WHERE ( (toitem_item_id=itemsite_item_id)
    AND (toitem_tohead_id=tohead_id)
    AND (tohead_src_warehous_id=itemsite_warehous_id)
    AND (toitem_status NOT IN (''C'', ''X''))
    AND (itemsite_id=pItemsiteid)
    AND (toitem_schedshipdate BETWEEN pStartDate AND pEndDate) );

  RETURN _qty;

END;
' LANGUAGE 'plpgsql';
