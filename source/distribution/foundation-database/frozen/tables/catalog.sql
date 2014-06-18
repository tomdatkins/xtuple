CREATE TABLE xwd.catalog
(catalog_id SERIAL NOT NULL,
 catalog_provider TEXT,
 catalog_item_pik INTEGER,
 catalog_mfr_ucc_num TEXT,
 catalog_mfr_shortname TEXT,
 catalog_mfr_fullname TEXT,
 catalog_ps_min_order_type TEXT,
 catalog_ps_min_order NUMERIC,
 catalog_i2_cat_num TEXT,
 catalog_mfr_cat_num TEXT,
 catalog_product_name TEXT,
 catalog_mfr_description TEXT,
 catalog_comm_code TEXT,
 catalog_comm_pik INTEGER,
 catalog_ps_lgcy_uom TEXT,
 catalog_ps_uom TEXT,
 catalog_list NUMERIC,
 catalog_col3 NUMERIC,
 catalog_cost NUMERIC,
 catalog_custom_price1 NUMERIC,
 catalog_pkg_weight NUMERIC,
 catalog_pkg_qty NUMERIC,
 catalog_pkg_uom TEXT,
 catalog_2k_desc TEXT,
 catalog_indv_weight NUMERIC,
 catalog_pkg_freight_class TEXT,
 catalog_upc TEXT,
 catalog_product_category TEXT,
 catalog_price_src_name TEXT,
 catalog_ps_dscnt_schd_code TEXT,
 catalog_pdf_url TEXT,
 catalog_web_url TEXT,
 CONSTRAINT catalog_pkey PRIMARY KEY (catalog_id)
);

create index catalog_upper_mfr_cat_num_idx on xwd.catalog using btree (upper(catalog_mfr_cat_num) varchar_pattern_ops);
create index catalog_upper_i2_cat_num_idx on xwd.catalog using btree (upper(catalog_i2_cat_num) varchar_pattern_ops);
create index catalog_upper_mfr_fullname_idx on xwd.catalog using btree (upper(catalog_mfr_fullname) varchar_pattern_ops);
create index catalog_upper_product_name_idx on xwd.catalog using btree (upper(catalog_product_name) varchar_pattern_ops);
CREATE INDEX catalog_upc_idx ON xwd.catalog USING btree (catalog_upc);

ALTER TABLE xwd.catalog OWNER TO "admin";
GRANT ALL ON TABLE xwd.catalog TO "admin";
GRANT ALL ON TABLE xwd.catalog TO xtrole;
GRANT ALL ON SEQUENCE xwd.catalog_catalog_id_seq TO xtrole;

COMMENT ON TABLE xwd.catalog IS 'External Vendor Catalog';
