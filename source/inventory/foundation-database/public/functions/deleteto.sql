CREATE OR REPLACE FUNCTION deleteTo(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pToheadid	ALIAS FOR $1;

  _r		RECORD;
  _test		INTEGER;
  _tonumber	INTEGER;

BEGIN

  SELECT toitem_id INTO _test
  FROM toitem
  WHERE ((toitem_qty_shipped > 0)
    AND  (toitem_tohead_id=pToheadid));
  IF (FOUND) THEN
    RETURN -1;
  END IF;

  SELECT shipitem_id INTO _test
  FROM shipitem, shiphead, toitem
  WHERE ((shipitem_orderitem_id=toitem_id)
    AND  (shipitem_shiphead_id=shiphead_id)
    AND  (shiphead_order_type='TO')
    AND  (toitem_tohead_id=pToheadid));
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  DELETE FROM toitem
  WHERE (toitem_tohead_id=pToheadid);

  SELECT tohead_number INTO _tonumber
  FROM tohead
  WHERE (tohead_id=pToheadid);

  DELETE FROM tohead
  WHERE (tohead_id=pToheadid);

  IF (NOT releaseToNumber(_tonumber)) THEN
    RETURN -3;
  END IF;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';
