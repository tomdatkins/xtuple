create or replace function xt.wooper_posted_quantity(integer) returns numeric stable as $$
  select coalesce(sum(wooperpost_qty),0)
  from xtmfg.wooperpost
  where wooperpost_wooper_id=$1;
$$ language sql;
