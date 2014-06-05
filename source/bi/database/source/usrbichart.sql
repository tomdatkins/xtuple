select xt.create_table('usrbichart', 'bi');

select xt.add_column('usrbichart','usrbichart_id', 'serial', 'primary key', 'bi');
select xt.add_column('usrbichart','usrbichart_usr_username', 'text', '', 'bi');
select xt.add_column('usrbichart','usrbichart_chart', 'text', '', 'bi');
select xt.add_column('usrbichart','usrbichart_ext_name', 'text', '', 'bi');
select xt.add_column('usrbichart','usrbichart_filter_option', 'text', '', 'bi');
select xt.add_column('usrbichart','usrbichart_groupby_option', 'text', '', 'bi');
select xt.add_column('usrbichart','usrbichart_measure', 'text', '', 'bi');
select xt.add_column('usrbichart','usrbichart_charttype', 'text', '', 'bi');
select xt.add_column('usrbichart','usrbichart_dimension', 'text', '', 'bi');
select xt.add_column('usrbichart','usrbichart_order', 'integer', '', 'bi');
select xt.add_column('usrbichart','usrbichart_uuid_filter', 'text', '', 'bi');

comment on table bi.usrbichart is 'Charts users have selected for dashboard';
