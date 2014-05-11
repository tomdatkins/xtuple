
CREATE OR REPLACE FUNCTION unreserveLocationQty(pDemandtype TEXT,
                                                pDemandid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  DELETE FROM reserve
   WHERE ( (reserve_demand_type=pDemandtype)
     AND   (reserve_demand_id=pDemandid)
     AND   (reserve_supply_type='I')
     AND   (reserve_status='R') );

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION unreserveLocationQty(pDemandtype TEXT,
                                                pDemandid INTEGER,
                                                pQty NUMERIC,
                                                pSupplyid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _reserveid    INTEGER;
  _reserveqty   NUMERIC := 0.0;
  _r            RECORD;
  _qtyUnreserve NUMERIC := 0.0;
  _totUnreserve NUMERIC := 0.0;

BEGIN

  -- Specified itemloc
  IF (pSupplyid IS NOT NULL) THEN
    SELECT reserve_id, reserve_qty INTO _reserveid, _reserveqty
    FROM reserve
     WHERE ( (reserve_demand_type=pDemandtype)
       AND   (reserve_demand_id=pDemandid)
       AND   (reserve_supply_type='I')
       AND   (reserve_supply_id=pSupplyid)
       AND   (reserve_status='R') );
  
    IF (_reserveqty < pQty) THEN
      RETURN -1;
    ELSEIF (_reserveqty > pQty) THEN
      UPDATE reserve SET reserve_qty = (reserve_qty - pQty)
      WHERE (reserve_id=_reserveid);
      _totUnreserve := (_reserveqty - pQty);
    ELSE
      DELETE FROM reserve
      WHERE (reserve_id=_reserveid);
      _totUnreserve := _reserveqty;
    END IF;
  ELSE
  -- Unspecified itemloc
    FOR _reserveid, _reserveqty IN 
      SELECT reserve_id, reserve_qty
      FROM reserve
       WHERE ( (reserve_demand_type=pDemandtype)
         AND   (reserve_demand_id=pDemandid)
         AND   (reserve_supply_type='I')
         AND   (reserve_status='R') )
    LOOP
      IF (_reserveqty < (pQty - _totUnreserve)) THEN
        _qtyUnreserve = _reserveqty;
      ELSE
        _qtyUnreserve = (pQty - _totUnreserve);
      END IF;

      IF (_reserveqty > _qtyUnreserve) THEN
        UPDATE reserve SET reserve_qty = (reserve_qty - _qtyUnreserve)
        WHERE (reserve_id=_reserveid);
      ELSE
        DELETE FROM reserve
        WHERE (reserve_id=_reserveid);
      END IF;

      _totUnreserve := _totUnreserve + _qtyUnreserve;
      IF (_totUnreserve >= pQty) THEN
        EXIT;
      END IF;
    END LOOP;
  END IF;

  IF (_totUnreserve < pQty) THEN
    RETURN -1;
  END IF;

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
