CREATE TABLE xwd.catimage
(catimage_id SERIAL NOT NULL,
 catimage_provider TEXT,
 catimage_item_pik INTEGER,
 catimage_mfr_ucc_num TEXT,
 catimage_item_num TEXT,
 catimage_i2_cat_num TEXT,
 catimage_pfms_description TEXT,
 catimage_pdf_url TEXT,
 catimage_thumbnail_filename TEXT,
 catimage_web_filename TEXT,
 catimage_web_url TEXT,
 catimage_thumbnail_url TEXT,
 catimage_msds_sheet_url TEXT,
 catimage_installation_instruction_url TEXT,
 CONSTRAINT catimage_pkey PRIMARY KEY (catimage_id)
);

CREATE INDEX catimage_item_pik_idx ON xwd.catimage USING btree (catimage_item_pik);

ALTER TABLE xwd.catimage OWNER TO "admin";
GRANT ALL ON TABLE xwd.catimage TO "admin";
GRANT ALL ON TABLE xwd.catimage TO xtrole;
GRANT ALL ON SEQUENCE xwd.catimage_catimage_id_seq TO xtrole;

COMMENT ON TABLE xwd.catimage IS 'External Vendor Catalog Images';
