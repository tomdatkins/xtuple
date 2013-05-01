-- table definition

select xt.create_table('teprj', 'te');

-- remove old trigger if any
drop trigger if exists teprjtrigger on te.teprj;

select xt.add_column('teprj','teprj_id', 'serial', 'not null', 'te');
select xt.add_column('teprj','teprj_prj_id', 'integer', '', 'te');
select xt.add_column('teprj','teprj_cust_id', 'integer', '', 'te');
select xt.add_column('teprj','teprj_rate', 'numeric', '', 'te');
select xt.add_column('teprj','teprj_curr_id', 'integer', '', 'te');
select xt.add_primary_key('teprj', 'teprj_id', 'te');
select xt.add_constraint('teprj', 'teprj_teprj_curr_id_fkey','foreign key (teprj_curr_id) references curr_symbol (curr_id)', 'te');
select xt.add_constraint('teprj', 'teprj_teprj_cust_id_fkey','foreign key (teprj_cust_id) references custinfo (cust_id)', 'te');

comment on table te.teprj is 'Time Expense Project';

-- create trigger

create trigger teprjtrigger after insert or update on te.teprj for each row execute procedure te.triggerteprj();