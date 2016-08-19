-- table definition

select xt.create_table('qpheadass', 'xt');

select xt.add_column('qpheadass','qpheadass_id', 'serial', null, 'xt');
select xt.add_column('qpheadass','qpheadass_qphead_id', 'integer', null, 'xt');
select xt.add_column('qpheadass','qpheadass_item_id', 'integer', null, 'xt');
select xt.add_column('qpheadass','qpheadass_warehous_id', 'integer', null, 'xt');
select xt.add_column('qpheadass','qpheadass_oper', 'boolean', null, 'xt');
select xt.add_column('qpheadass','qpheadass_prod', 'boolean', null, 'xt');
select xt.add_column('qpheadass','qpheadass_recv', 'boolean', null, 'xt');
select xt.add_column('qpheadass','qpheadass_ship', 'boolean', null, 'xt');
select xt.add_column('qpheadass','qpheadass_testfreq', 'integer', null, 'xt');
select xt.add_column('qpheadass','qpheadass_freqtype', 'text', null, 'xt');

select xt.add_primary_key('qpheadass', 'qpheadass_id', 'xt');
select xt.add_constraint('qpheadass', 'qpheadass_qmhead_id_fkey', 'foreign key (qpheadass_qphead_id) references xt.qphead (qphead_id)', 'xt');
select xt.add_constraint('qpheadass', 'qpheadass_item_id_fkey', 'foreign key (qpheadass_item_id) references public.item (item_id)', 'xt');
select xt.add_constraint('qpheadass', 'qpheadass_warehous_id_fkey', 'foreign key (qpheadass_warehous_id) references public.whsinfo (warehous_id)', 'xt');

comment on table xt.qpheadass is 'Quality Management Control Plan Item Site Assignment and Test Frequency';

