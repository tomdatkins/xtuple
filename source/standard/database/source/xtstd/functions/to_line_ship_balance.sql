create or replace function xtstd.to_line_ship_balance(toitem) returns numeric stable as $$
  select round($1.toitem_qty_ordered - $1.toitem_qty_shipped,6);
$$ language sql;
