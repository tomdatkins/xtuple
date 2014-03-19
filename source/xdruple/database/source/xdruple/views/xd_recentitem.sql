-- View definition for Drupal Commerce integration of 'ship to' entity data.

select xt.create_view('xdruple.xd_recentitem', $$

SELECT
  cohist_shipto_id || '-' || item_id AS xd_recentitem_id,
  item_id AS xd_recentitem_item_id,
  cohist_shipto_id AS xd_recentitem_shipto_id,
  shiptoinfo.obj_uuid
FROM cohist
LEFT JOIN itemsite ON itemsite_id = cohist_itemsite_id
LEFT JOIN item ON item_id = itemsite_item_id
LEFT JOIN shiptoinfo ON shipto_id = cohist_shipto_id
WHERE true
  AND cohist_itemsite_id > 0
  AND cohist_shipto_id > 0
  AND cohist_orderdate > (CURRENT_TIMESTAMP - INTERVAL '90 days')
GROUP BY
  item_id,
  item_number,
  cohist_shipto_id,
  shiptoinfo.obj_uuid;

$$, false);
