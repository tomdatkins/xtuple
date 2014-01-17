select xt.create_table('towf', 'xt', false, 'xt.wf');

select xt.add_constraint('towf', 'towf_pkey', 'primary key (wf_id)');
select xt.add_constraint('towf', 'towf_wf_priority_id_fkey', 'foreign key (wf_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('towf', 'towf_wf_parent_uuid_fkey', 'foreign key (wf_parent_uuid) references tohead (obj_uuid) on delete cascade');

comment on table xt.towf is 'Transfer order workflow table';
