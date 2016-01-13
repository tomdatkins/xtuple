select xt.create_table('recvdetail');

select xt.add_column('recvdetail','recvdetail_id', 'integer', 'primary key');
select xt.add_column('recvdetail','recvext_poitem_id', 'integer', );
select xt.add_column('recvdetail','recvext_qty', 'numeric');
select xt.add_column('recvdetail','recvext_location_id', 'integer');
select xt.add_column('recvdetail','recvext_lot', 'text');
select xt.add_column('recvdetail','recvext_expiration', 'date');

select xt.add_constraint('recvdetail', 'recvdetail_poitem_id_fkey', 'foreign key (recvdetail_poitem_id) references poitem (poitem_id)');
select xt.add_constraint('recvdetail', 'recvdetail_location_id_fkey', 'foreign key (recvdetail_location_id) references location (location_id)');

comment on table xt.recvdetail is 'XTMI - receipt distribution detail';