CREATE TABLE xwd.comm
(comm_id SERIAL NOT NULL,
 comm_pik INTEGER,
 comm_action TEXT,
 comm_parent_pik INTEGER,
 comm_comm_code TEXT,
 comm_comm_desc TEXT,
 comm_type TEXT,
 comm_lgcy_comm_flg TEXT,
 comm_comm_code_enhanced TEXT,
 comm_comm_pik_enhanced INTEGER,
 comm_indent_level INTEGER,
 CONSTRAINT comm_pkey PRIMARY KEY (comm_id)
);

ALTER TABLE xwd.comm OWNER TO "admin";
GRANT ALL ON TABLE xwd.comm TO "admin";
GRANT ALL ON TABLE xwd.comm TO xtrole;
GRANT ALL ON SEQUENCE xwd.comm_comm_id_seq TO xtrole;

COMMENT ON TABLE xwd.comm IS 'Trade Service Commodity Codes';
