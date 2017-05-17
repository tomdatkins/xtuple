-- table definition

select xt.create_table('qplantype', 'xt');

select xt.add_column('qplantype','qplantype_id', 'serial', null, 'xt', 'Sequence identifier for quality plan type.');
select xt.add_column('qplantype','qplantype_code', 'text', null, 'xt', 'User defined identifier for quality plan type.');
select xt.add_column('qplantype','qplantype_descr', 'text', null, 'xt', 'Description for quality plan type.');
select xt.add_column('qplantype','qplantype_active', 'boolean', 'NOT NULL DEFAULT true', 'xt', 'Active status of a quality plan type.');
select xt.add_column('qplantype','qplantype_default', 'boolean', 'NOT NULL DEFAULT false', 'xt', 'Mark a quality plan type as the default type.');

select xt.add_primary_key('qplantype', 'qplantype_id', 'xt');
select xt.add_constraint('qplantype', 'qplantype_code_unq', 'unique (qplantype_code)', 'xt');

comment on table xt.qplantype is 'Quality Plan Type';

