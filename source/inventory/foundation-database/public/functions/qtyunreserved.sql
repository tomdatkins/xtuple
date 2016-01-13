CREATE OR REPLACE FUNCTION qtyUnreserved(pItemsiteid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _qty NUMERIC;

BEGIN

  SELECT qtyAvailable(itemsite_id) - COALESCE(SUM(coitem_qtyreserved),0) INTO _qty
    FROM itemsite LEFT OUTER JOIN coitem ON (coitem_itemsite_id=itemsite_id AND coitem_status NOT IN ('X', 'C'))
   WHERE(itemsite_id=pItemsiteid)
   GROUP BY itemsite_id;

  RETURN _qty;
END;
$$ LANGUAGE plpgsql;
