create or replace function xt.invhist_quantity(invhist_id integer) returns numeric immutable as $$
  select invhist_invqty * (
    case when invhist_transtype='TS' and invhist_invqty < 0.0 and warehous_transit then 1
    else invhistsense(invhist_id) 
    end
   )
  from invhist
    join itemsite on itemsite_id=invhist_itemsite_id
    join whsinfo on warehous_id=itemsite_warehous_id
  where invhist_id=$1;
$$ language sql;