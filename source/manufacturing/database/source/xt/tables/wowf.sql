select xt.create_table('wowf', 'xt', false, 'xt.wf');

select xt.add_constraint('wowf', 'wowf_pkey', 'primary key (wf_id)');
select xt.add_constraint('wowf', 'wowf_wf_priority_id_fkey', 'foreign key (wf_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('wowf', 'wowf_wf_parent_uuid_fkey', 'foreign key (wf_parent_uuid) references wo (obj_uuid) on delete cascade');

comment on table xt.wowf is 'Work Order workflow table';
