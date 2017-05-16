-- CREATE TABLE xtincdtpls.incdtbomver

select xt.create_table('incdtbomver', 'xtincdtpls');

select xt.add_column('incdtbomver','incdtbomver_id','serial',null,'xtincdtpls');
select xt.add_column('incdtbomver','incdtbomver_incdt_id','integer',null,'xtincdtpls');
select xt.add_column('incdtbomver','incdtbomver_found_prjver_id','integer',null,'xtincdtpls');
select xt.add_column('incdtbomver','incdtbomver_fixed_prjver_id','integer',null,'xtincdtpls');
select xt.add_column('incdtbomver','incdtbomver_found_rev_id','integer',null,'xtincdtpls');
select xt.add_column('incdtbomver','incdtbomver_fixed_rev_id','integer',null,'xtincdtpls');

select xt.add_primary_key('incdtbomver', 'incdtbomver_id', 'xtincdtpls');
select xt.add_constraint('incdtbomver', 'incdtbomver_incdtbomver_fixed_prjver_id_fkey', 'foreign key (incdtbomver_fixed_prjver_id) references xtincdtpls.prjver (prjver_id)', 'xtincdtpls');
select xt.add_constraint('incdtbomver', 'incdtbomver_incdtbomver_found_prjver_id_fkey', 'foreign key (incdtbomver_found_prjver_id) references xtincdtpls.prjver (prjver_id)', 'xtincdtpls');
select xt.add_constraint('incdtbomver', 'incdtbomver_incdtbomver_incdt_id_fkey', 'foreign key (incdtbomver_incdt_id) references incdt (incdt_id)', 'xtincdtpls');

comment on table xtincdtpls.incdtbomver is 'Add bom revision number associations to incident records';