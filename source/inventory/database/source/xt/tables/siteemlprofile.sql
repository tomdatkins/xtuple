-- table definition

select xt.create_table('siteemlprofile', 'xt', false, 'xt.emlprofile');
select xt.add_constraint('siteemlprofile','siteemlprofile_emlprofile_name', 'unique(emlprofile_name)');
select xt.add_constraint('siteemlprofile','siteemlprofile_pkey', 'primary key (emlprofile_id)');

comment on table xt.siteemlprofile is 'Table for site email profiles';

-- this priv does not exist in postbooks so create it here
select xt.add_priv('MaintainSiteEmailProfiles', 'Can Maintain Site Email Profiles', 'Inventory', 'Inventory');
