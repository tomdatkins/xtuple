-- table definitions

select xt.create_table('xd_stdorditem', 'xdruple');
select xt.add_column('xd_stdorditem','xd_stdorditem_id', 'serial', 'primary key', 'xdruple', 'xd_stdorditem table primary key.');
select xt.add_column('xd_stdorditem','xd_stdorditem_item_id', 'integer', 'not null', 'xdruple', 'Item database id.');
select xt.add_column('xd_stdorditem','xd_stdorditem_cust_id', 'integer', 'not null', 'xdruple', 'Customer database id.');
select xt.add_column('xd_stdorditem','xd_stdorditem_shipto_id', 'integer', 'not null', 'xdruple', 'Shipto database id.');
select xt.add_column('xd_stdorditem','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'xdruple');

select xt.add_constraint('xd_stdorditem','xd_stdorditem_unique', 'unique(xd_stdorditem_item_id, xd_stdorditem_cust_id, xd_stdorditem_shipto_id)', 'xdruple');
select xt.add_constraint('xd_stdorditem', 'xd_stdorditem_obj_uuid_unique','unique(obj_uuid)', 'xdruple');

select xt.add_index('xd_stdorditem', 'xd_stdorditem_cust_id', 'xd_stdorditem_cust_id_idx', 'btree', 'xdruple');
select xt.add_index('xd_stdorditem', 'xd_stdorditem_shipto_id', 'xd_stdorditem_shipto_id_idx', 'btree', 'xdruple');

comment on table xdruple.xd_stdorditem is 'Defines Standard Order Items for a Customer''s Ship To.';