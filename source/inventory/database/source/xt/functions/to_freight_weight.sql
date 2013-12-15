create or replace function xt.to_freight_weight(tohead) returns numeric stable as $$
  select round(coalesce(toitem_qty_ordered * (item_prodweight + item_packweight), 0), 2)
  from toitem
    join item on item_id=toitem_item_id
  where toitem_tohead_id=$1.tohead_id;
$$ language sql;
