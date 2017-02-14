INSERT INTO itemloc
(itemloc_itemsite_id, itemloc_location_id, itemloc_qty, itemloc_expiration, itemloc_ls_id)
SELECT -1, -1, 0.0, endOfTime(), ls_id
FROM ls
WHERE NOT EXISTS(SELECT 1
                 FROM itemloc
                 WHERE itemloc_ls_id=ls_id);
