-- table definition

select xt.create_table('qspec', 'xt');

select xt.add_column('qspec','qspec_id', 'serial', null, 'xt');
select xt.add_column('qspec','qspec_code', 'text', null, 'xt');
select xt.add_column('qspec','qspec_active', 'boolean', null, 'xt');
select xt.add_column('qspec','qspec_descrip', 'text', null, 'xt');
select xt.add_column('qspec','qspec_qspectype_id', 'integer', null, 'xt');
select xt.add_column('qspec','qspec_instructions', 'text', null, 'xt');
select xt.add_column('qspec','qspec_equipment', 'text', null, 'xt');
select xt.add_column('qspec','qspec_type', 'text', null, 'xt');
select xt.add_column('qspec','qspec_target', 'numeric', null, 'xt');
select xt.add_column('qspec','qspec_upper', 'numeric', null, 'xt');
select xt.add_column('qspec','qspec_lower', 'numeric', null, 'xt');
select xt.add_column('qspec','qspec_notes', 'text', null, 'xt');
select xt.add_column('qspec','qspec_uom', 'text', null, 'xt');

select xt.add_primary_key('qspec', 'qspec_id', 'xt');
select xt.add_constraint('qspec', 'qspec_code_unq', 'unique (qspec_code)', 'xt');
select xt.add_constraint('qspec', 'qspec_type_check', $$check (qspec_type IN ('T', 'N', 'B'))$$, 'xt');

comment on table xt.qspec is 'Quality Control Test Specification';

