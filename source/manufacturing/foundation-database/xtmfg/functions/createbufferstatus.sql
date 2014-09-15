CREATE OR REPLACE FUNCTION xtmfg.createbufferstatus(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid   ALIAS FOR $1;
  _p            RECORD;
  _qtyAvailable NUMERIC;
  _demand       NUMERIC;
  _bufferStatus NUMERIC;
  _result       INTEGER;
  _x            RECORD;

BEGIN
  --Clear old status records
  DELETE FROM xtmfg.bufrsts
   WHERE ( ((bufrsts_itemsite_id = pItemsiteid)
     AND    (bufrsts_date=CURRENT_DATE)
     AND    (bufrsts_target_type='I'))
      OR   ((bufrsts_target_type IN ('P','W'))
     AND    (bufrsts_itemsite_id = pItemsiteid)));

  SELECT itemsite_warehous_id,
         itemsite_stocked,
         itemsite_reorderlevel,
         qtyNetable(itemsite_id) AS netableqoh,
         item_type INTO _p
    FROM itemsite JOIN item ON (itemsite_item_id=item_id)
   WHERE (itemsite_id=pItemsiteid);

  IF (_p.itemsite_stocked = true) THEN
    --Calculate buffer status for stock site item
    _demand := qtyAllocated(pItemsiteid, startoftime(), endoftime());

    _qtyAvailable := _p.netableqoh-_demand;

    INSERT INTO xtmfg.bufrsts
           ( bufrsts_target_type, bufrsts_target_id, bufrsts_date,
             bufrsts_type, bufrsts_size, bufrsts_itemsite_id,
             bufrsts_status )
    VALUES ( 'I', pItemsiteid, current_date,
             'S', _p.itemsite_reorderlevel, pItemsiteid,
             xtmfg.calcbufferstatus(_p.itemsite_reorderlevel,_qtyAvailable));

    --Calculate buffer status for stock site item stock supply orders
    IF (_p.item_type = 'P') THEN

      FOR _x IN  SELECT poitem_id,
                        (poitem_qty_ordered - poitem_qty_received) AS supply
                   FROM poitem
                  WHERE ( (poitem_itemsite_id=pItemsiteid)
                    AND   (poitem_status = 'O')
                    AND   (poitem_qty_ordered > poitem_qty_received) )
                  ORDER BY poitem_duedate, poitem_id ASC  LOOP
        INSERT INTO xtmfg.bufrsts
               ( bufrsts_target_type, bufrsts_target_id, bufrsts_date,
                 bufrsts_type, bufrsts_size, bufrsts_itemsite_id,
                 bufrsts_status )
        VALUES ( 'P', _x.poitem_id, current_date,
                 'S', _p.itemsite_reorderlevel, pItemsiteid,
                 xtmfg.calcbufferstatus(_p.itemsite_reorderlevel,_qtyAvailable));

        _qtyAvailable := _qtyAvailable + _x.supply;

      END LOOP;

    ELSEIF (_p.item_type = 'M') THEN

      FOR _x IN SELECT wo_id, (wo_qtyord - wo_qtyrcv) AS supply
                  FROM wo
                 WHERE ( (wo_status IN ('E','I','R'))
                   AND   (wo_itemsite_id=pItemsiteid)
                   AND   (wo_qtyord > wo_qtyrcv)
                   AND   (wo_ordtype IN ('','F','R','M') ) )
                 ORDER BY wo_duedate, wo_id ASC LOOP
        _result := xtmfg.createwobufferstatus(_x.wo_id,
                                              _p.itemsite_reorderlevel,
                                              xtmfg.calcbufferstatus(_p.itemsite_reorderlevel,
                                                                          _qtyAvailable));
        IF _result = -1 THEN
          RETURN _result;
        END IF;
        _qtyAvailable := _qtyAvailable + _x.supply;

      END LOOP;

    ELSIF (_p.item_type = 'C') THEN

      FOR _x IN SELECT wo_id,
                       ((wo_qtyord - wo_qtyrcv) * brddist_stdqtyper) AS supply
                  FROM wo, xtmfg.brddist
                 WHERE ( (wo_status in ('E','I','R'))
                   AND   (brddist_wo_id=wo_id)
                   AND   (brddist_itemsite_id=pItemsiteid)
                   AND   (wo_qtyord > wo_qtyrcv)
                   AND   (wo_ordtype IN ('','F','R','M') ) )
                 ORDER BY wo_duedate, wo_id LOOP

        _result := xtmfg.createwobufferstatus(_x.wo_id,_p.itemsite_reorderlevel,
                                              xtmfg.calcbufferstatus(_p.itemsite_reorderlevel,
                                                                     _qtyAvailable));
        IF (_result = -1) THEN
          RETURN _result;
        END IF;

        _qtyAvailable := _qtyAvailable + _x.supply;
      END LOOP;
    END IF;

  ELSE

    --Calculate buffer status for non-stock site item purchase order supply
    IF (_p.item_type = 'P') THEN

      FOR _x IN  SELECT poitem_id,
                        calculateworkdays(_p.itemsite_warehous_id,pohead_orderdate,poitem_duedate) AS ttlLeadtime,
                        calculateworkdays(_p.itemsite_warehous_id,current_date,poitem_duedate) AS remLeadtime
                   FROM pohead, poitem
                  WHERE ( (poitem_itemsite_id=pItemsiteid)
                    AND (pohead_id = poitem_pohead_id)
                    AND (poitem_status = 'O')
                    AND (poitem_qty_ordered > poitem_qty_received) )
                  ORDER BY poitem_duedate, poitem_id ASC LOOP

        INSERT INTO xtmfg.bufrsts
               ( bufrsts_target_type, bufrsts_target_id, bufrsts_date,
                 bufrsts_type, bufrsts_size, bufrsts_itemsite_id,
                 bufrsts_status )
        VALUES ( 'P', _x.poitem_id, current_date,
                 'T', _x.ttlLeadtime, pItemsiteid,
                 xtmfg.calcbufferstatus(_x.ttlLeadtime,_x.remLeadtime) );

      END LOOP;
    END IF;

    --Calculate buffer status for non-stock site item unlinked work order supply
    IF _p.item_type = 'M' THEN
      FOR _x IN SELECT wo_id
                  FROM wo
                 WHERE ( (wo_status IN ('E','I','R'))
                   AND   (wo_itemsite_id=pItemsiteid)
                   AND   (wo_qtyord > wo_qtyrcv)
                   AND   (wo_ordtype IN ('','F','R','M') ) )
                 ORDER BY wo_duedate, wo_id ASC LOOP
        _result := xtmfg.createwobufferstatus(_x.wo_id);
        IF (_result = -1) THEN
          RETURN _result;
        END IF;
      END LOOP;
    END IF;
  END IF;

  --Calculate buffer status for site item supply linked to sales
  FOR _x IN SELECT wo_id
              FROM wo
             WHERE ( (wo_status <> 'C')
               AND   (wo_itemsite_id=pItemsiteid)
               AND   (wo_qtyord > wo_qtyrcv)
               AND   (wo_ordtype = 'S') )
             ORDER BY wo_duedate, wo_id ASC LOOP
    _result := xtmfg.createwobufferstatus(_x.wo_id);
    IF (_result = -1) THEN
      RETURN _result;
    END IF;
  END LOOP;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xtmfg.createbufferstatus(INTEGER, BOOL) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteId     ALIAS FOR $1;
  pCheckExplosion ALIAS FOR $2;
  _x              RECORD;
  _result         INTEGER;

BEGIN
  _result := xtmfg.createbufferstatus(pItemsiteId);

  IF _result = 1 AND pCheckExplosion=True THEN
    FOR _x IN  SELECT cis.itemsite_id AS child_itemsite_id
            FROM itemsite AS pis, itemsite AS cis, item AS pi, item AS ci, bomitem
            WHERE ( (pis.itemsite_id = pItemsiteId)
            AND (pis.itemsite_item_id=pi.item_id)
            AND (pi.item_id=bomitem_parent_item_id)
            AND (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
            AND (bomitem_item_id=ci.item_id)
            AND (cis.itemsite_active=True)
            AND (ci.item_active=True)
            AND (ci.item_id=cis.itemsite_item_id)
            AND (pis.itemsite_warehous_id=cis.itemsite_warehous_id) )
    LOOP
      RAISE NOTICE 'Itemsite_id (%)', _x.child_itemsite_id;
      _result := xtmfg.createbufferstatus(_x.child_itemsite_id,True);
      IF _result <> 1 THEN
        RETURN _result;
      END IF;
    END LOOP;
  END IF;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

COMMENT ON FUNCTION xtmfg.createbufferstatus(INTEGER, BOOL) IS 'Use this to create buffer status for an itemsite, and all BOM children of the itemsite';
