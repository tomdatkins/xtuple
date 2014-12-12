select xt.create_table('qualityplanwf', 'xt', false, 'xt.wfsrc');

select xt.add_constraint('qualityplanwf', 'qualityplanwf_pkey', 'primary key (wfsrc_id)');
select xt.add_constraint('qualityplanwf', 'qualityplanwf_wfsrc_priority_id_fkey', 'foreign key (wfsrc_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('qualityplanwf', 'qualityplanwf_wfsrc_parent_id_fkey', 'foreign key (wfsrc_parent_id) references xt.qphead (qphead_id) on delete cascade');

comment on table xt.qualityplanwf is 'Quality Plan workflow table';
