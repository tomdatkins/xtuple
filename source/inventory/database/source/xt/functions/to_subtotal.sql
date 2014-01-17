create or replace function xt.to_subtotal(tohead) returns numeric stable as $$
  select coalesce(sum(toitem_freight),0)
  from toitem
  where (toitem_tohead_id=$1.tohead_id);
$$ language sql;
