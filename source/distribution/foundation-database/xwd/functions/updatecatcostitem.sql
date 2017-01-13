CREATE OR REPLACE FUNCTION xwd.updateCatCostItem(pCatcostId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _c RECORD;

BEGIN

  SELECT catcost_item_id, catcost_wholesale_price, catcost_price_uom, catcost_po_cost,
         catcost_po_uom, catcost_itemsrcp_qtybreak, catcost_vend_number,
         catcost_cost_invvendoruomratio, catcost_warehous_code, catcost_upc
  INTO _c
  FROM xwd.catcost
  WHERE catcost_id=pCatcostId;

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Could not find catcost with catcost_id %.'
                    '[xtuple: updateCatCostItem, -1, %]', pCatcostId, pCatcostId;
  END IF;

  UPDATE item 
  SET item_listcost=_c.catcost_wholesale_price,
      item_price_uom_id=uom_id
  FROM uom 
  WHERE uom_name = _c.catcost_price_uom
  AND item_id = _c.catcost_item_id;

  UPDATE itemsrc
  SET itemsrc_vend_id= vend_id,
      itemsrc_upccode=_c.catcost_upc,
      itemsrc_vend_uom=_c.catcost_po_uom,
      itemsrc_invvendoruomratio=_c.catcost_cost_invvendoruomratio
  FROM vendinfo
  WHERE vend_number = _c.catcost_vend_number
  AND itemsrc_item_id = _c.catcost_item_id;

  UPDATE itemsrcp
  SET itemsrcp_qtybreak=_c.catcost_itemsrcp_qtybreak,
      itemsrcp_price=_c.catcost_po_cost,
      itemsrcp_warehous_id=COALESCE(warehous_id, itemsrcp_warehous_id)
  FROM whsinfo, itemsrc
  WHERE warehous_code = _c.catcost_warehous_code
  AND itemsrcp_itemsrc_id = itemsrc_id
  AND itemsrc_item_id = _c.catcost_item_id;

  RETURN pCatcostId;

END;
$$ LANGUAGE 'plpgsql';
