select xt.create_table('recvdetail');

select xt.add_column('recvdetail','recvdetail_id', 'serial', 'primary key');
select xt.add_column('recvdetail','recvdetail_order_type', 'text');
select xt.add_column('recvdetail','recvdetail_orderhead_id', 'integer');
select xt.add_column('recvdetail','recvdetail_orderitem_id', 'integer');
select xt.add_column('recvdetail','recvdetail_qty', 'numeric');
select xt.add_column('recvdetail','recvdetail_location_id', 'integer');
select xt.add_column('recvdetail','recvdetail_lot', 'text');
select xt.add_column('recvdetail','recvdetail_expiration', 'date');
select xt.add_column('recvdetail','recvdetail_warranty', 'date');
select xt.add_column('recvdetail','recvdetail_posted', 'boolean');
select xt.add_column('recvdetail','recvdetail_itemsite_id', 'integer');
select xt.add_column('recvdetail','recvdetail_itemlocdist_id', 'integer');

select xt.add_constraint('recvdetail', 'recvdetail_pkey', 'primary key (recvdetail_id)');
select xt.add_constraint('recvdetail', 'recvdetail_location_id_fkey', 'foreign key (recvdetail_location_id) references location (location_id)');
select xt.add_constraint('recvdetail', 'recvdetail_itemsite_id_fkey', 'foreign key (recvdetail_itemsite_id) references itemsite (itemsite_id)');

revoke all on sequence xt.recvdetail_recvdetail_id_seq from public;
grant all on sequence xt.recvdetail_recvdetail_id_seq to xtrole;

comment on table xt.recvdetail is 'XTMI - receipt distribution detail';