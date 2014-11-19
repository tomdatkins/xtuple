do $$
begin
if not exists(select 1 from metric where metric_name='xwdUpdateActCost') then
  perform setMetric('xwdUpdateActCost', 't');
end if;
if not exists(select 1 from metric where metric_name='xwdAddPackBatch') then
  perform setMetric('xwdAddPackBatch', 't');
end if;
end$$;