-- table definition

select xt.create_table('qplanemlprofile', 'xt', false, 'xt.emlprofile');
select xt.add_constraint('qplanemlprofile','qplanemlprofile_emlprofile_name', 'unique(emlprofile_name)');
select xt.add_constraint('qplanemlprofile','qplanemlprofile_pkey', 'primary key (emlprofile_id)');

comment on table xt.qplanemlprofile is 'Table for Quality Plan email profiles - inherited';

select createPriv('Quality', 'MaintainQualityPlanEmailProfiles', 'Can Maintain Quality Plan Email Profiles', NULL, 'xtquality');
