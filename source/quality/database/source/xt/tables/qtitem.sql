-- table definition

select xt.create_table('qtitem', 'xt');

select xt.add_column('qtitem','qtitem_id', 'serial', null, 'xt');
select xt.add_column('qtitem','qtitem_qthead_id', 'integer', null, 'xt');
select xt.add_column('qtitem','qtitem_linenumber', 'integer', null, 'xt');
select xt.add_column('qtitem','qtitem_qpitem_id', 'integer', null, 'xt');
select xt.add_column('qtitem','qtitem_description', 'text', null, 'xt');
select xt.add_column('qtitem','qtitem_instruction', 'text', null, 'xt');
select xt.add_column('qtitem','qtitem_type', 'text', null, 'xt');
select xt.add_column('qtitem','qtitem_target', 'numeric', null, 'xt');
select xt.add_column('qtitem','qtitem_upper', 'numeric', null, 'xt');
select xt.add_column('qtitem','qtitem_lower', 'numeric', null, 'xt');
select xt.add_column('qtitem','qtitem_uom', 'text', null, 'xt');
select xt.add_column('qtitem','qtitem_actual', 'text', null, 'xt');
select xt.add_column('qtitem','qtitem_status', 'text', null, 'xt');
select xt.add_column('qtitem','qtitem_notes', 'text', null, 'xt');
select xt.add_column('qtitem','qtitem_lastchanged_user', 'text', null, 'xt');
select xt.add_column('qtitem','qtitem_lastchanged_time', 'timestamp', null, 'xt');

select xt.add_primary_key('qtitem', 'qtitem_id', 'xt');
select xt.add_constraint('qtitem', 'qtitem_qthead_id_fkey', 'foreign key (qtitem_qthead_id) references xt.qthead (qthead_id) ON DELETE CASCADE', 'xt');
select xt.add_constraint('qtitem', 'qtitem_qpitem_id_fkey', 'foreign key (qtitem_qpitem_id) references xt.qpitem (qpitem_id)', 'xt');

comment on table xt.qtitem is 'Quality Control Test Items';

