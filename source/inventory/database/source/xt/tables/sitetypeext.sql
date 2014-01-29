select xt.create_table('sitetypeext');

select xt.add_column('sitetypeext','sitetypeext_id', 'integer', 'primary key');
select xt.add_column('sitetypeext','sitetypeext_emlprofile_id', 'integer');

comment on table xt.sitetypeext is 'Site type extension table';

insert into xt.sitetypeext
select sitetype_id, null
from sitetype
where sitetype_id not in (
  select sitetypeext_id
  from xt.sitetypeext);

