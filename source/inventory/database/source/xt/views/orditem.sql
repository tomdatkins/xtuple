select xt.create_view('xt.orditem', $$

  select
    coitem.obj_uuid as obj_uuid,
    cohead.obj_uuid as orditem_ordhead_uuid,
    coitem_linenumber as orditem_linenumber,
    coitem_subnumber as orditem_subnumber,
    coitem_status as orditem_status,
    coitem_itemsite_id as orditem_itemsite_id,
    itemsite_item_id as orditem_item_id,
    itemsite_warehous_id as orditem_warehous_id,
    coitem_scheddate as orditem_scheddate,
    coitem_qty_uom_id as orditem_qty_uom_id,
    coitem_qtyord as orditem_qtyord,
    coitem_qtyshipped as orditem_qtyshipped,
    coitem_qtyreturned as orditem_qtyreturned,
    ship_balance,
    at_shipping,
    null as to_issue,
    shiphead_id
  from xt.coiteminfo as coitem
    join itemsite on itemsite_id=coitem_itemsite_id
    join item on itemsite_item_id=item_id
    join cohead on cohead_id=coitem_cohead_id
    left join shiphead on cohead_id=shiphead_order_id
      and shiphead_order_type='SO'
      and not shiphead_shipped
  where item_type != 'K'
  union all
  select
    toitem.obj_uuid,
    tohead.obj_uuid,
    toitem_linenumber,
    0,
    toitem_status,
    itemsite_id,
    toitem_item_id,
    tohead_src_warehous_id,
    toitem_schedrecvdate,
    item_inv_uom_id,
    toitem_qty_ordered,
    toitem_qty_shipped,
    0,
    xt.to_line_ship_balance(toitem) as ship_balance,
    xt.to_line_at_shipping(toitem) as at_shipping,
    null as to_issue,
    shiphead_id
  from toitem
    join tohead on tohead_id=toitem_tohead_id
    left join shiphead on tohead_id=shiphead_order_id
      and shiphead_order_type='TO'
      and not shiphead_shipped,
      itemsite, item
  where tohead_src_warehous_id=itemsite_warehous_id
    and toitem_item_id=itemsite_item_id
    and itemsite_item_id=item_id
  order by orditem_linenumber, orditem_subnumber

$$);