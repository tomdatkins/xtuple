-- table definition

select xt.create_table('poemlprofile', 'xt', false, 'xt.emlprofile');
select xt.add_constraint('poemlprofile','poemlprofile_emlprofile_name', 'unique(emlprofile_name)');
select xt.add_constraint('poemlprofile','poemlprofile_pkey', 'primary key (emlprofile_id)');

comment on table xt.poemlprofile is 'Table for purchase email profiles';
