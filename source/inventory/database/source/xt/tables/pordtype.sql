-- table definition

select xt.create_table('pordtype', 'xt');
select xt.add_column('pordtype','pordtype_id', 'serial', 'primary key', 'xt');
select xt.add_column('pordtype','pordtype_tblname', 'text', '', 'xt');
select xt.add_column('pordtype','pordtype_code', 'text', '', 'xt');

comment on table xt.pordtype is 'Purchase Request Parent Type Map';

insert into xt.pordtype (pordtype_tblname, pordtype_code) 
select 'wo', 'W'
where not exists (select * from xt.pordtype where pordtype_tblname = 'wo');

insert into xt.pordtype (pordtype_tblname, pordtype_code) 
select 'coitem', 'S'
where not exists (select * from xt.pordtype where pordtype_tblname = 'coitem');
