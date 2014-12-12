select xt.create_table('qualitytestwf', 'xt', false, 'xt.wf');

select xt.add_constraint('qualitytestwf', 'qualitytestwf_pkey', 'primary key (wf_id)');
select xt.add_constraint('qualitytestwf', 'qualitytestwf_wf_priority_id_fkey', 'foreign key (wf_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('qualitytestwf', 'qualitytestwf_wf_parent_uuid_fkey', 'foreign key (wf_parent_uuid) references xt.qthead (obj_uuid) on delete cascade');

comment on table xt.qualitytestwf is 'Quality Test workflow table';
