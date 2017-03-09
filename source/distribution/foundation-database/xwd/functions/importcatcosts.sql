CREATE OR REPLACE FUNCTION xwd.importCatCosts() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _count INTEGER;

BEGIN

  INSERT INTO xwd.catcost(catcost_item_id, catcost_item_number, catcost_wholesale_price,
                          catcost_price_uom, catcost_po_cost, catcost_po_uom,
                          catcost_itemsrcp_qtybreak, catcost_vend_number,
                          catcost_cost_invvendoruomratio, catcost_warehous_code, catcost_upc)
  SELECT item_id, item_number, item_listcost,
         uom_name, COALESCE(itemsrcp_price, item_listcost), itemsrc_vend_uom,
         itemsrcp_qtybreak, vend_number,
         itemsrc_invvendoruomratio, warehous_code, item_upccode
  FROM item
  JOIN itemsrc ON item_id=itemsrc_item_id
  JOIN itemsrcp ON itemsrc_id=itemsrcp_itemsrc_id
  JOIN uom ON item_price_uom_id=uom_id
  LEFT OUTER JOIN vendinfo ON itemsrc_vend_id=vend_id
  LEFT OUTER JOIN whsinfo ON itemsrcp_warehous_id=warehous_id
  LEFT OUTER JOIN xwd.catalog ON item_upccode=catalog_upc
  LEFT OUTER JOIN xwd.catcost ON item_upccode=catcost_upc
  WHERE item_active
  AND item_type='P'
  AND item_sold
  AND catalog_upc IS NOT NULL
  AND catcost_item_id IS NULL;

  GET DIAGNOSTICS _count := ROW_COUNT;

  RETURN _count;

END;
$$ LANGUAGE 'plpgsql';
