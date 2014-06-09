drop index if exists xwd.catalog_upper_mfr_cat_num_pattern_idx;
drop index if exists xwd.catalog_upper_mfr_cat_num_idx;
drop index if exists xwd.catalog_upper_mfr_fullname_idx;
drop index if exists xwd.catalog_upper_product_name_idx;

create index catalog_upper_mfr_cat_num_idx on xwd.catalog using btree (upper(catalog_mfr_cat_num) varchar_pattern_ops);
create index catalog_upper_mfr_fullname_idx on xwd.catalog using btree (upper(catalog_mfr_fullname) varchar_pattern_ops);
create index catalog_upper_product_name_idx on xwd.catalog using btree (upper(catalog_product_name) varchar_pattern_ops);
