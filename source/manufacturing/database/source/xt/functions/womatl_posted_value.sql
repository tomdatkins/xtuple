create or replace function xt.womatl_posted_value(integer) returns numeric stable as $$
  select coalesce(sum(invhist_value_before - invhist_value_after),0)
  from womatlpost
    join invhist on invhist_id=womatlpost_invhist_id
  where womatlpost_womatl_id=$1;
$$ language sql;
