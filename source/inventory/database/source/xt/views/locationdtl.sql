select xt.create_view('xt.locationdtl', $$
SELECT obj_uuid, location_id, location_name, itemsite_id,qty
                 FROM (
                 SELECT location.obj_uuid, location_id, itemsite_location_id,
                        formatLocationName(location_id) AS location_name,
                        itemsite_id,
                        ( SELECT COALESCE(SUM(itemloc_qty), 0)
                          FROM itemloc, itemsite
                          WHERE ( (itemloc_location_id=location_id)
                          AND (itemloc_itemsite_id=itemsite_id)
                          AND (itemsite_item_id = q1.itemsite_item_id)
                          AND (itemsite_warehous_id=location_warehous_id))) AS qty
                 FROM location, itemsite q1 
                 WHERE validLocation(location_id, itemsite_id)
                 ORDER BY location_name ) AS data;
$$);
