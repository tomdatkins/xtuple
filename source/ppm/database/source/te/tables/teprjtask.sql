-- table definition

select xt.create_table('teprjtask', 'te');
select xt.add_column('teprjtask','teprjtask_id', 'serial', 'not null', 'te');
select xt.add_column('teprjtask','teprjtask_cust_id', 'integer', '', 'te');
select xt.add_column('teprjtask','teprjtask_rate', 'numeric', '', 'te');
select xt.add_column('teprjtask','teprjtask_item_id', 'integer', '', 'te');
select xt.add_column('teprjtask','teprjtask_prjtask_id', 'integer', '', 'te');
select xt.add_column('teprjtask','teprjtask_curr_id', 'integer', '', 'te');
select xt.add_primary_key('teprjtask', 'teprjtask_id', 'te');
select xt.add_constraint('teprjtask', 'teprjtask_teprjtask_curr_id_fkey','foreign key (teprjtask_curr_id) references curr_symbol (curr_id)', 'te');
select xt.add_constraint('teprjtask', 'teprjtask_teprjtask_item_id_fkey','foreign key (teprjtask_item_id) references item (item_id)', 'te');
--select xt.add_constraint('teprjtask', 'teprjtask_teprjtask_prjtask_id_fkey','foreign key (teprjtask_prjtask_id) references prjtask (prjtask_id) ', 'te');
select xt.add_constraint('teprjtask', 'teprjtask_teprjtask_prjtask_id_key','unique (teprjtask_prjtask_id )', 'te');
alter table te.teprjtask drop constraint if exists teprjtask_teprjtask_prjtask_id_fkey;

comment on table te.teprjtask is 'Time Expense Project Task';
