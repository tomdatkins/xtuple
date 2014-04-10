
CREATE OR REPLACE FUNCTION explodeReturnKit(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRaitemid ALIAS FOR $1;
  _r RECORD;
  _subnumber INTEGER;
  _revid INTEGER;
  _itemid INTEGER;
  _warehousid INTEGER;
  _item RECORD;
BEGIN

  SELECT * INTO _r
    FROM raitem JOIN rahead ON (rahead_id=raitem_rahead_id)
   WHERE (raitem_id=pRaitemid);
  IF(NOT FOUND) THEN
    RAISE EXCEPTION 'No Return Authorization Item was found.';
  END IF;

  _subnumber := COALESCE(_r.raitem_subnumber, 0);

  SELECT getActiveRevId('BOM',itemsite_item_id), itemsite_warehous_id, itemsite_item_id
    INTO _revid, _warehousid, _itemid
    FROM itemsite
   WHERE(itemsite_id=_r.raitem_itemsite_id);
  IF(NOT FOUND) THEN
    RAISE EXCEPTION 'No Item Site for the specified line was found.';
  END IF;

  FOR _item IN
  SELECT bomitem_id, 
         itemsite_id,
         itemsite_warehous_id,
         COALESCE((itemsite_active AND item_active), false) AS active,
         COALESCE((itemsite_sold AND item_sold), false) AS sold,
         item_id,
         item_type,
         item_price_uom_id,
         bomitem_uom_id,
         itemuomtouomratio(item_id, bomitem_uom_id, item_inv_uom_id) AS invuomratio,
         roundQty(itemuomfractionalbyuom(bomitem_item_id, bomitem_uom_id), (bomitem_qtyfxd + bomitem_qtyper * _r.raitem_qtyauthorized) * (1 + bomitem_scrap)) AS qty
    FROM bomitem, item LEFT OUTER JOIN itemsite ON ((itemsite_item_id=item_id) AND (itemsite_warehous_id=_warehousid))
   WHERE((bomitem_parent_item_id=_itemid)
     AND (bomitem_item_id=item_id)
     AND (bomitem_rev_id=_revid)
     AND (CURRENT_DATE BETWEEN bomitem_effective AND (bomitem_expires - 1)))
   ORDER BY bomitem_seqnumber LOOP
    IF (NOT _item.active) THEN
      RAISE EXCEPTION 'One or more of the components for the kit is inactive for the selected item site.';
    ELSIF (NOT _item.sold) THEN
      RAISE EXCEPTION 'One or more of the components for the kit is not sold for the selected item site.';
    ELSIF (_item.item_type='F') THEN
      SELECT explodeKit(pSoheadid, pLinenumber, _subnumber, _item.itemsite_id, _item.qty)
        INTO _subnumber;
    ELSE
      _subnumber := _subnumber + 1;
      INSERT INTO raitem
            (raitem_rahead_id, raitem_linenumber, raitem_subnumber,
             raitem_itemsite_id, raitem_rsncode_id, raitem_disposition,
             raitem_qtyauthorized, raitem_qtyreceived, raitem_warranty,
             raitem_qty_uom_id, raitem_qty_invuomratio,
             raitem_unitprice, raitem_price_uom_id, raitem_price_invuomratio,
             raitem_amtcredited, raitem_notes,
             raitem_status, raitem_cos_accnt_id, raitem_orig_coitem_id,
             raitem_new_coitem_id, raitem_scheddate, raitem_qtycredited,
             raitem_taxtype_id, raitem_coitem_itemsite_id)
      VALUES(_r.raitem_rahead_id, _r.raitem_linenumber, _subnumber,
             _item.itemsite_id, _r.raitem_rsncode_id, _r.raitem_disposition,
             _item.qty, 0, _r.raitem_warranty,
             _item.bomitem_uom_id, _item.invuomratio,
             0, _item.item_price_uom_id, 1,
             0, '',
            'O', NULL, NULL,
             NULL, _r.raitem_scheddate, 0,
             _r.raitem_taxtype_id, _item.itemsite_id);
    END IF;
  END LOOP;

  RETURN _subnumber;
END;
$$ LANGUAGE 'plpgsql';

