CREATE TABLE xwd.imageonly
(imageonly_id SERIAL NOT NULL,
 imageonly_item_pik INTEGER,
 imageonly_mfr_ucc_num TEXT,
 imageonly_item_num TEXT,
 imageonly_i2_cat_num TEXT,
 imageonly_pfms_description TEXT,
 imageonly_pdf_url TEXT,
 imageonly_thumbnail_filename TEXT,
 imageonly_web_filename TEXT,
 imageonly_web_url TEXT,
 imageonly_thumbnail_url TEXT,
 imageonly_msds_sheet_url TEXT,
 imageonly_installation_instruction_url TEXT,
 CONSTRAINT imageonly_pkey PRIMARY KEY (imageonly_id)
);

ALTER TABLE xwd.imageonly OWNER TO "admin";
GRANT ALL ON TABLE xwd.imageonly TO "admin";
GRANT ALL ON TABLE xwd.imageonly TO xtrole;
GRANT ALL ON SEQUENCE xwd.imageonly_imageonly_id_seq TO xtrole;

COMMENT ON TABLE xwd.imageonly IS 'Trade Service Image Only';
