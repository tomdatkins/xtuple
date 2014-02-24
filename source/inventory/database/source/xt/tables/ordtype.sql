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

insert into xt.ordtype (ordtype_tblname, ordtype_code)
select 'pr', 'PR'
where not exists (select * from xt.ordtype where ordtype_tblname = 'pr');

insert into xt.ordtype (ordtype_tblname, ordtype_code)
select 'planord', 'PL'
where not exists (select * from xt.ordtype where ordtype_tblname = 'planord');

insert into xt.ordtype (ordtype_tblname, ordtype_code)
select 'plreq', 'PL'
where not exists (select * from xt.ordtype where ordtype_tblname = 'planreq');
