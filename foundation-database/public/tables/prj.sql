select xt.add_column('prj', 'prj_created',      'TIMESTAMP WITH TIME ZONE', NULL, 'public');
select xt.add_column('prj', 'prj_lastupdated',  'TIMESTAMP WITH TIME ZONE', NULL, 'public');
select xt.add_column('prj','prj_dept_id', 'integer', 'references dept (dept_id)', 'public', 'Project Department');
select xt.add_column('prj','prj_priority_id', 'integer', 'references incdtpriority (incdtpriority_id)', 'public', 'Project Priority');
select xt.add_column('prj','prj_pct_complete', 'numeric', null, 'public', 'Project Percent Complete');

