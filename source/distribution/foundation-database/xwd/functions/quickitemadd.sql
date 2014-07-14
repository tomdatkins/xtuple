
CREATE OR REPLACE FUNCTION xwd.quickItemAdd(pOrdertype TEXT,
                                            pOrderid INTEGER,
                                            pItemid INTEGER,
                                            pWarehousid INTEGER,
                                            pQtyordered NUMERIC,
                                            pNetunitprice NUMERIC,
                                            pScheduledate DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _orditemid INTEGER;
  _linenumber INTEGER;

BEGIN

  IF (pOrdertype = 'SO') THEN
    SELECT NEXTVAL('coitem_coitem_id_seq') INTO _orditemid;
    SELECT (COALESCE(MAX(coitem_linenumber), 0) + 1) INTO _linenumber
    FROM coitem WHERE (coitem_cohead_id=pOrderid);

    INSERT INTO coitem
    ( coitem_id, coitem_cohead_id, coitem_linenumber, coitem_itemsite_id,
      coitem_status, coitem_scheddate, coitem_promdate,
      coitem_price, coitem_custprice, 
      coitem_qtyord, coitem_qtyshipped, coitem_qtyreturned,
      coitem_qty_uom_id, coitem_qty_invuomratio,
      coitem_price_uom_id, coitem_price_invuomratio,
      coitem_unitcost, coitem_prcost,
      coitem_custpn, coitem_memo, coitem_taxtype_id,
      coitem_order_type, coitem_order_id )
    SELECT
      _orditemid, pOrderid, _linenumber, itemsite_id,
      'O', pScheduledate, pScheduledate,
      pNetunitprice, itemPrice(pItemid, cohead_cust_id, cohead_shipto_id, pQtyordered, cohead_curr_id, pScheduledate),
      pQtyordered, 0, 0,
      item_inv_uom_id, 1.0,
      item_price_uom_id, iteminvpricerat(item_id),
      (itemcost(pItemid, cohead_cust_id, cohead_shipto_id,
                pQtyOrdered, item_inv_uom_id, item_price_uom_id,
                cohead_curr_id, pScheduledate, pScheduledate, pWarehousid) * iteminvpricerat(item_id)),
      0.0,
      '', '', getItemTaxType(item_id, cohead_taxzone_id),
      CASE WHEN (itemsite_createwo) THEN 'W'
           WHEN (itemsite_createsopo) THEN 'P'
           WHEN (itemsite_createsopr) THEN 'R'
      END, -1
    FROM itemsite JOIN item ON (item_id=itemsite_item_id), cohead
    WHERE (itemsite_item_id=pItemid)
      AND (itemsite_warehous_id=pWarehousid)
      AND (cohead_id=pOrderid);
  ELSE
    SELECT NEXTVAL('quitem_quitem_id_seq') INTO _orditemid;
    SELECT (COALESCE(MAX(quitem_linenumber), 0) + 1) INTO _linenumber
    FROM quitem WHERE (quitem_quhead_id=pOrderid);

    INSERT INTO quitem
    ( quitem_id, quitem_quhead_id, quitem_linenumber, quitem_itemsite_id,
      quitem_scheddate, quitem_promdate,
      quitem_price, quitem_custprice, 
      quitem_qtyord, quitem_order_warehous_id, quitem_item_id,
      quitem_qty_uom_id, quitem_qty_invuomratio,
      quitem_price_uom_id, quitem_price_invuomratio,
      quitem_unitcost, quitem_prcost,
      quitem_custpn, quitem_memo, quitem_taxtype_id )
    SELECT
      _orditemid, pOrderid, _linenumber, itemsite_id,
      pScheduledate, pScheduledate,
      pNetunitprice, itemPrice(pItemid, quhead_cust_id, quhead_shipto_id, pQtyordered, quhead_curr_id, pScheduledate),
      pQtyordered, pWarehousid, pItemid,
      item_inv_uom_id, 1.0,
      item_price_uom_id, iteminvpricerat(item_id),
      (itemcost(pItemid, quhead_cust_id, quhead_shipto_id,
                pQtyOrdered, item_inv_uom_id, item_price_uom_id,
                quhead_curr_id, pScheduledate, pScheduledate, pWarehousid) * iteminvpricerat(item_id)),
      0.0,
      '', '', getItemTaxType(item_id, quhead_taxzone_id)
    FROM itemsite JOIN item ON (item_id=itemsite_item_id), quhead
    WHERE (itemsite_item_id=pItemid)
      AND (itemsite_warehous_id=pWarehousid)
      AND (quhead_id=pOrderid);
  END IF;

  RETURN _orditemid;

END;
$$ LANGUAGE 'plpgsql';

