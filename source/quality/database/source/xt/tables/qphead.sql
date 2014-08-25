-- table definition

select xt.create_table('qphead', 'xt');

select xt.add_column('qphead','qphead_id', 'serial', null, 'xt');
select xt.add_column('qphead','qphead_code', 'text', null, 'xt');
select xt.add_column('qphead','qphead_descrip', 'text', null, 'xt');
select xt.add_column('qphead','qphead_rev_number', 'text', null, 'xt');
select xt.add_column('qphead','qphead_rev_date', 'date', null, 'xt');
select xt.add_column('qphead','qphead_rev_status', 'text', null, 'xt');
select xt.add_column('qphead','qphead_notes', 'text', null, 'xt');
select xt.add_column('qphead','qphead_emlprofile_id', 'integer', null, 'xt');

select xt.add_primary_key('qphead', 'qphead_id', 'xt');
select xt.add_constraint('qphead', 'qphead_code_unq', 'unique (qphead_code)', 'xt');
select xt.add_constraint('qphead', 'qphead_rev_check', $$check (qphead_rev_status = any (array['P'::bpchar, 'A'::bpchar, 'I'::bpchar]))$$, 'xt');

comment on table xt.qphead is 'Quality Control Plan';

