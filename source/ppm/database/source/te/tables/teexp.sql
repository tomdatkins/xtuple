-- table definition

select xt.create_table('teexp', 'te');
select xt.add_column('teexp','teexp_id', 'integer', 'not null', 'te');
select xt.add_column('teexp','teexp_expcat_id', 'integer', '', 'te');
select xt.add_column('teexp','teexp_accnt_id', 'integer', '', 'te');
select xt.add_primary_key('teexp', 'teexp_id', 'te');

comment on table te.teexp is 'Time Expense Item Master';
