
insert into xt.sordtype (sordtype_tblname, sordtype_code) 
select 'wo', 'W'
where not exists (select * from xt.sordtype where sordtype_tblname = 'wo');

