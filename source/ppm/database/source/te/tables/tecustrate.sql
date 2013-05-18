-- table definition

select xt.create_table('tecustrate', 'te');
select xt.add_column('tecustrate','tecustrate_id', 'serial', 'not null', 'te');
select xt.add_column('tecustrate','tecustrate_cust_id', 'integer', 'not null', 'te');
select xt.add_column('tecustrate','tecustrate_rate', 'numeric(16,4)', 'not null', 'te');
select xt.add_column('tecustrate','tecustrate_curr_id', 'integer', 'not null default basecurrid()', 'te');
select xt.add_primary_key('tecustrate', 'tecustrate_cust_id', 'te');
select xt.add_constraint('tecustrate', 'tecustrate_tecustrate_cust_id_fkey', 'foreign key (tecustrate_cust_id) references custinfo (cust_id)', 'te');
select xt.add_constraint('tecustrate', 'tecustrate_tecustrate_curr_id_fkey', 'foreign key (tecustrate_curr_id) references curr_symbol (curr_id)', 'te');

comment on table te.tecustrate is 'Customer rate';
