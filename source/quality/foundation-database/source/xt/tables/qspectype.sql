-- table definition

select xt.create_table('qspectype', 'xt');

select xt.add_column('qspectype','qspectype_id', 'serial', null, 'xt');
select xt.add_column('qspectype','qspectype_code', 'text', null, 'xt');
select xt.add_column('qspectype','qspectype_descrip', 'text', null, 'xt');

select xt.add_primary_key('qspectype', 'qspectype_id', 'xt');
select xt.add_constraint('qspectype', 'qspectype_code_unq', 'unique (qspectype_code)', 'xt');

comment on table xt.qspectype is 'Quality Control Specification Type/Group';

