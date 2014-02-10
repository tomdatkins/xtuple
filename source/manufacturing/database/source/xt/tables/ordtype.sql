insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'wo', 'WO'
where not exists (select * from xt.ordtype where ordtype_tblname = 'wo');
