-- Table definition for Drupal Commerce integration of 'commerce_price' field data

select xt.create_table('xd_field_data_dc_price', 'xdruple');
select xt.add_column('xd_field_data_dc_price','id', 'serial', 'primary key', 'xdruple', 'Internal id key.');
select xt.add_column('xd_field_data_dc_price','entity_type', 'text', 'not null default ''''', 'xdruple', 'Drupal entity type this data is attached to.');
select xt.add_column('xd_field_data_dc_price','bundle', 'text', 'not null default ''''', 'xdruple', 'Drupal field instance bundle to which this row belongs, used when deleting a field instance.');
select xt.add_column('xd_field_data_dc_price','deleted', 'boolean', 'not null default false', 'xdruple', 'A boolean indicating whether this data item has been deleted');
select xt.add_column('xd_field_data_dc_price','item_id', 'integer', 'not null', 'xdruple', 'Item id this data is attached to.');
select xt.add_column('xd_field_data_dc_price','revision_id', 'integer', null, 'xdruple', 'The entity revision id this data is attached to, or NULL if the entity type is not versioned');
select xt.add_column('xd_field_data_dc_price','language', 'text', 'not null default ''''', 'xdruple', 'The language for this data item.');
select xt.add_column('xd_field_data_dc_price','delta', 'integer', 'not null', 'xdruple', 'The sequence number for this data item, used for multi-value fields.');
select xt.add_column('xd_field_data_dc_price','curr_id', 'integer', 'not null', 'xdruple', 'The currency id for the price.');
select xt.add_column('xd_field_data_dc_price','commerce_price_data', 'text', 'not null', 'xdruple', 'A serialized array of additional price data.');

select xt.add_constraint('xd_field_data_dc_price','xd_field_data_dc_price_pkey', 'unique (entity_type, item_id, deleted, delta, language)', 'xdruple');
select xt.add_constraint('xd_field_data_dc_price','xd_field_data_dc_price_delta_check', 'check (delta >= 0)', 'xdruple');
select xt.add_constraint('xd_field_data_dc_price','xd_field_data_dc_price_item_id_check', 'check (item_id > 0)', 'xdruple');
select xt.add_constraint('xd_field_data_dc_price','xd_field_data_dc_price_revision_id_check', 'check (revision_id >= 0)', 'xdruple');

select xt.add_index('xd_field_data_dc_price', 'entity_type', 'xd_field_data_dc_price_entity_type_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_dc_price', 'bundle', 'xd_field_data_dc_price_bundle_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_dc_price', 'deleted', 'xd_field_data_dc_price_deleted_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_dc_price', 'item_id', 'xd_field_data_dc_price_item_id_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_dc_price', 'revision_id', 'xd_field_data_dc_price_revision_id_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_dc_price', 'language', 'xd_field_data_dc_price_language_idx', 'btree', 'xdruple');
select xt.add_index('xd_field_data_dc_price', 'curr_id', 'xd_field_data_dc_price_curr_id_idx', 'btree', 'xdruple');

comment on table xdruple.xd_field_data_dc_price is 'Table definition for Drupal Commerce integration of ''commerce_price'' field data.';
