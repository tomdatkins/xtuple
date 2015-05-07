SELECT xt.create_view('xt.orditemreceipt', $$

  SELECT xt.orditem.obj_uuid,
    orditem_id,
    orditem_ordhead_id,
    orditem_ordhead_uuid,
    orditem_linenumber,
    orditem_subnumber,
    orditem_status,
    orditem_itemsite_id,
    orditem_item_id,
    orditem_warehous_id,
    orditem_scheddate,
    orditem_qty_uom_id,
    orditem_qtyord,
    CASE WHEN ordhead.ordhead_type = 'TO' THEN toitem_qty_received ELSE orditem_qtytransacted END AS orditem_qtytransacted,
    orditem_qtyreturned,
    CASE WHEN ordhead.ordhead_type = 'TO' THEN toitem_qty_ordered - toitem_qty_received ELSE transacted_balance END AS transacted_balance,
    CASE WHEN ordhead.ordhead_type = 'TO' THEN coalesce(recv_qty, 0.00) ELSE at_dock END AS at_dock,
    to_transact,
    undistributed,
    CASE WHEN ordhead.ordhead_type = 'TO' THEN recv_id ELSE transacted_head_id END AS transacted_head_id,
    orditem_freight,
    orditem_cost,
    orditem_notes
  FROM 	xt.orditem
  	LEFT JOIN toitem ON toitem.obj_uuid = xt.orditem.obj_uuid
  	LEFT JOIN recv ON recv_orderitem_id = toitem_id AND recv_order_type = 'TO' AND not recv_posted
  	INNER JOIN (
      SELECT obj_uuid, pohead_id AS ordhead_id, 'PO' AS ordhead_type FROM pohead
      UNION ALL
      SELECT obj_uuid, cmhead_id AS ordhead_id, 'CM' AS ordhead_type FROM cmhead
      UNION ALL
      SELECT obj_uuid, tohead_id AS ordhead_id, 'TO' AS ordhead_type FROM tohead
    ) ordhead ON orditem_ordhead_uuid = ordhead.obj_uuid
  WHERE orditem_status = 'O'
$$);
