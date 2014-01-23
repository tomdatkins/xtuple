create or replace function xt.wooper_posted_value(integer) returns numeric stable as $$
  select coalesce(sum(coalesce(wooperpost_sucost,0) + coalesce(wooperpost_rncost,0)),0)
  from xtmfg.wooperpost
  where wooperpost_wooper_id=$1;
$$ language sql;
