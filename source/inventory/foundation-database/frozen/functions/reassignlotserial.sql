CREATE OR REPLACE FUNCTION reassignLotSerial(INTEGER, NUMERIC, TEXT, DATE, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemlocid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pNewLotSerial ALIAS FOR $3;
  pNewExpiration ALIAS FOR $4;
  pNewWarranty ALIAS FOR $5;
  _invhistid INTEGER;
  _itemlocSeries INTEGER;
  _targetItemlocid INTEGER;
  _lsid INTEGER;

BEGIN

--  Create the RL transaction
  SELECT NEXTVAL('invhist_invhist_id_seq') INTO _invhistid;
  SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  INSERT INTO invhist
  ( invhist_id, invhist_itemsite_id,
    invhist_transtype, invhist_invqty,
    invhist_qoh_before, invhist_qoh_after,
    invhist_invuom, invhist_unitcost,
    invhist_costmethod, invhist_value_before, invhist_value_after,
    invhist_series ) 
  SELECT _invhistid, itemsite_id,
         'RL', 0,
         itemsite_qtyonhand, itemsite_qtyonhand,
         uom_name, stdCost(item_id),
         itemsite_costmethod, itemsite_value, itemsite_value,
         _itemlocSeries
  FROM itemloc, itemsite, item, uom
  WHERE ( (itemloc_itemsite_id=itemsite_id)
   AND (itemsite_item_id=item_id)
   AND (item_inv_uom_id=uom_id)
   AND (itemsite_controlmethod <> 'N')
   AND (itemloc_id=pItemlocid) );

--  Relocate the inventory from the source and record the transactions
  INSERT INTO invdetail
  (invdetail_invhist_id, invdetail_location_id, invdetail_ls_id,
   invdetail_qty, invdetail_qty_before, invdetail_qty_after)
  SELECT _invhistid, itemloc_location_id, itemloc_ls_id,
         (pQty * -1), itemloc_qty, (itemloc_qty - pQty)
  FROM itemloc
  WHERE (itemloc_id=pItemlocid);

  UPDATE itemloc
  SET itemloc_qty=(itemloc_qty - pQty)
  FROM itemsite
  WHERE ( (itemloc_itemsite_id=itemsite_id)
   AND (NOT itemsite_freeze)
   AND (itemloc_id=pItemlocid) );

--  Check to see if any of the current Lot/Serial # detail records exists
  SELECT ls_id INTO _lsid
  FROM itemloc, itemsite, ls
  WHERE ((itemloc_itemsite_id=itemsite_id)
  AND (itemsite_item_id=ls_item_id)
  AND (ls_number=UPPER(pNewLotSerial))
  AND (itemloc_id=pItemlocid));

  IF (NOT FOUND) THEN
    _lsid := NEXTVAL('ls_ls_id_seq');
    INSERT INTO ls (ls_id,ls_item_id,ls_number)
    SELECT _lsid,itemsite_item_id,UPPER(pNewLotSerial)
    FROM itemloc, itemsite
    WHERE ((itemloc_itemsite_id=itemsite_id)
    AND (itemloc_id=pItemlocid));
  END IF;

  INSERT INTO lsdetail
  ( lsdetail_itemsite_id, lsdetail_ls_id, lsdetail_created )
  SELECT itemloc_itemsite_id, _lsid, CURRENT_TIMESTAMP
  FROM itemloc
  WHERE (itemloc_id=pItemlocid);

--  Check to see if any of the current Lot/Serial # exists at the target location
  SELECT target.itemloc_id INTO _targetItemlocid
  FROM itemloc AS source, itemloc AS target 
  WHERE ( (target.itemloc_itemsite_id=source.itemloc_itemsite_id)
   AND (target.itemloc_location_id=source.itemloc_location_id)
   AND (COALESCE(target.itemloc_ls_id, -1)=COALESCE(_lsid, -1))
   AND (COALESCE(target.itemloc_expiration,endoftime())=COALESCE(pNewExpiration,endoftime()))
   AND (COALESCE(target.itemloc_warrpurc,endoftime())=COALESCE(pNewWarranty,endoftime()))
   AND (source.itemloc_id=pItemlocid) );

  IF (NOT FOUND) THEN
    SELECT NEXTVAL('itemloc_itemloc_id_seq') INTO _targetItemlocid;
    INSERT INTO itemloc
    ( itemloc_id, itemloc_itemsite_id, itemloc_location_id,
      itemloc_ls_id, itemloc_expiration, itemloc_warrpurc, itemloc_qty )
    SELECT _targetItemlocid, itemloc_itemsite_id, itemloc_location_id,
           _lsid, pNewExpiration, pNewWarranty, 0
    FROM itemloc
    WHERE (itemloc_id=pItemlocid);
  END IF;

--  Relocate the inventory to the resultant target and record the transactions
  INSERT INTO invdetail
  (invdetail_invhist_id, invdetail_location_id, invdetail_ls_id,
   invdetail_qty, invdetail_qty_before, invdetail_qty_after)
  SELECT _invhistid, itemloc_location_id, _lsid,
         pQty, itemloc_qty, (itemloc_qty + pQty)
  FROM itemloc
  WHERE (itemloc_id=_targetItemlocid);

  UPDATE itemloc
  SET itemloc_qty=(itemloc_qty + pQty)
  FROM itemsite
  WHERE ( (itemloc_itemsite_id=itemsite_id)
   AND (NOT itemsite_freeze)
   AND (itemloc_id=_targetItemlocid) );

  UPDATE invhist
  SET invhist_hasdetail=TRUE
  WHERE (invhist_id=_invhistid);

--  Check to see if there is anything left at the source Itemloc and delete if not
  DELETE FROM itemloc
  WHERE ( (itemloc_qty=0)
   AND (itemloc_id=pItemlocid) );

--  Return the invhist_id
  RETURN _invhistid;

END;
$$ LANGUAGE 'plpgsql';
