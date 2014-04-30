CREATE OR REPLACE FUNCTION issueWoRtnReceipt(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoId ALIAS FOR $1;
  pInvhistId ALIAS FOR $2;
  _p RECORD;
  _c RECORD;
  _invhistid INTEGER;
  _rows INTEGER;
  
BEGIN

  SELECT invhist_itemsite_id, invhist_invqty AS qty,
         (invhist_unitcost * invhist_invqty) AS cost,
         invhist_series,invhist_transdate INTO _c
  FROM invhist
  WHERE (invhist_id=pInvhistId);

  GET DIAGNOSTICS _rows = ROW_COUNT;
  IF (_rows=0) THEN
    RAISE EXCEPTION 'Inventory history record for % not found.', pInvhistId;
  END IF;

  SELECT item_number,
         wo_itemsite_id AS itemsite_id,
         wo_ordid AS coitem_id, wo_id,
         formatWoNumber(wo_id) AS woNumber 
         INTO _p
  FROM wo, itemsite, item
  WHERE ((wo_id=pWoId)
   AND (itemsite_item_id=item_id) )
  FOR UPDATE;
  
  GET DIAGNOSTICS _rows = ROW_COUNT;
  IF (_rows=0) THEN
    RAISE EXCEPTION 'Work order record for % not found.', pWoId;
  END IF;

  SELECT postInvTrans( ci.itemsite_id, 'RI', _c.qty,
                      'W/O', 'WO', _p.woNumber, '', ('Return Authorization ' || _p.item_number || ' Issue to Work Order'),
                      cc.costcat_asset_accnt_id, pc.costcat_wip_accnt_id, _c.invhist_series, 
                      _c.invhist_transdate, _c.cost, pInvhistId ) INTO _invhistid
  FROM itemsite AS ci, itemsite AS pi,
       costcat AS cc, costcat AS pc,
       item
  WHERE ( (ci.itemsite_costcat_id=cc.costcat_id)
   AND (pi.itemsite_costcat_id=pc.costcat_id)
   AND (ci.itemsite_id=_c.invhist_itemsite_id)
   AND (pi.itemsite_id=_p.itemsite_id)
   AND (ci.itemsite_item_id=item_id) );

--  Insert special pre-assign records for the lot/serial# so they are available when the work order qty is received
  INSERT INTO lsdetail (lsdetail_itemsite_id, lsdetail_created, lsdetail_source_type, 
    lsdetail_source_id, lsdetail_source_number, lsdetail_ls_id, lsdetail_qtytoassign)
  SELECT invhist_itemsite_id, now(), 'RM', _p.wo_id, _p.woNumber,
    invdetail_ls_id, invdetail_qty
  FROM invhist
    JOIN invdetail ON (invdetail_invhist_id=invhist_id)
  WHERE (invhist_id=pInvhistId);

-- Post the transaction as there should be no further distribution activity after this
PERFORM postItemlocseries(_c.invhist_series);

--  Increase the parent W/O's WIP value by the value of the issued components
--  Copied from issuewomatl function.
--  On this transaction no cost value should ever be here, but leave handling
--  just in case to ensure if a cost ever did appear, it flows through and 
--  doesn't get lost in WIP.
  UPDATE wo
  SET wo_wipvalue = (wo_wipvalue + _c.cost),
      wo_postedvalue = (wo_postedvalue + _c.cost),
      wo_status='I'
  WHERE (wo_id=pWoId);

  RETURN _c.invhist_series;

END;
$$ LANGUAGE 'plpgsql';
