select xt.create_table('distdetail');

select xt.add_column('distdetail','distdetail_id', 'serial', 'primary key');
select xt.add_column('distdetail','distdetail_order_type', 'text');
select xt.add_column('distdetail','distdetail_orderhead_id', 'integer');
select xt.add_column('distdetail','distdetail_orderitem_id', 'integer');
select xt.add_column('distdetail','distdetail_qty', 'numeric');
select xt.add_column('distdetail','distdetail_location_id', 'integer');
select xt.add_column('distdetail','distdetail_lot', 'text');
select xt.add_column('distdetail','distdetail_expiration', 'date');
select xt.add_column('distdetail','distdetail_warranty', 'date');
select xt.add_column('distdetail','distdetail_itemsite_id', 'integer');

select xt.add_constraint('distdetail', 'distdetail_pkey', 'primary key (distdetail_id)');
select xt.add_constraint('distdetail', 'distdetail_location_id_fkey', 'foreign key (distdetail_location_id) references location (location_id)');
select xt.add_constraint('distdetail', 'distdetail_itemsite_id_fkey', 'foreign key (distdetail_itemsite_id) references itemsite (itemsite_id)');

revoke all on sequence xt.distdetail_distdetail_id_seq from public;
grant all on sequence xt.distdetail_distdetail_id_seq to xtrole;

comment on table xt.distdetail is 'XTMI - distribution detail';