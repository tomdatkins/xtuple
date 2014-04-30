
CREATE OR REPLACE FUNCTION distributeToReservedItemLoc(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemlocdistid ALIAS FOR $1;
  _itemlocdistid INTEGER;
  _qtytodist NUMERIC;
  _qty NUMERIC;
  _r RECORD;

BEGIN

--  Determine the remaining qty required to distribute
  SELECT (p.itemlocdist_qty - COALESCE(SUM(c.itemlocdist_qty), 0)) INTO _qtytodist
    FROM itemlocdist AS p LEFT OUTER JOIN itemlocdist AS c
      ON (c.itemlocdist_itemlocdist_id=p.itemlocdist_id)
   WHERE (p.itemlocdist_id=pItemlocdistid)
   GROUP BY p.itemlocdist_qty;

-- Reservation only apply when qty is negative
  IF (_qtytodist >= 0) THEN
    RETURN -1;
  END IF;

--  Loop thru the reservations for this order
  FOR _r IN SELECT reserve_supply_id, (reserve_qty * -1.0) as reserveqty,
                   reserve_demand_id, reserve_demand_type
              FROM itemlocdist, reserve
             WHERE ((itemlocdist_order_id=reserve_demand_id)
               AND (itemlocdist_order_type=reserve_demand_type)
               AND (reserve_supply_type='I')
               AND (reserve_status='R')
               AND (itemlocdist_id=pItemlocdistid)) LOOP

--  Determine qty
    IF (_r.reserveqty < _qtytodist) THEN
      _qty = _qtytodist;
    ELSE
      _qty = _r.reserveqty;
    END IF;
    _qtytodist = _qtytodist - _qty;

    IF (_qty < 0) THEN
--  Check to see if an itemlocdist with the correct location/lotserial/expiration already exists
      SELECT target.itemlocdist_id INTO _itemlocdistid
        FROM itemlocdist AS source, itemlocdist AS target
       WHERE ( (target.itemlocdist_source_type='I')
         AND (target.itemlocdist_source_id=_r.reserve_supply_id)
         AND (COALESCE(target.itemlocdist_ls_id,-1)=COALESCE(source.itemlocdist_ls_id,-1))
         AND (target.itemlocdist_expiration=source.itemlocdist_expiration)
         AND (target.itemlocdist_itemlocdist_id=source.itemlocdist_id)
         AND (source.itemlocdist_id=pItemlocdistid) );

      IF (FOUND) THEN
        UPDATE itemlocdist
        SET itemlocdist_qty = (itemlocdist_qty + _qty)
        WHERE (itemlocdist_id=_itemlocdistid);
      ELSE
--  Create a new itemlocdist
        SELECT NEXTVAL('itemlocdist_itemlocdist_id_seq') INTO _itemlocdistid;

        INSERT INTO itemlocdist
                  ( itemlocdist_id, itemlocdist_itemlocdist_id,
                    itemlocdist_source_type, itemlocdist_source_id,
                    itemlocdist_qty, itemlocdist_expiration )
        VALUES
                  ( _itemlocdistid, pItemlocdistid,
                    'I', _r.reserve_supply_id,
                    _qty, endOfTime() );
      END IF;
    END IF;
  END LOOP;

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
