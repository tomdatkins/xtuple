-- table definition

select xt.create_table('teemp', 'te');
select xt.add_column('teemp','teemp_id', 'serial', 'not null', 'te');
select xt.add_column('teemp','teemp_emp_id', 'integer', '', 'te');
select xt.add_column('teemp','teemp_contractor', 'boolean', 'default false', 'te');
select xt.add_constraint('teemp', 'teemp_teemp_emp_id_fkey', 'foreign key (teemp_emp_id) references emp (emp_id)', 'te');

comment on table te.teemp is 'Time Expense Employee';
