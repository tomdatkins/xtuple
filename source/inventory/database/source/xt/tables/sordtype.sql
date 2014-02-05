-- table definition

select xt.create_table('sordtype', 'xt');
select xt.add_column('sordtype','sordtype_id', 'serial', 'primary key', 'xt');
select xt.add_column('sordtype','sordtype_tblname', 'text', '', 'xt');
select xt.add_column('sordtype','sordtype_code', 'text', '', 'xt');

comment on table xt.sordtype is 'Sales Order Child Type Map';

insert into xt.sordtype (sordtype_tblname, sordtype_code) 
select 'poitem', 'P'
where not exists (select * from xt.sordtype where sordtype_tblname = 'poitem');

insert into xt.sordtype (sordtype_tblname, sordtype_code) 
select 'pr', 'R'
where not exists (select * from xt.sordtype where sordtype_tblname = 'pr');


