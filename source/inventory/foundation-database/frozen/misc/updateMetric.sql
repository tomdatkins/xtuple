UPDATE metric SET metric_value='Standard' WHERE metric_name='Application';

UPDATE metric SET metric_value='t' WHERE metric_name='MultiWhs';
insert into metric (metric_name, metric_value)
select 'MultiWhs', 't'
where not exists (select c.metric_id from metric c where c.metric_name = 'MultiWhs');
