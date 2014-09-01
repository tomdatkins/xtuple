
CREATE OR REPLACE FUNCTION createPlannedOrders(INTEGER, DATE, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pCutoffDate ALIAS FOR $2;
  pDeleteFirmed ALIAS FOR $3;
BEGIN
  RETURN createPlannedOrders(pItemsiteid, pCutoffDate, pDeleteFirmed, FALSE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createPlannedOrders(INTEGER, DATE, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pCutoffDate ALIAS FOR $2;
  pDeleteFirmed ALIAS FOR $3;
  pMPS ALIAS FOR $4;
BEGIN
  RETURN createPlannedOrders(pItemsiteid, pCutoffDate, pDeleteFirmed, pMPS, FALSE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createplannedorders(integer, date, boolean, boolean, boolean)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pCutoffDate ALIAS FOR $2;
  pDeleteFirmed ALIAS FOR $3;
  pMPS ALIAS FOR $4;
  pCreateExcp ALIAS FOR $5;
  _availability RECORD;
  _runningAvailability NUMERIC;
  _orderQty NUMERIC;
  _p RECORD;
  _orderCounter INTEGER := 0;
  _startDate DATE;
  _endDate DATE;
  _demand NUMERIC;
  _oldDemand NUMERIC;
  _plannedDemand NUMERIC;
  _oldPlannedDemand NUMERIC;
  _forecastedDemand NUMERIC;
  _plannedSupply NUMERIC;
  _oldPlannedSupply NUMERIC;
  _mpsQty NUMERIC := 0;
  _mpsSupply NUMERIC := 0;
  _supply NUMERIC;
  _oldSupply NUMERIC;
  _excess NUMERIC;
  _newQTY NUMERIC;
  _timefence DATE;
  _result INTEGER;  
  _debug BOOLEAN := FALSE;

BEGIN

--  Cache item and itemsite parameters
  SELECT *,
         qtyNetable(itemsite_id) AS netableqoh,
         CASE WHEN(itemsite_useparams) THEN itemsite_reorderlevel
              ELSE 0.0
         END AS reorderlevel,
         CASE WHEN(NOT itemsite_useparams) THEN 0.0
              WHEN(itemsite_ordertoqty < itemsite_reorderlevel) THEN itemsite_reorderlevel
              ELSE itemsite_ordertoqty
         END AS ordertoqty
  INTO _p
  FROM itemsite JOIN item ON (item_id=itemsite_item_id)
                JOIN whsinfo ON (warehous_id=itemsite_warehous_id)
  WHERE (itemsite_id=pItemsiteid);
  
--  Make sure that we can issue orders to this warehouse
  IF  ( (NOT _p.itemsite_posupply) AND
        (NOT _p.itemsite_wosupply) AND
        (_p.itemsite_supply_itemsite_id IS NULL) ) THEN
    RETURN -1;
  END IF;

--  Make sure we can order the item and that we know to create W/O for Manufactured Items
  IF (_p.item_type NOT IN ('P', 'M', 'O', 'F')) THEN
    RETURN -2;
  END IF;

  IF(_p.itemsite_planning_type = 'N') THEN
    RETURN -3;
  END IF;

--Use site calender for start, leadtime, ordergroup, end, and timefence
    _startDate := calculatenextworkingdate(_p.itemsite_warehous_id, CURRENT_DATE, 0);
    _timefence := calculatenextworkingdate(_p.itemsite_warehous_id, CURRENT_DATE, _p.itemsite_mps_timefence);
      IF (_p.itemsite_ordergroup_first) THEN
        _endDate := calculatenextworkingdate(_p.itemsite_warehous_id, CURRENT_DATE, _p.itemsite_leadtime);
      ELSE
        _endDate := calculatenextworkingdate(_p.itemsite_warehous_id, CURRENT_DATE, _p.itemsite_ordergroup);
      END IF;

  IF (_p.itemsite_ordergroup < 1) THEN
    RAISE NOTICE 'createPlannedOrders(%, %, %, %): changing itemsite_ordergroup from % to 1',
                  pItemsiteid, pCutoffDate, pDeleteFirmed, pMPS,
                  _p.itemsite_ordergroup;
    _p.itemsite_ordergroup = 1;
  END IF;
  
--  Create MRP Exceptions
  IF (pCreateExcp) THEN
    _result := xtmfg.mrpExceptions(pItemsiteId, pCutoffDate, _endDate); 
        IF (_result < 0) THEN
      RAISE EXCEPTION 'MRP Exceptions error %, process stopped', _result;
    END IF;
  END IF;

  _oldDemand := qtyAllocated(pItemsiteid, '1970-01-01', (current_date -1));
  _oldSupply := qtyOrdered(pItemsiteid, '1970-01-01', (current_date -1));
  _oldPlannedDemand := qtyPlannedDemand(pItemsiteid, '1970-01-01', CURRENT_DATE-1);
  _oldPlannedSupply := qtyPlanned(pItemsiteid, '1970-01-01', CURRENT_DATE-1);

  _runningAvailability := _p.netableqoh + _oldSupply - _oldDemand + _oldPlannedSupply - _oldPlannedDemand;

  IF (_debug) THEN
    RAISE NOTICE 'Planning for itemsite (%, %, %)', pItemsiteid, _p.warehous_code, _p.item_number;
    RAISE NOTICE 'Order Group (%)', _p.itemsite_ordergroup;
    RAISE NOTICE 'First Group (%)', _p.itemsite_ordergroup_first;
    RAISE NOTICE 'Lead Time (%)', _p.itemsite_leadtime;
    RAISE NOTICE 'MPS Timefence (%)', _p.itemsite_mps_timefence;
    RAISE NOTICE 'Reorder Level (%)', _p.reorderlevel;
    RAISE NOTICE 'Order To Qty  (%)', _p.ordertoqty;
    RAISE NOTICE 'Starting onhand balance (%)', _p.netableqoh;
    RAISE NOTICE 'Starting old supply (%)', _oldSupply;
    RAISE NOTICE 'Starting old demand (%)', _oldDemand;
    RAISE NOTICE 'Starting old planned supply (%)', _oldPlannedSupply;
    RAISE NOTICE 'Starting old planned demand (%)', _oldPlannedDemand;
    RAISE NOTICE 'Starting running availablity (%)', _runningAvailability;
    RAISE NOTICE 'Starting start date (%)', _startDate;
    RAISE NOTICE 'Starting end date (%)', _endDate;
  END IF;

--  Delete all unfirmed planned orders for the itemsite
--  If requested, delete all firmed planned orders for the itemsite
  PERFORM deletePlannedOrder(planord_id, TRUE)
     FROM planord
    WHERE ( (planord_itemsite_id=pItemsiteid)
      AND   (pDeleteFirmed OR (NOT planord_firm)) );

-- Start the Loop!!

  WHILE ( _startDate <= pCutoffDate) LOOP

    _orderQty := 0.00;
        
--  Process Cumulative MPS Schedule
    IF (pMPS) AND (_timefence < _startDate) THEN
      _mpsQty := xtmfg.cumulativeMPSSchedule(pItemsiteid, _startDate, _endDate, _p.item_fractional, _p.itemsite_leadtime);
      _mpsSupply := _mpsSupply + _mpsQty;
    END IF;
--  End Cumulative MPS Schedule

    _demand := qtyAllocated(pItemsiteid, _startDate, _endDate);

    _plannedDemand := qtyPlannedDemand(pItemsiteid, _startDate, _endDate);

--  If this is MPS and we are outside the timefence lets add up the
--  planned demand from Netted Forecast Schedule Items.
    IF (pMPS AND _timefence < _startDate) THEN
      _forecastedDemand := xtmfg.qtyForecasted(pItemsiteid, _startDate, _endDate, true);
    ELSE
      _forecastedDemand := 0.0;
    END IF;

--    _plannedSupply := (COALESCE(_mpsSupply, 0) + qtyPlanned(pItemsiteid, _startDate, _endDate));
    _plannedSupply := qtyPlanned(pItemsiteid, _startDate, _endDate);

    -- If Creating Exceptions then ignore Supply Due Dates, loop only once
    IF (pCreateExcp) THEN
      IF (_startDate = calculatenextworkingdate(_p.itemsite_warehous_id, current_date, 0)) THEN
        _supply := qtyOrdered(pItemsiteid, _startDate, pCutoffDate);
      ELSE
        _supply := 0.0;
      END IF;
    ELSE
      _supply := qtyOrdered(pItemsiteid, _startDate, _endDate);
    END IF;

    _demand := _demand + _plannedDemand;
    IF (_forecastedDemand > _demand) THEN
      _demand := _forecastedDemand;
    END IF;

    _excess := _supply - _demand + _plannedSupply;

    _newQTY := _excess + _runningAvailability;
    _runningAvailability := _newQTY;

    IF (_debug) THEN
      RAISE NOTICE 'Start date (%)', _startDate;
      RAISE NOTICE 'End date (%)', _endDate;
      RAISE NOTICE 'Demand (%)', _demand;
      RAISE NOTICE 'Planned Demand (%)', _plannedDemand;
      RAISE NOTICE 'Forecasted Demand (%)', _forecastedDemand;
      RAISE NOTICE 'Cumulative MPS (%)', _mpsSupply;
      RAISE NOTICE 'Planned Supply (%)', _plannedSupply;
      RAISE NOTICE 'Supply (%)', _supply;
      RAISE NOTICE 'Excess (%)', _excess;
      RAISE NOTICE 'New Quantity (%)', _newQTY;
    END IF;

--  If the itemsite uses parameters order up to the itemsite_ordertoqty
--  when the projected availability drops below the itemsite_reorderlevel,
--  as long as the projected availability is less than itemsite_orderupto.

    IF ( (_p.itemsite_useparams) AND
         ((_newQTY - _p.itemsite_safetystock) < _p.reorderlevel) ) THEN
            _orderQty := validateOrderQty( pItemsiteid, (_p.ordertoqty - (_newQTY)), FALSE );
--  Correct for safety stock levels
            IF (_orderQty = 0.00) THEN
              _orderQty := validateOrderQty( pItemsiteid, ((_p.ordertoqty + _p.itemsite_safetystock) - (_newQTY)), FALSE );
            END IF;

    ELSE

--  If the itemsite does not use parameters then just order back
--  to 0 QOH when the projected availability drops below 0.
       IF ((_newQTY - _p.itemsite_safetystock) < 0) THEN
          _orderQty := (_newQTY - _p.itemsite_safetystock) * -1;
       END IF;
    END IF;

    IF (_orderQty != 0.00) THEN
      IF (_debug) THEN
        RAISE NOTICE 'Order Quantity (%)', _orderQty;
      END IF;

--  Logic for partials
      IF (NOT _p.item_fractional) THEN
        _orderQty := CEILING(_orderQty);
      END IF;
      
      IF (_debug) THEN
        RAISE NOTICE 'Order Quantity (%)', _orderQty;
      END IF;

--  End of Logic for partials

      IF (_debug) THEN
        RAISE NOTICE 'Planning orders with site calendar';
      END IF;
-- check for first group
      IF (_startDate = calculatenextworkingdate(_p.itemsite_warehous_id, current_date, 0)) THEN
        IF (_debug) THEN
        RAISE NOTICE 'Planning first group';
        END IF;
        _orderQty := createPlannedOrder( -1, fetchPlanNumber(), pItemsiteid,
                                     _orderQty, 
                                     calculatenextworkingdate(_p.itemsite_warehous_id, _endDate, - _p.itemsite_leadtime), 
                                     _endDate, TRUE, pMPS, NULL, NULL );
      ELSE
        _orderQty := createPlannedOrder( -1, fetchPlanNumber(), pItemsiteid,
                                     _orderQty, 
                                     calculatenextworkingdate(_p.itemsite_warehous_id, _startDate, - _p.itemsite_leadtime), 
                                     calculatenextworkingdate(_p.itemsite_warehous_id, _startDate, 0), 
                                     TRUE, pMPS, NULL, NULL );
      END IF;

-- end of create planned orders

      _runningAvailability := _runningAvailability + _orderQty;
      _orderCounter := _orderCounter + 1;

      IF (_debug) THEN
        RAISE NOTICE 'Created New Order';
        RAISE NOTICE 'Actual Order Quantity (%)', _orderQty;
        RAISE NOTICE 'Updated Running Availability (%)', _runningAvailability;
        RAISE NOTICE 'Order Counter (%)', _orderCounter;
      END IF;

    END IF;
-- end of orderQty check
    
    _startDate := _endDate + 1;
    _endDate := calculatenextworkingdate(_p.itemsite_warehous_id, _endDate, _p.itemsite_ordergroup);
    
  END LOOP;

  RETURN _orderCounter;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
