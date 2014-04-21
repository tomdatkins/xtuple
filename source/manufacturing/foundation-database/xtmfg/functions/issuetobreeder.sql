
CREATE OR REPLACE FUNCTION xtmfg.issueToBreeder(INTEGER, NUMERIC, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pWoid ALIAS FOR $3;
  _invhistid INTEGER;

BEGIN

--  Make sure the passed itemsite points to a real item
  IF ( ( SELECT (item_type IN ('R', 'F', 'J'))
         FROM itemsite, item
         WHERE ( (itemsite_item_id=item_id)
          AND (itemsite_id=pItemsiteid) ) ) ) THEN
    RETURN 0;
  END IF;

  UPDATE itemsite
  SET itemsite_qtyonhand=(itemsite_qtyonhand - pQty)
  WHERE (itemsite_id=pItemsiteid);

  SELECT NEXTVAL('invhist_invhist_id_seq') INTO _invhistid;
  INSERT INTO invhist
  ( invhist_id, invhist_itemsite_id,
    invhist_transtype,
    invhist_invqty, invhist_qoh_before, invhist_qoh_after,
    invhist_ordtype, invhist_ordnumber,
    invhist_invuom, invhist_unitcost )
  SELECT _invhistid, itemsite_id,
         'IB',
         pQty, (itemsite_qtyonhand + pQty), itemsite_qtyonhand,
         'W', formatWoNumber(pWoid),
         uom_name, stdCost(item_id)
  FROM itemsite, item, uom
  WHERE ((itemsite_item_id=item_id)
   AND (item_inv_uom_id=uom_id)
   AND (itemsite_controlmethod <> 'N')
   AND (itemsite_id=pItemsiteid));

  RETURN _invhistid;

END;
$$ LANGUAGE 'plpgsql';
