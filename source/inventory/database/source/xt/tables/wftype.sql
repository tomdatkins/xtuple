
insert into xt.wftype (wftype_tblname, wftype_code) 
select 'towf', 'TO'
where not exists (select * from xt.wftype where wftype_tblname = 'towf');
