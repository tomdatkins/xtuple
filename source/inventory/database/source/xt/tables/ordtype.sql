insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'toitem', 'TO'
where not exists (select * from xt.ordtype where ordtype_tblname = 'toitem');

insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'tohead', 'TO'
where not exists (select * from xt.ordtype where ordtype_tblname = 'tohead');
