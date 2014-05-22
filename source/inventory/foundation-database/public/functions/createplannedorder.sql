SELECT dropifexists('FUNCTION','createPlannedOrder(integer, integer, integer, numeric, date, date, boolean, boolean, integer)');

CREATE OR REPLACE FUNCTION createPlannedOrder(INTEGER, INTEGER, NUMERIC, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pQtyOrdered ALIAS FOR $3;
  pStartDate ALIAS FOR $4;
  pDueDate ALIAS FOR $5;
  _returnCode NUMERIC;

BEGIN

  SELECT createPlannedOrder( -1, pPlanNumber, pItemsiteid, pQtyOrdered,
                             pStartDate, pDueDate, TRUE, FALSE, NULL, NULL ) INTO _returnCode;

  RETURN _returnCode;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createPlannedOrder(INTEGER, INTEGER, NUMERIC, DATE, DATE, TEXT, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pQtyOrdered ALIAS FOR $3;
  pStartDate ALIAS FOR $4;
  pDueDate ALIAS FOR $5;
  pOrderType ALIAS FOR $6;
  pSupplyItemsiteid ALIAS FOR $7;
  _returnCode NUMERIC;

BEGIN

  SELECT createPlannedOrder( -1, pPlanNumber, pItemsiteid, pQtyOrdered,
                             pStartDate, pDueDate, TRUE, FALSE, NULL, NULL, pOrderType, pSupplyItemsiteid, NULL ) INTO _returnCode;

  RETURN _returnCode;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createPlannedOrder(INTEGER, INTEGER, NUMERIC, DATE, DATE, TEXT, INTEGER, TEXT) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pQtyOrdered ALIAS FOR $3;
  pStartDate ALIAS FOR $4;
  pDueDate ALIAS FOR $5;
  pOrderType ALIAS FOR $6;
  pSupplyItemsiteid ALIAS FOR $7;
  pNotes ALIAS FOR $8;
  _returnCode NUMERIC;

BEGIN

  SELECT createPlannedOrder( -1, pPlanNumber, pItemsiteid, pQtyOrdered,
                             pStartDate, pDueDate, TRUE, FALSE, NULL, NULL, pOrderType, pSupplyItemsiteid, pNotes ) INTO _returnCode;

  RETURN _returnCode;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createPlannedOrder(INTEGER, INTEGER, INTEGER, NUMERIC, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  pPlanNumber ALIAS FOR $2;
  pItemsiteid ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  _result NUMERIC;

BEGIN

  SELECT createPlannedOrder( pPlanordid, pPlanNumber, pItemsiteid, pQtyOrdered,
                             pStartDate, pDueDate, TRUE, FALSE, NULL, NULL ) INTO _result;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createPlannedOrder(INTEGER, INTEGER, INTEGER, NUMERIC, DATE, DATE, BOOLEAN) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  pPlanNumber ALIAS FOR $2;
  pItemsiteid ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  pCheckExplosion ALIAS FOR $7;

BEGIN
  RETURN createPlannedOrder( pPlanordid, pPlanNumber, pItemsiteid, pQtyOrdered,
                             pStartDate, pDueDate, pCheckExplosion, FALSE, NULL, NULL );
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createPlannedOrder(INTEGER, INTEGER, INTEGER, NUMERIC, DATE, DATE, BOOLEAN, BOOLEAN, INTEGER, TEXT) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  pPlanNumber ALIAS FOR $2;
  pItemsiteid ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  pCheckExplosion ALIAS FOR $7;
  pMPSPlanned ALIAS FOR $8;
  pPschitemid ALIAS FOR $9;
  pItemType ALIAS FOR $10;
  _p RECORD;
  _itemType TEXT;
  _orderType TEXT;
  _supplyItemsiteid INTEGER;

BEGIN

  SELECT item_type, itemsite_wosupply, itemsite_posupply, itemsite_supply_itemsite_id
  INTO   _p
  FROM itemsite JOIN item ON (item_id=itemsite_item_id)
  WHERE (itemsite_id=pItemsiteid);

  _itemType := COALESCE(pItemType, _p.item_type);
  _supplyItemsiteid := _p.itemsite_supply_itemsite_id;

  _orderType := CASE WHEN (_p.itemsite_supply_itemsite_id IS NOT NULL) THEN 'T'
                     WHEN ( (_p.itemsite_wosupply) AND (_itemType='M') ) THEN 'W'
                     WHEN ( (_p.itemsite_posupply) AND (_itemType IN ('P', 'O')) ) THEN 'P'
                     WHEN (_p.itemsite_wosupply) THEN 'W'
                     WHEN (_p.itemsite_posupply) THEN 'P'
                     ELSE 'O'
                END;

  RETURN createPlannedOrder( pPlanordid, pPlanNumber, pItemsiteid, pQtyOrdered,
                             pStartDate, pDueDate, pCheckExplosion, FALSE, NULL, NULL, _orderType, _supplyItemsiteid, NULL );
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createPlannedOrder(INTEGER, INTEGER, INTEGER, NUMERIC, DATE, DATE, BOOLEAN, BOOLEAN, INTEGER, TEXT, TEXT, INTEGER, TEXT) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  pPlanNumber ALIAS FOR $2;
  pItemsiteid ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  pCheckExplosion ALIAS FOR $7;
  pMPSPlanned ALIAS FOR $8;
  pPschitemid ALIAS FOR $9;
  pItemType ALIAS FOR $10;
  pOrderType ALIAS FOR $11;
  pSupplyItemsiteid ALIAS FOR $12;
  pNotes ALIAS FOR $13;
  _planord_id INTEGER;
  _result NUMERIC;
  _f RECORD;
  _p RECORD;
  _count INTEGER;
  _qty NUMERIC;
  _remainder NUMERIC;
  _MPSPlanned BOOLEAN;
  _itemType TEXT;
  _orderType TEXT;
  _supplyItemsiteid INTEGER;

BEGIN

  _MPSPlanned := pMPSPlanned;

  _result := 0.0;

  SELECT item_type, plancode_mpsexplosion, itemsite_planning_type,
         CASE WHEN(itemsite_useparams) THEN itemsite_maxordqty ELSE 0.0 END AS itemsite_maxordqty,
         itemsite_wosupply, itemsite_posupply, itemsite_supply_itemsite_id
  INTO _p
  FROM itemsite JOIN item ON (item_id=itemsite_item_id)
                JOIN plancode ON (plancode_id=itemsite_plancode_id)
  WHERE (itemsite_id=pItemsiteid);

  IF (_p.itemsite_planning_type = 'S') THEN
    _MPSPlanned = TRUE;
  END IF;

  _itemType := COALESCE(pItemType, _p.item_type);
  _supplyItemsiteid := COALESCE(pSupplyItemsiteid, _p.itemsite_supply_itemsite_id);

  _orderType := COALESCE(pOrderType, CASE WHEN (_p.itemsite_supply_itemsite_id IS NOT NULL) THEN 'T'
                                          WHEN ( (_p.itemsite_wosupply) AND (_itemType='M') ) THEN 'W'
                                          WHEN ( (_p.itemsite_posupply) AND (_itemType IN ('P', 'O')) ) THEN 'P'
                                          WHEN (_p.itemsite_wosupply) THEN 'W'
                                          WHEN (_p.itemsite_posupply) THEN 'P'
                                          ELSE 'O'
                                     END);

  IF (_itemType = 'F') THEN
--  Explode the Phantom item
    PERFORM createPlannedOrder( pPlanordid, pPlanNumber, c.itemsite_id,
                                (itemuomtouom(bomitem_item_id, bomitem_uom_id, NULL, (bomitem_qtyfxd + bomitem_qtyper * pQtyOrdered) * (1 + bomitem_scrap))),
                                (pDueDate - c.itemsite_leadtime), pDueDate, TRUE, _MPSPlanned, pPschitemid, NULL, NULL, NULL, pNotes )
    FROM bomitem, itemsite AS p, itemsite AS c
    WHERE ( (bomitem_parent_item_id=p.itemsite_item_id)
     AND (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
     AND (bomitem_item_id=c.itemsite_item_id)
     AND (p.itemsite_warehous_id=c.itemsite_warehous_id)
     AND (p.itemsite_id=pItemsiteid) );

    _result = pQtyOrdered;
  ELSE
--  Create the Planned Order
    IF (_p.itemsite_maxordqty > 0.0) THEN
      _count := floor(pQtyOrdered / _p.itemsite_maxordqty);
      _remainder := pQtyOrdered - (_count * _p.itemsite_maxordqty);

      IF(_remainder = 0.0) THEN
        _count := _count - 1;
        _remainder := _p.itemsite_maxordqty;
      END IF;
    ELSE
      _remainder := pQtyOrdered;
      _count := 0;
    END IF;

    _remainder := validateOrderQty(pItemsiteid, _remainder, FALSE);
    WHILE (_count >= 0) LOOP
      IF(_count > 0) THEN
        _qty := _p.itemsite_maxordqty;
      ELSE
        _qty := _remainder;
      END IF;
      _count := _count - 1;

      IF (_qty = 0) THEN
        EXIT;
      END IF;

      SELECT NEXTVAL('planord_planord_id_seq') INTO _planord_id;
      INSERT INTO planord
      ( planord_id, planord_planord_id,
        planord_number, planord_subnumber, planord_itemsite_id,
        planord_type, planord_startdate, planord_duedate,
        planord_qty, planord_firm, planord_mps, planord_pschitem_id,
        planord_supply_itemsite_id, planord_comments )
      SELECT _planord_id, pPlanordid,
              pPlanNumber, nextPlanSubnumber(pPlanNumber), pItemsiteid,
              _orderType, pStartDate, pDueDate,
              _qty, _MPSPlanned, _MPSPlanned, pPschitemid,
              _supplyItemsiteid, pNotes
      FROM itemsite, item
      WHERE ( (itemsite_item_id=item_id)
       AND (itemsite_id=pItemsiteid) );

      _result := _result + _qty;

--  Check to see if the newly created Planned Order should be exploded
--  and do so.
      IF ((pCheckExplosion) AND (_orderType='W')) THEN
        IF (_p.plancode_mpsexplosion = 'S') THEN
          PERFORM explodePlannedOrder(_planord_id, FALSE);
        ELSIF (_p.plancode_mpsexplosion = 'M') THEN
          PERFORM explodePlannedOrder(_planord_id, TRUE);
        END IF;
      END IF;
    END LOOP;
  END IF;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

