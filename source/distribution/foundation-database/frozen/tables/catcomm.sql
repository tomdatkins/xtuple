CREATE TABLE xwd.catcomm
(catcomm_id SERIAL NOT NULL,
 catcomm_provider TEXT,
 catcomm_pik INTEGER,
 catcomm_parent_pik INTEGER,
 catcomm_comm_code TEXT,
 catcomm_comm_desc TEXT,
 catcomm_seq INTEGER,
 catcomm_level INTEGER,
 CONSTRAINT catcomm_pkey PRIMARY KEY (catcomm_id)
);

CREATE INDEX catcomm_pik_idx ON xwd.catcomm USING btree (catcomm_pik);

ALTER TABLE xwd.catcomm OWNER TO "admin";
GRANT ALL ON TABLE xwd.catcomm TO "admin";
GRANT ALL ON TABLE xwd.catcomm TO xtrole;
GRANT ALL ON SEQUENCE xwd.catcomm_catcomm_id_seq TO xtrole;

COMMENT ON TABLE xwd.catcomm IS 'External Vendor Catalog Indented Commodity Codes';
