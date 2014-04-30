CREATE OR REPLACE FUNCTION consolidateLotSerial(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  _r RECORD;

BEGIN

  UPDATE itemloc
  SET itemloc_consolflag = TRUE
  WHERE (itemloc_itemsite_id=pItemsiteid);

  FOR _r IN SELECT itemloc_location_id, itemloc_ls_id, itemloc_expiration, itemloc_warrpurc, SUM(itemloc_qty) AS qty
            FROM itemloc
            WHERE (itemloc_itemsite_id=pItemsiteid)
            GROUP BY itemloc_location_id, itemloc_ls_id, itemloc_expiration, itemloc_warrpurc LOOP
    INSERT INTO itemloc
    ( itemloc_itemsite_id, itemloc_location_id, itemloc_ls_id,
      itemloc_expiration, itemloc_warrpurc, itemloc_qty, itemloc_consolflag )
    VALUES
    ( pItemsiteid, _r.itemloc_location_id, _r.itemloc_ls_id,
      _r.itemloc_expiration, _r.itemloc_warrpurc, _r.qty, FALSE );
  END LOOP;

  DELETE FROM itemloc
  WHERE ( (itemloc_itemsite_id=pItemsiteid)
   AND (itemloc_consolflag) );

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
