select xt.create_view('xt.orditemship', $$

  WITH 
    orditem AS (
      SELECT xt.orditem.*
      FROM xt.orditem
      WHERE orditem_status = 'O'
      --Don't see a reason to exclude order items with fulfilled qty:
      --and orditem_qtyord - orditem_qtytransacted + orditem_qtyreturned > 0
    )
  SELECT orditem.*,
    COALESCE(( SELECT sum(itemsite_qtyonhand)
      FROM itemsite 
      WHERE orditem_item_id = itemsite_item_id 
        AND orditem_itemsite_id != itemsite_id
    ), 0.00) AS qoh_other
  FROM orditem
    JOIN (
     SELECT obj_uuid FROM cohead
     UNION ALL
     SELECT obj_uuid FROM tohead
     UNION ALL
     SELECT obj_uuid FROM invchead
  ) AS ordhead ON ordhead.obj_uuid = orditem.orditem_ordhead_uuid

$$);
