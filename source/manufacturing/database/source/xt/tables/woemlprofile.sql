-- table definition

select xt.create_table('woemlprofile', 'xt', false, 'xt.emlprofile');
select xt.add_constraint('woemlprofile','woemlprofile_emlprofile_name', 'unique(emlprofile_name)');
select xt.add_constraint('woemlprofile','woemlprofile_pkey', 'primary key (emlprofile_id)');

comment on table xt.woemlprofile is 'Table for work order email profiles';

-- this priv does not exist in postbooks so create it here
select xt.add_priv('MaintainWorkOrderEmailProfiles', 'Can Maintain Work Order Email Profiles', 'Manufacture', 'Manufacture');
