CREATE OR REPLACE FUNCTION calcIssueWoMaterialLineBalance(pWomatlId INTEGER)
RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qty			NUMERIC;

BEGIN

  SELECT 
    roundQty(item_fractional, 
      noNeg(itemuomtouom(item_id, womatl_uom_id, NULL, roundQty(itemuomfractionalbyuom(item_id, womatl_uom_id), 
        noNeg(CASE WHEN (womatl_qtyreq >= 0) THEN womatl_qtyreq - womatl_qtyiss 
              ELSE womatl_qtyiss * -1 END)
    )))) INTO _qty
  FROM womatl
    JOIN itemsite ON womatl_itemsite_id = itemsite_id
    JOIN item ON itemsite_item_id = item_id
  WHERE womatl_id = pWomatlId;
  
  RETURN _qty;

END;
$$ LANGUAGE plpgsql;
