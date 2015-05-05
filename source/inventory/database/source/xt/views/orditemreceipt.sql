select xt.create_view('xt.orditemreceipt', $$

  select xt.orditem.obj_uuid,
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
    case when ordhead.ordhead_type = 'TO' then toitem_qty_received else orditem_qtytransacted end as orditem_qtytransacted,
    orditem_qtyreturned,
    case when ordhead.ordhead_type = 'TO' then toitem_qty_ordered - toitem_qty_received else transacted_balance end as transacted_balance,
    case when ordhead.ordhead_type = 'TO' then coalesce(recv_qty, 0.00) else at_dock end as at_dock,
    to_transact,
    undistributed,
    case when ordhead.ordhead_type = 'TO' then recv_id else transacted_head_id end as transacted_head_id,
    orditem_freight,
    orditem_cost,
    orditem_notes
  from 	xt.orditem
  	left join toitem on toitem.obj_uuid = xt.orditem.obj_uuid
  	left join recv on recv_orderitem_id = toitem_id and recv_order_type = 'TO' and not recv_posted
  	 INNER JOIN (
      SELECT obj_uuid, pohead_id AS ordhead_id, 'PO' AS ordhead_type FROM pohead
      UNION ALL
      SELECT obj_uuid, cmhead_id AS ordhead_id, 'CM' AS ordhead_type FROM cmhead
      UNION ALL
      SELECT obj_uuid, tohead_id AS ordhead_id, 'TO' AS ordhead_type FROM tohead
    ) ordhead on orditem_ordhead_uuid = ordhead.obj_uuid
  where orditem_status = 'O'
  	and ordhead.ordhead_type IN ('PO', 'CM', 'TO')
$$);
