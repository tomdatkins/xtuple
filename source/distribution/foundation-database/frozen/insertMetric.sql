insert into metric (metric_name, metric_value)
select 'CatalogQueryLimit', '1000'
where not exists (select metric_id from metric where metric_name='CatalogQueryLimit');
