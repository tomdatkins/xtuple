select xt.create_table('plancodeext');

select xt.add_column('plancodeext','plancodeext_id', 'integer', 'primary key');
select xt.add_column('plancodeext','plancodeext_emlprofile_id', 'integer');

comment on table xt.plancodeext is 'Planner code extension table';
