-- table definition

select xt.create_table('wordtype', 'xt');
select xt.add_column('wordtype','wordtype_id', 'serial', 'primary key', 'xt');
select xt.add_column('wordtype','wordtype_tblname', 'text', '', 'xt');
select xt.add_column('wordtype','wordtype_code', 'text', '', 'xt');

comment on table xt.wordtype is 'Work Order Parent Type Map';

insert into xt.wordtype (wordtype_tblname, wordtype_code) 
select 'wo', 'W'
where not exists (select * from xt.wordtype where wordtype_tblname = 'wo');

insert into xt.wordtype (wordtype_tblname, wordtype_code) 
select 'coitem', 'S'
where not exists (select * from xt.wordtype where wordtype_tblname = 'coitem');
