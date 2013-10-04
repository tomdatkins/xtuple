-- Table definition for Drupal Commerce integration of 'commerce_price' field data.

select xt.create_table('xd_field_data_comm_price_data', 'xdruple');
select xt.add_column('xd_field_data_comm_price_data','id', 'serial', 'primary key', 'xdruple', 'Internal id key.');
select xt.add_column('xd_field_data_comm_price_data','entity_type', 'text', 'not null default ''commerce_product''', 'xdruple', 'Drupal entity type this data is attached to.');
select xt.add_column('xd_field_data_comm_price_data','bundle', 'text', 'not null default ''product''', 'xdruple', 'Drupal field instance bundle to which this row belongs, used when deleting a field instance.');
select xt.add_column('xd_field_data_comm_price_data','deleted', 'integer', 'not null default 0', 'xdruple', 'Integer boolean indicating whether this data item has been deleted');
select xt.add_column('xd_field_data_comm_price_data','item_id', 'integer', 'not null', 'xdruple', 'Item id this data is attached to.');
select xt.add_column('xd_field_data_comm_price_data','language', 'text', 'not null default ''und''', 'xdruple', 'The language for this data item.');
select xt.add_column('xd_field_data_comm_price_data','delta', 'integer', 'not null default 0', 'xdruple', 'The sequence number for this data item, used for multi-value fields.');
select xt.add_column('xd_field_data_comm_price_data','curr_id', 'integer', 'not null', 'xdruple', 'The currency id for the price.');
select xt.add_column('xd_field_data_comm_price_data','commerce_price_data', 'text', 'not null default ''''', 'xdruple', 'A serialized array of additional price data.');

select xt.add_constraint('xd_field_data_comm_price_data', 'xd_field_data_comm_price_data_item_id_fkey', 'foreign key (item_id) references item (item_id)', 'xdruple');
select xt.add_constraint('xd_field_data_comm_price_data','xd_field_data_comm_price_data_unique', 'unique (entity_type, item_id, deleted, delta, language)', 'xdruple');
select xt.add_constraint('xd_field_data_comm_price_data','xd_field_data_comm_price_data_item_id_check', 'check (item_id > 0)', 'xdruple');
select xt.add_constraint('xd_field_data_comm_price_data','xd_field_data_comm_price_data_deleted_check', 'check (deleted = 0 OR deleted = 1)', 'xdruple');
select xt.add_constraint('xd_field_data_comm_price_data','xd_field_data_comm_price_data_delta_check', 'check (delta >= 0)', 'xdruple');

select xt.add_index('xd_field_data_comm_price_data', 'entity_type', 'xd_field_data_dc_price_entity_type_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_comm_price_data', 'bundle', 'xd_field_data_dc_price_bundle_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_comm_price_data', 'deleted', 'xd_field_data_dc_price_deleted_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_comm_price_data', 'item_id', 'xd_field_data_dc_price_item_id_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_comm_price_data', 'language', 'xd_field_data_dc_price_language_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_comm_price_data', 'curr_id', 'xd_field_data_dc_price_curr_id_idx', 'btree', 'xdruple');

comment on table xdruple.xd_field_data_comm_price_data is 'Table definition for Drupal Commerce integration of ''commerce_price'' field data.';
