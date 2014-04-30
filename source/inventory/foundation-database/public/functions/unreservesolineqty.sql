
CREATE OR REPLACE FUNCTION unreserveSoLineQty(pCoitemid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.

BEGIN

  RETURN unreserveSoLineQty(pCoitemid, coitem_qtyreserved)
  FROM coitem
  WHERE (coitem_id=pCoitemid);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION unreserveSoLineQty(pCoitemid INTEGER,
                                              pQty NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.

BEGIN

  RETURN unreserveSoLineQty(pCoitemid, pQty, NULL);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION unreserveSoLineQty(pCoitemid INTEGER,
                                              pQty NUMERIC,
                                              pItemlocid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _result  INTEGER;
  _loccntrl BOOLEAN := FALSE;

BEGIN
  IF ( (pQty = 0) OR (NOT fetchMetricBool('EnableSOReservations')) ) THEN
    RETURN 0;
  END IF;

  SELECT (COALESCE(itemsite_loccntrl, FALSE) OR COALESCE(itemsite_controlmethod IN ('S','L'), FALSE))
    INTO _loccntrl
    FROM coitem LEFT OUTER JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
   WHERE (coitem_id=pCoitemid);

  IF (fetchMetricBool('EnableSOReservationsByLocation') AND _loccntrl) THEN
    SELECT unreserveLocationQty('SO', pCoitemid, pQty, pItemlocid) INTO _result;
     IF (_result != 0) THEN
       RETURN -1;
     END IF;
  END IF;

  UPDATE coitem
     SET coitem_qtyreserved = (coitem_qtyreserved - pQty)
   WHERE(coitem_id=pCoitemid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
