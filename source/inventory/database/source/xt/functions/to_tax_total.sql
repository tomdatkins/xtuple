create or replace function xt.to_tax_total(tohead) returns numeric stable as $$
  select coalesce(sum(tax),0.0)
  from (
    select round(calculateTax(
      $1.tohead_taxzone_id, getFreightTaxTypeId(), $1.tohead_orderdate,
      $1.tohead_freight_curr_id,toitem_freight),2) AS tax
    from toitem
    where (toitem_tohead_id=$1.tohead_id)) data
$$ language sql;
