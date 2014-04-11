
CREATE OR REPLACE FUNCTION reserveLocationQty(pItemsiteid INTEGER,
                                              pSource TEXT,
                                              pSourceid INTEGER,
                                              pQty NUMERIC,
                                              pMethod NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  RETURN reserveLocationQty(pItemsiteid, pSource, pSourceid, pQty, pMethod, TRUE);

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION reserveLocationQty(pItemsiteid INTEGER,
                                              pSource TEXT,
                                              pSourceid INTEGER,
                                              pQty NUMERIC,
                                              pMethod NUMERIC,
                                              pPartialReservations BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  RETURN reserveLocationQty(pItemsiteid, pSource, pSourceid, pQty, pMethod, pPartialReservations, NULL);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION reserveLocationQty(pItemsiteid INTEGER,
                                              pSource TEXT,
                                              pSourceid INTEGER,
                                              pQty NUMERIC,
                                              pMethod NUMERIC,
                                              pPartialReservations BOOLEAN,
                                              pItemlocid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _reserveid     INTEGER;
  _qtyAvail      NUMERIC = 0.0;
  _qtyReserve    NUMERIC = 0.0;
  _totReserve    NUMERIC = 0.0;
  _avail         BOOLEAN;
  _r             RECORD;

BEGIN
  IF (pQty = 0) THEN
    RETURN -3;
  END IF;

  -- Make sure Item Site is location controlled
  IF ((SELECT (itemsite_loccntrl OR itemsite_controlmethod IN ('S','L'))
         FROM itemsite
        WHERE (itemsite_id=pItemsiteid)) = false) THEN
    RETURN -3;
  END IF;

  -- Make sure there is enough available (unreserved) inventory
  -- in netable locations
  SELECT COALESCE(SUM(itemloc_qty - qtyReservedLocation(itemloc_id)), 0) INTO _qtyAvail 
    FROM itemloc LEFT OUTER JOIN location ON (location_id=itemloc_location_id)
   WHERE (itemloc_itemsite_id=pItemsiteid)
     AND (COALESCE(location_netable, TRUE));

  IF ( (_qtyAvail < pQty AND NOT pPartialReservations) OR
       (_qtyAvail <= 0.0) ) THEN
    RETURN -1;
  END IF;

  IF (pQty < 0) THEN
    RETURN -2;
  END IF;

  -- Pick specified itemloc
  IF (pItemlocid IS NOT NULL) THEN
--    raise exception 'pick specified itemloc';
    FOR _r IN SELECT itemloc_id,
                     noNeg(itemloc_qty - qtyReservedLocation(itemloc_id)) AS qtyAvail
                FROM itemloc
               WHERE (itemloc_id=pItemlocid) LOOP
      IF (_r.qtyAvail < (pQty - _totReserve)) THEN
        return -1;
      ELSE
        _qtyReserve = (pQty - _totReserve);
      END IF;
  -- Check to see if reservation already exists
      SELECT reserve_id INTO _reserveid
      FROM reserve
      WHERE ( (reserve_demand_type=pSource)
        AND   (reserve_demand_id=pSourceid)
        AND   (reserve_supply_type='I')
        AND   (reserve_supply_id=_r.itemloc_id)
        AND   (reserve_status='R') );
      IF (FOUND) THEN
        UPDATE reserve
           SET reserve_qty = (reserve_qty + _qtyReserve)
         WHERE ( (reserve_demand_type=pSource)
           AND   (reserve_demand_id=pSourceid)
           AND   (reserve_supply_type='I')
           AND   (reserve_supply_id=_r.itemloc_id)
           AND   (reserve_status='R') );
      ELSE
        INSERT INTO reserve (reserve_demand_type, reserve_demand_id,
                             reserve_supply_type, reserve_supply_id,
                             reserve_qty, reserve_status)
             VALUES (pSource, pSourceid,
                     'I', _r.itemloc_id,
                     _qtyReserve, 'R');
      END IF;
      _totReserve = _totReserve + _qtyReserve;
      IF (_totReserve >= pQty) THEN
        EXIT;
      END IF;
    END LOOP;

    RETURN 0;

  END IF;

  -- Pick lowest quantities first
  IF (pMethod = 1) THEN
    FOR _r IN SELECT itemloc_id,
                     noNeg(itemloc_qty - qtyReservedLocation(itemloc_id)) AS qtyAvail
                FROM itemloc LEFT OUTER JOIN location ON (location_id=itemloc_location_id)
               WHERE (itemloc_itemsite_id=pItemsiteid)
                 AND (COALESCE(location_netable, TRUE)
                 AND (itemloc_qty > qtyReservedLocation(itemloc_id)))
            ORDER BY (itemloc_qty - qtyReservedLocation(itemloc_id)) ASC,
                     itemloc_expiration LOOP
      IF (_r.qtyAvail < (pQty - _totReserve)) THEN
        _qtyReserve = _r.qtyAvail;
      ELSE
        _qtyReserve = (pQty - _totReserve);
      END IF;
  -- Check to see if reservation already exists
      SELECT reserve_id INTO _reserveid
      FROM reserve
      WHERE ( (reserve_demand_type=pSource)
        AND   (reserve_demand_id=pSourceid)
        AND   (reserve_supply_type='I')
        AND   (reserve_supply_id=_r.itemloc_id)
        AND   (reserve_status='R') );
      IF (FOUND) THEN
        UPDATE reserve
           SET reserve_qty = (reserve_qty + _qtyReserve)
         WHERE ( (reserve_demand_type=pSource)
           AND   (reserve_demand_id=pSourceid)
           AND   (reserve_supply_type='I')
           AND   (reserve_supply_id=_r.itemloc_id)
           AND   (reserve_status='R') );
      ELSE
        INSERT INTO reserve (reserve_demand_type, reserve_demand_id,
                             reserve_supply_type, reserve_supply_id,
                             reserve_qty, reserve_status)
             VALUES (pSource, pSourceid,
                     'I', _r.itemloc_id,
                     _qtyReserve, 'R');
      END IF;
      _totReserve = _totReserve + _qtyReserve;
      IF (_totReserve >= pQty) THEN
        EXIT;
      END IF;
    END LOOP;
  END IF;

  -- Pick highest quantities first
  IF (pMethod = 2) THEN
    FOR _r IN SELECT itemloc_id,
                     noNeg(itemloc_qty - qtyReservedLocation(itemloc_id)) AS qtyAvail
                FROM itemloc LEFT OUTER JOIN location ON (location_id=itemloc_location_id)
               WHERE (itemloc_itemsite_id=pItemsiteid)
                 AND (COALESCE(location_netable, TRUE)
                 AND (itemloc_qty > qtyReservedLocation(itemloc_id)))
            ORDER BY (itemloc_qty - qtyReservedLocation(itemloc_id)) DESC,
                     itemloc_expiration LOOP
      IF (_r.qtyAvail < (pQty - _totReserve)) THEN
        _qtyReserve = _r.qtyAvail;
      ELSE
        _qtyReserve = (pQty - _totReserve);
      END IF;
  -- Check to see if reservation already exists
      SELECT reserve_id INTO _reserveid
      FROM reserve
      WHERE ( (reserve_demand_type=pSource)
        AND   (reserve_demand_id=pSourceid)
        AND   (reserve_supply_type='I')
        AND   (reserve_supply_id=_r.itemloc_id)
        AND   (reserve_status='R') );
      IF (FOUND) THEN
        UPDATE reserve
           SET reserve_qty = (reserve_qty + _qtyReserve)
         WHERE ( (reserve_demand_type=pSource)
           AND   (reserve_demand_id=pSourceid)
           AND   (reserve_supply_type='I')
           AND   (reserve_supply_id=_r.itemloc_id)
           AND   (reserve_status='R') );
      ELSE
        INSERT INTO reserve (reserve_demand_type, reserve_demand_id,
                             reserve_supply_type, reserve_supply_id,
                             reserve_qty, reserve_status)
             VALUES (pSource, pSourceid,
                     'I', _r.itemloc_id,
                     _qtyReserve, 'R');
      END IF;
      _totReserve = _totReserve + _qtyReserve;
      IF (_totReserve >= pQty) THEN
        EXIT;
      END IF;
    END LOOP;
  END IF;

  -- Pick by location name
  IF (pMethod = 3) THEN
    FOR _r IN SELECT itemloc_id,
                     noNeg(itemloc_qty - qtyReservedLocation(itemloc_id)) AS qtyAvail
                FROM itemloc LEFT OUTER JOIN location ON (location_id=itemloc_location_id)
               WHERE (itemloc_itemsite_id=pItemsiteid)
                 AND (COALESCE(location_netable, TRUE)
                 AND (itemloc_qty > qtyReservedLocation(itemloc_id)))
            ORDER BY location_name, itemloc_expiration LOOP
      IF (_r.qtyAvail < (pQty - _totReserve)) THEN
        _qtyReserve = _r.qtyAvail;
      ELSE
        _qtyReserve = (pQty - _totReserve);
      END IF;
  -- Check to see if reservation already exists
      SELECT reserve_id INTO _reserveid
      FROM reserve
      WHERE ( (reserve_demand_type=pSource)
        AND   (reserve_demand_id=pSourceid)
        AND   (reserve_supply_type='I')
        AND   (reserve_supply_id=_r.itemloc_id)
        AND   (reserve_status='R') );
      IF (FOUND) THEN
        UPDATE reserve
           SET reserve_qty = (reserve_qty + _qtyReserve)
         WHERE ( (reserve_demand_type=pSource)
           AND   (reserve_demand_id=pSourceid)
           AND   (reserve_supply_type='I')
           AND   (reserve_supply_id=_r.itemloc_id)
           AND   (reserve_status='R') );
      ELSE
        INSERT INTO reserve (reserve_demand_type, reserve_demand_id,
                             reserve_supply_type, reserve_supply_id,
                             reserve_qty, reserve_status)
             VALUES (pSource, pSourceid,
                     'I', _r.itemloc_id,
                     _qtyReserve, 'R');
      END IF;
      _totReserve = _totReserve + _qtyReserve;
      IF (_totReserve >= pQty) THEN
        EXIT;
      END IF;
    END LOOP;
  END IF;

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
