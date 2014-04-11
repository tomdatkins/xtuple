
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

BEGIN
  IF (NOT fetchMetricBool('EnableSOReservations')) THEN
    RETURN 0;
  END IF;

  IF (fetchMetricBool('EnableSOReservationsByLocation')) THEN
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
