create or replace function xt.to_total(tohead) returns numeric stable as $$
  select xt.to_subtotal($1) + xt.to_tax_total($1) + $1.tohead_freight;
$$ language sql;
