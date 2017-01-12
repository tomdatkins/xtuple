-- CREATE TABLE xtincdtpls.incdtprjtask

select xt.create_table('incdtprjtask', 'xtincdtpls');

select xt.add_column('incdtprjtask','incdtprjtask_id','serial',null,'xtincdtpls');
select xt.add_column('incdtprjtask','incdtprjtask_incdt_id','integer',null,'xtincdtpls');
select xt.add_column('incdtprjtask','incdtprjtask_prjtask_id','integer',null,'xtincdtpls');

select xt.add_primary_key('incdtprjtask', 'incdtprjtask_id', 'xtincdtpls');
select xt.add_constraint('incdtprjtask', 'incdtprjtask_incdtprjtask_prjtask_id_fkey', 'foreign key (incdtprjtask_prjver_id) references prjtask (prjtask_id)', 'xtincdtpls');
select xt.add_constraint('incdtprjtask', 'incdtprjtask_incdtprjtask_incdt_id_fkey', 'foreign key (incdtprjtask_incdt_id) references incdt (incdt_id)', 'xtincdtpls');

comment on table xtincdtpls.incdtprjtask is 'Add project task association to incidents';