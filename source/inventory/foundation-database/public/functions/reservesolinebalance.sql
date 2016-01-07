CREATE OR REPLACE FUNCTION reserveSoLineBalance(pCoitemid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  RETURN reserveSoLineBalance(pCoitemid, FALSE);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reserveSoLineBalance(pCoitemid INTEGER,
                                                pPartialReservations BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _qty     NUMERIC;
  _avail   NUMERIC;

BEGIN
  SELECT noNeg( coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned - qtyAtShipping(coitem_id) -
                itemuomtouom(itemsite_item_id, NULL, coitem_qty_uom_id, coitem_qtyreserved) ) INTO _qty
    FROM coitem LEFT OUTER JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
   WHERE (coitem_id=pCoitemid);

  IF (_qty > 0) THEN
    RETURN reserveSoLineQty(pCoitemid, pPartialReservations, _qty);
  END IF;

  RETURN -1;

END;
$$ LANGUAGE plpgsql;
