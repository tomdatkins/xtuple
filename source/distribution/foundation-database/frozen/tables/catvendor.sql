CREATE TABLE xwd.catvendor
( catvendor_id SERIAL NOT NULL,
  catvendor_vend_id INTEGER REFERENCES vendinfo(vend_id),
  catvendor_costcolumn INTEGER NOT NULL,
  catvendor_parent_id INTEGER,
  catvendor_freight_allowed_amount NUMERIC(16,6),
  catvendor_freight_allowed_weight NUMERIC(16,6),
  CONSTRAINT catvendor_pkey PRIMARY KEY (catvendor_id )
);

CREATE INDEX catvendor_vendor_idx ON xwd.catvendor USING btree (catvendor_vend_id);

ALTER TABLE xwd.catvendor OWNER TO admin;
GRANT ALL ON TABLE xwd.catvendor TO admin;
GRANT ALL ON TABLE xwd.catvendor TO xtrole; 
GRANT ALL ON SEQUENCE xwd.catvendor_catvendor_id_seq TO xtrole;

COMMENT ON TABLE xwd.catvendor IS 'External Catalog Vendor table extension';
