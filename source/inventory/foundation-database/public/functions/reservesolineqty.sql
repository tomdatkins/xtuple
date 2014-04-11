
CREATE OR REPLACE FUNCTION reserveSoLineQty(pCoitemid INTEGER,
                                            pQty NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  RETURN reserveSoLineQty(pCoitemid, FALSE, pQty);

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION reserveSoLineQty(pCoitemid INTEGER,
                                            pPartialReservations BOOLEAN,
                                            pQty NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  RETURN reserveSoLineQty(pCoitemid, pPartialReservations, pQty, NULL);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION reserveSoLineQty(pCoitemid INTEGER,
                                            pPartialReservations BOOLEAN,
                                            pQty NUMERIC,
                                            pItemlocid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _qtybalance     NUMERIC;
  _qtytoreserve   NUMERIC;
  _qtyavail       NUMERIC;
  _loccntrl       BOOLEAN := FALSE;
  _result         INTEGER;

BEGIN
  IF ( (pQty = 0) OR (NOT fetchMetricBool('EnableSOReservations')) ) THEN
    RETURN -4;
  END IF;

  SELECT noNeg( coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned - 
                coitem_qtyreserved - qtyAtShipping(coitem_id) ),
         itemuomtouom(itemsite_item_id, coitem_qty_uom_id, NULL, pQty),
         (COALESCE(itemsite_loccntrl, FALSE) OR COALESCE(itemsite_controlmethod IN ('S','L'), FALSE))
    INTO _qtybalance, _qtytoreserve, _loccntrl
    FROM coitem LEFT OUTER JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
   WHERE (coitem_id=pCoitemid);

  IF (_qtybalance < pQty) THEN
    RETURN -1;
  END IF;

  IF (_qtytoreserve < 0) THEN
    RETURN -2;
  END IF;

  IF (fetchMetricBool('EnableSOReservationsByLocation') AND _loccntrl) THEN
    SELECT reserveLocationQty(coitem_itemsite_id, 'SO', pCoitemid, _qtytoreserve,
                              fetchMetricValue('SOReservationLocationMethod'),
                              pPartialReservations, pItemlocid) INTO _result
      FROM coitem
     WHERE (coitem_id=pCoitemid);
    IF (_result != 0) THEN
      RETURN _result;
    END IF;
  END IF;

  SELECT (itemsite_qtyonhand
          - SUM(CASE WHEN (other.coitem_id IS NULL) THEN 0.0
                     ELSE itemuomtouom(itemsite_item_id, other.coitem_qty_uom_id, NULL, other.coitem_qtyreserved) END))
    INTO _qtyavail
    FROM coitem AS source JOIN itemsite ON (itemsite_id=source.coitem_itemsite_id)
                          LEFT OUTER JOIN coitem AS other ON ( (other.coitem_itemsite_id=itemsite_id) AND (other.coitem_qtyreserved > 0.0) )
   WHERE (source.coitem_id=pCoitemid)
   GROUP BY itemsite_qtyonhand, itemsite_item_id,
            source.coitem_qty_uom_id, source.coitem_qtyreserved;

  IF ( (_qtyavail < _qtytoreserve AND NOT pPartialReservations) OR
       (_qtyavail <= 0.0) ) THEN
    RETURN -3;
  END IF;

  IF (_qtytoreserve > _qtyavail) THEN
    _qtytoreserve := _qtyavail;
  END IF;

  UPDATE coitem
     SET coitem_qtyreserved = (coitem_qtyreserved + _qtytoreserve)
   WHERE(coitem_id=pCoitemid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
