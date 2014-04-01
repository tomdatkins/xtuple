
CREATE OR REPLACE FUNCTION xtmfg.cumulativeMPSSchedule(INTEGER, DATE, DATE, BOOLEAN, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  pFractional ALIAS FOR $4;
  pLeadTime ALIAS FOR $5;
  _s RECORD;
  _orderQty NUMERIC := 0.0;
  _newQTY NUMERIC := 0.0;
  _newOrder NUMERIC := 0.0;
  _plannedSupply NUMERIC := 0.0;
  _debug BOOLEAN := FALSE;

BEGIN

      FOR _s IN SELECT pschitem_id, remqty
                  FROM (SELECT pschitem_id,
                               pschitem_qty-(COALESCE((SELECT SUM(wo_qtyord)
                                                         FROM wo
                                                        WHERE wo_ordtype='P'
                                                          AND wo_ordid=pschitem_id),0))-
                                            (COALESCE((SELECT SUM(planord_qty)
                                                         FROM planord
                                                        WHERE planord_pschitem_id=pschitem_id),0)) AS remqty
                          FROM xtmfg.pschitem JOIN xtmfg.pschhead ON (pschitem_pschhead_id=pschhead_id)
                         WHERE ((pschhead_status = 'R')
                           AND  (pschhead_type ='P')
                           AND  (pschitem_status = 'O')
                           AND  (pschitem_itemsite_id=pItemsiteid)
                           AND  (pschitem_scheddate BETWEEN pStartDate AND pEndDate))
                        UNION
                        SELECT pschitem_id,
                               (itemuomtouom(bomitem_item_id, bomitem_uom_id, NULL, (bomitem_qtyfxd + pschitem_qty * bomitem_qtyper) * (1 + bomitem_scrap))) -
                                (COALESCE((SELECT SUM(wo_qtyord)
                                             FROM wo
                                            WHERE wo_ordtype='P'
                                              AND wo_ordid=pschitem_id
                                              AND wo_itemsite_id=pItemsiteId),0))-
                                (COALESCE((SELECT SUM(planord_qty)
                                             FROM planord
                                            WHERE planord_pschitem_id=pschitem_id
                                              AND planord_itemsite_id=pItemsiteId),0)) AS remqty
                          FROM itemsite AS source, item AS sitem,
                               itemsite AS parent, item AS pitem,
                               xtmfg.pschitem, xtmfg.pschhead, bomitem
                         WHERE ((pitem.item_type='L')
                           AND  (source.itemsite_planning_type!='N')
                           AND  (pschhead_status='R')
                           AND  (pschhead_type ='P')
                           AND  (pschitem_status='O')
                           AND  (pschitem_itemsite_id=parent.itemsite_id)
                           AND  (pschitem_pschhead_id=pschhead_id)
                           AND  (bomitem_parent_item_id=pitem.item_id)
                           AND  (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
                           AND  (bomitem_item_id=sitem.item_id)
                           AND  (bomitem_effective < pEndDate)
                           AND  (bomitem_expires > pStartDate)
                           AND  (source.itemsite_item_id=sitem.item_id)
                           AND  (parent.itemsite_item_id=pitem.item_id)
                           AND  (source.itemsite_warehous_id=parent.itemsite_warehous_id)
                           AND  (pschitem_scheddate BETWEEN pStartDate AND pEndDate)
                           AND  (source.itemsite_id=pItemsiteid))) AS data
                 WHERE (remqty > 0) LOOP

        _orderQty := _s.remqty;
--  Logic for partials
        IF (NOT pFractional) THEN
          SELECT ROUND(_orderQTY, 0) INTO _newOrder;
          IF (_newOrder < _orderQty) THEN
            _orderQty := _newOrder + 1;
          ELSE
            _orderQty := _newOrder;
          END IF;
        END IF;

        IF (_debug) THEN
          RAISE NOTICE 'Cumulative MPS Schedule for itemsite: %', pItemsiteid;
          RAISE NOTICE 'pStartDate: %', pStartDate;
          RAISE NOTICE 'pEndDate: %', pEndDate;
          RAISE NOTICE 'pFractional: %', pFractional;
          RAISE NOTICE 'pLeadTime: %', pLeadTime;
          RAISE NOTICE 'Create Planned Order';
          RAISE NOTICE '_orderQty: %', _orderQty;
          RAISE NOTICE '_pschitem_id: %', _s.pschitem_id;
        END IF;

        IF (pStartDate = current_date) THEN
          PERFORM createPlannedOrder( -1, fetchPlanNumber(), pItemsiteid,
                                      _orderQty, pStartDate, pEndDate, TRUE, TRUE, _s.pschitem_id, NULL );
        ELSE
          PERFORM createPlannedOrder( -1, fetchPlanNumber(), pItemsiteid,
                                      _orderQty, ( pStartDate - pLeadTime ), pStartDate, TRUE, TRUE, _s.pschitem_id, NULL );
        END IF;

        _plannedSupply := _plannedSupply + _orderQty;

      END LOOP;

  RETURN _plannedSupply;

END;
$$ LANGUAGE 'plpgsql';

