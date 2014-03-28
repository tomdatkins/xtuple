
CREATE OR REPLACE FUNCTION explodePlannedOrder(INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  pExplodeChildren ALIAS FOR $2;
  _b RECORD;

BEGIN

--  Delete the results of any previous explosion
--  Delete any Planned Operations
  IF (fetchmetricbool('Routings')) THEN
    DELETE FROM xtmfg.planoper
    WHERE (planoper_planord_id=pPlanordid);
  END IF;

--  Delete any Planned Requirements
  DELETE FROM planreq
  WHERE ( (planreq_source='P')
   AND (planreq_source_id=pPlanordid) );

--  Recursively delete any child Planned Orders
  PERFORM deletePlannedOrder(planord_id, TRUE)
  FROM planord
  WHERE (planord_planord_id=pPlanordid);

--  Create Planned Requirements and Orders for manufactured or purchased component items
--  of this Planned Order
  FOR _b IN SELECT planord_number, c.itemsite_id AS componentsiteid,
                   calculatenextworkingdate(c.itemsite_warehous_id, planord_startdate, (c.itemsite_leadtime * -1)) AS startdate,
                   planord_startdate AS duedate, bomitem_booitem_seq_id,
                   bomitem_createwo, c.itemsite_planning_type AS planningtype,
                   (itemuomtouom(bomitem_item_id, bomitem_uom_id, NULL, (bomitem_qtyfxd + bomitem_qtyper * planord_qty) * (1 + bomitem_scrap))) AS qtyreq,
                   item_type
            FROM bomitem, planord, itemsite AS p, itemsite AS c, item
            WHERE ( (planord_itemsite_id=p.itemsite_id)
             AND (bomitem_parent_item_id=p.itemsite_item_id)
             AND (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
             AND (bomitem_item_id=c.itemsite_item_id)
             AND (p.itemsite_warehous_id=c.itemsite_warehous_id)
             AND (c.itemsite_item_id=item_id)
             AND (woEffectiveDate(planord_startdate) BETWEEN bomitem_effective AND (bomitem_expires - 1))
             AND (planord_id=pPlanordid) ) LOOP

    IF (_b.item_type = 'F') THEN
      PERFORM explodePhantomOrder(pPlanordid, _b.componentsiteid, _b.qtyreq);
    ELSE
--  Create the Planned Requirement
      INSERT INTO planreq
      ( planreq_source, planreq_source_id,
        planreq_itemsite_id, planreq_qty, planreq_planoper_seq_id )
      VALUES
      ( 'P', pPlanordid,
        _b.componentsiteid, _b.qtyreq, _b.bomitem_booitem_seq_id );

      IF (_b.bomitem_createwo AND _b.planningtype != 'N') THEN
        PERFORM createPlannedOrder( pPlanordid, _b.planord_number, _b.componentsiteid,
                                    _b.qtyreq, _b.startdate, _b.duedate, FALSE, FALSE, NULL, NULL );
      END IF;
    END IF;

  END LOOP;

  IF (fetchMetricBool('Routings')) THEN
  --  Insert the W/O Operations
    INSERT INTO xtmfg.planoper
    (planoper_planord_id, planoper_wrkcnt_id, planoper_sutime, planoper_rntime, planoper_seq_id)
    SELECT planord_id, booitem_wrkcnt_id, booitem_sutime,
           CASE WHEN ((booitem_rnqtyper = 0) OR (booitem_invproduomratio = 0)) THEN 0
                ELSE ((booitem_rntime / booitem_rnqtyper / booitem_invproduomratio) * planord_qty)
           END, booitem_seq_id
    FROM xtmfg.booitem, planord, itemsite
    WHERE ( (planord_itemsite_id=itemsite_id)
     AND (itemsite_item_id=booitem_item_id)
     AND (booitem_rev_id=getActiveRevId('BOO',booitem_item_id))
     AND (woEffectiveDate(planord_startdate) >= booitem_effective)
     AND (woEffectiveDate(planord_startdate) < booitem_expires)
     AND (planord_id=pPlanordid) );
  END IF;

  IF (pExplodeChildren) THEN
    PERFORM explodePlannedOrder(planord_id, TRUE)
    FROM planord, itemsite, item
    WHERE ( (planord_itemsite_id=itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (item_type = 'M')
     AND (planord_planord_id=pPlanordid) );
  END IF;

  RETURN pPlanordid;
END;
$$ LANGUAGE 'plpgsql';

