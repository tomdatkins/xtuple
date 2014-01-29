
insert into xt.wftype (wftype_tblname, wftype_code) 
select 'wowf', 'WO'
where not exists (select * from xt.wftype where wftype_tblname = 'wowf');
