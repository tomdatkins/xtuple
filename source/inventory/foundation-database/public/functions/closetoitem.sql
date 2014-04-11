CREATE OR REPLACE FUNCTION closeToItem(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  ptoitemid	ALIAS FOR $1;
  _atshipping	NUMERIC;
BEGIN
  SELECT COALESCE(SUM(shipitem_qty), 0) - toitem_qty_shipped INTO _atshipping
  FROM toitem LEFT OUTER JOIN
       shipitem ON (shipitem_orderitem_id=toitem_id) LEFT OUTER JOIN
       shiphead ON (shipitem_shiphead_id=shiphead_id)
  WHERE ((toitem_id=ptoitemid)
    AND (shiphead_order_type='TO'))
  GROUP BY toitem_qty_shipped;

  IF (_atshipping > 0) THEN
    RETURN -1;
  END IF;

  UPDATE toitem
  SET toitem_status='C'
  WHERE (toitem_id=ptoitemid);

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';
