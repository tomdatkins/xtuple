-- table definition

select xt.create_table('ordtype', 'xtstd');
select xt.add_column('ordtype','ordtype_id', 'serial', 'primary key', 'xtstd');
select xt.add_column('ordtype','ordtype_tblname', 'text', '', 'xtstd');
select xt.add_column('ordtype','ordtype_code', 'text', '', 'xtstd');

comment on table xtstd.ordtype is 'Order Type Map';

insert into xtstd.ordtype (ordtype_tblname, ordtype_code) 
select 'cohead', 'SO'
where not exists (select * from xtstd.ordtype where ordtype_code = 'SO');

insert into xtstd.ordtype (ordtype_tblname, ordtype_code) 
select 'tohead', 'TO'
where not exists (select * from xtstd.ordtype where ordtype_code = 'TO');
