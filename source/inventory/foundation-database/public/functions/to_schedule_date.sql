create or replace function xt.to_schedule_date(tohead) returns date stable as $$
  select toitem_schedshipdate
  from toitem
  where toitem_tohead_id=$1.tohead_id
    and toitem_status in ('U','O')
    and toitem_qty_ordered - toitem_qty_shipped > 0
  order by toitem_schedshipdate
  limit 1;
$$ language sql;