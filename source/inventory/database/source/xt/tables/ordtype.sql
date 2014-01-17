insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'toitem', 'TO'
where not exists (select * from xt.ordtype where ordtype_tblname = 'toitem');

insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'tohead', 'TO'
where not exists (select * from xt.ordtype where ordtype_tblname = 'tohead');

insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'poitem', 'PO'
where not exists (select * from xt.ordtype where ordtype_tblname = 'poitem');

insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'pohead', 'PO'
where not exists (select * from xt.ordtype where ordtype_tblname = 'pohead');

insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'cmitem', 'CM'
where not exists (select * from xt.ordtype where ordtype_tblname = 'cmitem');

insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'cmhead', 'CM'
where not exists (select * from xt.ordtype where ordtype_tblname = 'cmhead');
