insert into xt.sordtype (sordtype_tblname, sordtype_code) 
select 'poitem', 'P'
where not exists (select * from xt.sordtype where sordtype_tblname = 'poitem');

insert into xt.sordtype (sordtype_tblname, sordtype_code) 
select 'pr', 'R'
where not exists (select * from xt.sordtype where sordtype_tblname = 'pr');


