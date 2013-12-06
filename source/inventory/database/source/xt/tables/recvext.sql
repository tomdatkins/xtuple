select xt.create_table('recvext');

select xt.add_column('recvext','recvext_recv_id', 'integer', 'primary key');
select xt.add_column('recvext','recvext_detail', 'text');

comment on table xt.recvext is 'Receipt distribution detail';