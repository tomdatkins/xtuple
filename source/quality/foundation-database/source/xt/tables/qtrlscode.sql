-- Quality Test Release Code table definition

select xt.create_table('qtrlscode', 'xt');

select xt.add_column('qtrlscode','qtrlscode_id', 'serial', null, 'xt');
select xt.add_column('qtrlscode','qtrlscode_code', 'text', null, 'xt');
select xt.add_column('qtrlscode','qtrlscode_descrip', 'text', null, 'xt');

select xt.add_primary_key('qtrlscode', 'qtrlscode_id', 'xt');
select xt.add_constraint('qtrlscode', 'qtrlscode_code_unq', 'unique (qtrlscode_code)', 'xt');

comment on table xt.qtrlscode is 'Quality Test Release/Override Code';
