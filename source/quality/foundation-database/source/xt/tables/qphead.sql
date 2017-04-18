-- table definition

select xt.create_table('qphead', 'xt');

select xt.add_column('qphead','qphead_id', 'serial', 'NOT NULL', 'xt');
select xt.add_column('qphead','qphead_code', 'text', 'NOT NULL', 'xt');
select xt.add_column('qphead','qphead_descrip', 'text', null, 'xt');
select xt.add_column('qphead','qphead_qplantype_id', 'integer', null, 'xt');
select xt.add_column('qphead','qphead_rev_number', 'text', null, 'xt');
select xt.add_column('qphead','qphead_rev_date', 'date', null, 'xt');
select xt.add_column('qphead','qphead_rev_status', 'text', null, 'xt');
select xt.add_column('qphead','qphead_notes', 'text', null, 'xt');

select xt.add_primary_key('qphead', 'qphead_id', 'xt');
select xt.add_constraint('qphead', 'qphead_code_unq', 'unique (qphead_code, qphead_rev_number)', 'xt');
select xt.add_constraint('qphead', 'qphead_rev_check', $$check (qphead_rev_status = any (array['P'::bpchar, 'A'::bpchar, 'I'::bpchar]))$$, 'xt');
select xt.add_constraint('qphead', 'qphead_qplantype_fk', $$FOREIGN KEY (qphead_qplantype_id) REFERENCES xt.qplantype (qplantype_id) MATCH SIMPLE
                                                          ON UPDATE NO ACTION ON DELETE NO ACTION$$, 'xt');

comment on table xt.qphead is 'Quality Control Plan';

