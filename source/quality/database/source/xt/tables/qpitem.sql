-- table definition

select xt.create_table('qpitem', 'xt');

select xt.add_column('qpitem','qpitem_id', 'serial', null, 'xt');
select xt.add_column('qpitem','qpitem_qphead_id', 'integer', null, 'xt');
select xt.add_column('qpitem','qpitem_qspec_id', 'integer', null, 'xt');

select xt.add_primary_key('qpitem', 'qpitem_id', 'xt');
select xt.add_constraint('qpitem', 'qpitem_qmhead_id_fkey', 'foreign key (qpitem_qphead_id) references xt.qphead (qphead_id) ON DELETE CASCADE', 'xt');
select xt.add_constraint('qpitem', 'qpitem_qspec_id_fkey', 'foreign key (qpitem_qspec_id) references xt.qspec (qspec_id) ON DELETE NO ACTION', 'xt');

comment on table xt.qpitem is 'Quality Control Plan Item (Test Plan Specifications)';

