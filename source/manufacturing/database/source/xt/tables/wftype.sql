
insert into xt.wftype (wftype_tblname, wftype_code, wftype_src_tblname) 
select 'wowf', 'WO', 'plancodewf'
where not exists (select * from xt.wftype where wftype_tblname = 'wowf');