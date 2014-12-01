-- Table definition for Drupal Commerce integration of 'commerce_product' entity data.

select xt.create_table('xd_commerce_product_data', 'xdruple');
select xt.add_column('xd_commerce_product_data','id', 'serial', 'primary key', 'xdruple', 'Internal id key.');
select xt.add_column('xd_commerce_product_data','item_id', 'integer', 'not null', 'xdruple', 'Item id this data is attached to.');
select xt.add_column('xd_commerce_product_data','type', 'text', 'not null default ''product''', 'xdruple', 'The commerce_product_type.type of this product.');
select xt.add_column('xd_commerce_product_data','language', 'text', 'not null default ''und''', 'xdruple', 'The languages.language of this product.');
select xt.add_column('xd_commerce_product_data','uid', 'integer', 'not null default 0', 'xdruple', 'The users.uid that created this product.');
select xt.add_column('xd_commerce_product_data','status', 'integer', 'not null default 1', 'xdruple', 'Integer boolean indicating whether or not the product appears in lists and may be added to orders.');
select xt.add_column('xd_commerce_product_data','created', 'integer', 'not null default extract(EPOCH from CURRENT_DATE)', 'xdruple', 'The Unix timestamp when the product was created.');
select xt.add_column('xd_commerce_product_data','changed', 'integer', 'not null default extract(EPOCH from CURRENT_DATE)', 'xdruple', 'The Unix timestamp when the product was most recently saved.');
select xt.add_column('xd_commerce_product_data','data', 'bytea', 'not null default ''''', 'xdruple', 'A serialized array of additional data.');

select xt.add_constraint('xd_commerce_product_data', 'xd_commerce_product_data_item_id_fkey', 'foreign key (item_id) references item (item_id)', 'xdruple');
select xt.add_constraint('xd_commerce_product_data','xd_commerce_product_data_item_id_check', 'check (item_id >= 0)', 'xdruple');
select xt.add_constraint('xd_commerce_product_data','xd_commerce_product_data_uid_check', 'check (uid >= 0)', 'xdruple');
select xt.add_constraint('xd_commerce_product_data','xd_commerce_product_data_status_check', 'check (status = 0 OR status = 1)', 'xdruple');

select xt.add_index('xd_commerce_product_data', 'item_id', 'xd_commerce_product_data_item_id_idx', 'btree', 'xdruple');
select xt.add_index('xd_commerce_product_data', 'type', 'xd_commerce_product_data_type_idx', 'btree', 'xdruple');
select xt.add_index('xd_commerce_product_data', 'uid', 'xd_commerce_product_data_uid_idx', 'btree', 'xdruple');
select xt.add_index('xd_commerce_product_data', 'status', 'xd_commerce_product_data_status_idx', 'btree', 'xdruple');

comment on table xdruple.xd_commerce_product_data is 'Table definition for Drupal Commerce integration of ''commerce_product'' entity data.';

GRANT ALL ON TABLE xdruple.xd_commerce_product_data_id_seq TO admin;
GRANT ALL ON TABLE xdruple.xd_commerce_product_data_id_seq TO xtrole;
