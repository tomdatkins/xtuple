do $$
begin
if fetchMetricText('ServerVersion') < '4.9.0' then

  perform setMetric('xwdUpdateActCost', 't');
  perform setMetric('xwdAddPackBatch', 't');

end if;
end$$;