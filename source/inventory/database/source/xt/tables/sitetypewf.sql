select xt.create_table('sitetypewf', 'xt', false, 'xt.wfsrc');

select xt.add_constraint('sitetypewf', 'sitetypewf_pkey', 'primary key (wfsrc_id)');
select xt.add_constraint('sitetypewf', 'sitetypewf_wfsrc_priority_id_fkey', 'foreign key (wfsrc_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('sitetypewf', 'sitetypewf_wfsrc_parent_id_fkey', 'foreign key (wfsrc_parent_id) references sitetype (sitetype_id) on delete cascade');

comment on table xt.sitetypewf is 'Site type workflow table';
