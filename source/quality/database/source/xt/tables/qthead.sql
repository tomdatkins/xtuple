-- table definition

select xt.create_table('qthead', 'xt');

select xt.add_column('qthead','qthead_id', 'serial', null, 'xt');
select xt.add_column('qthead','qthead_number', 'text', null, 'xt');
select xt.add_column('qthead','qthead_qphead_id', 'integer', null, 'xt');
select xt.add_column('qthead','qthead_item_id', 'integer', null, 'xt');
select xt.add_column('qthead','qthead_warehous_id', 'integer', null, 'xt');
select xt.add_column('qthead','qthead_ordtype', 'text', null, 'xt');
select xt.add_column('qthead','qthead_ordnumber', 'text', null, 'xt');
select xt.add_column('qthead','qthead_ls_id', 'integer', null, 'xt');
select xt.add_column('qthead','qthead_rev_number', 'text', null, 'xt');
select xt.add_column('qthead','qthead_start_date', 'date', null, 'xt');
select xt.add_column('qthead','qthead_completed_date', 'date', null, 'xt');
select xt.add_column('qthead','qthead_status', 'text', null, 'xt');
select xt.add_column('qthead','qthead_disposition', 'text', null, 'xt');
select xt.add_column('qthead','qthead_notes', 'text', null, 'xt');
select xt.add_column('qthead','obj_uuid', 'uuid', ' DEFAULT xt.uuid_generate_v4()', 'xt');

select xt.add_primary_key('qthead', 'qthead_id', 'xt');
select xt.add_constraint('qthead', 'qthead_status_check', $$check (qthead_status = any (array['O'::bpchar, 'P'::bpchar, 'F'::bpchar]))$$, 'xt');
select xt.add_constraint('qthead', 'qthead_item_id_fkey', 'foreign key (qthead_item_id) references public.item (item_id)', 'xt');
select xt.add_constraint('qthead', 'qthead_warehous_id_fkey', 'foreign key (qthead_warehous_id) references public.whsinfo (warehous_id)', 'xt');
select xt.add_constraint('qthead', 'qthead_uuid_unq', 'UNIQUE (obj_uuid)', 'xt');

comment on table xt.qthead is 'Quality Control Test Document';

