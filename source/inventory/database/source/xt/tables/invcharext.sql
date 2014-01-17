select xt.create_table('invcharext');

select xt.add_column('invcharext','invcharext_id', 'integer', 'primary key');
select xt.add_column('invcharext','invcharext_transferorders', 'boolean');

comment on table xt.invcharext is 'Inventory characteristic extension table';

insert into xt.invcharext
select char_id, false
from char
where char_id not in (select invcharext_id from xt.invcharext where char_id=invcharext_id);
