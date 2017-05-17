select xt.create_table('plancodewf', 'xt', false, 'xt.wfsrc');

select xt.add_constraint('plancodewf', 'plancodewf_pkey', 'primary key (wfsrc_id)');
select xt.add_constraint('plancodewf', 'plancodewf_wfsrc_priority_id_fkey', 'foreign key (wfsrc_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('plancodewf', 'plancodewf_wfsrc_parent_id_fkey', 'foreign key (wfsrc_parent_id) references plancode (plancode_id) on delete cascade');

comment on table xt.plancodewf is 'Planner code workflow source table';