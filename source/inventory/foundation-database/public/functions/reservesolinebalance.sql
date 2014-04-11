CREATE OR REPLACE FUNCTION reserveSoLineBalance(pCoitemid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  RETURN reserveSoLineBalance(pCoitemid, TRUE);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION reserveSoLineBalance(pCoitemid INTEGER,
                                                pPartialReservations BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _qty     NUMERIC;
  _avail   NUMERIC;

BEGIN
  SELECT noNeg( coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned - coitem_qtyreserved -
                qtyAtShipping(coitem_id) ) INTO _qty
    FROM coitem
   WHERE (coitem_id=pCoitemid);

  IF (_qty > 0) THEN
    RETURN reserveSoLineQty(pCoitemid, pPartialReservations, _qty);
  END IF;

  RETURN -1;

END;
$$ LANGUAGE 'plpgsql';
