select xt.create_table('recvdetail');

select xt.add_column('recvdetail','recvdetail_id', 'integer', 'primary key');
select xt.add_column('recvdetail','recvdetail_ordertype', 'text');
select xt.add_column('recvdetail','recvdetail_orderhead_id', 'integer');
select xt.add_column('recvdetail','recvdetail_orderitem_id', 'integer');
select xt.add_column('recvdetail','recvdetail_qty', 'numeric');
select xt.add_column('recvdetail','recvdetail_location_id', 'integer');
select xt.add_column('recvdetail','recvdetail_lot', 'text');
select xt.add_column('recvdetail','recvdetail_expiration', 'date');

select xt.add_constraint('recvdetail', 'recvdetail_location_id_fkey', 'foreign key (recvdetail_location_id) references location (location_id)');

comment on table xt.recvdetail is 'XTMI - receipt distribution detail';