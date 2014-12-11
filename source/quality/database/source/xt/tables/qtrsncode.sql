-- Quality Test Reason Code table definition

select xt.create_table('qtrsncode', 'xt');

select xt.add_column('qtrsncode','qtrsncode_id', 'serial', null, 'xt');
select xt.add_column('qtrsncode','qtrsncode_code', 'text', null, 'xt');
select xt.add_column('qtrsncode','qtrsncode_descrip', 'text', null, 'xt');

select xt.add_primary_key('qtrsncode', 'qtrsncode_id', 'xt');
select xt.add_constraint('qtrsncode', 'qtrsncode_code_unq', 'unique (qtrsncode_code)', 'xt');

comment on table xt.qtrsncode is 'Quality Test Reason Code';
