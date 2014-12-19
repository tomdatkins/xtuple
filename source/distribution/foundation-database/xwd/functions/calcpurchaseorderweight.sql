CREATE OR REPLACE FUNCTION xwd.calcPurchaseOrderWeight(pPoheadid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _weight NUMERIC := 0.0;

BEGIN

  SELECT SUM(poitem_qty_ordered * (item_prodweight + item_packweight)) INTO _weight
  FROM poitem JOIN itemsite ON (itemsite_id=poitem_itemsite_id)
              JOIN item ON (item_id=itemsite_item_id)
  WHERE (poitem_pohead_id=pPoheadid);

  RETURN _weight;

END;
$$ LANGUAGE plpgsql;
