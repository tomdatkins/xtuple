-- table definition

select xt.create_table('qplanemlprofile', 'xt', false, 'xt.emlprofile');
select xt.add_constraint('qplanemlprofile','qplanemlprofile_emlprofile_name', 'unique(emlprofile_name)');
select xt.add_constraint('qplanemlprofile','qplanemlprofile_pkey', 'primary key (emlprofile_id)');

comment on table xt.qplanemlprofile is 'Table for Quality Plan email profiles - inherited';

-- this priv does not exist in postbooks so create it here
select xt.add_priv('MaintainQualityPlanEmailProfiles', 'Can Maintain Quality Plan Email Profiles', 'Quality', 'Quality');
