CREATE TABLE xtmfg.lbrrate (
    lbrrate_id integer DEFAULT nextval(('xtmfg.lbrrate_lbrrate_id_seq'::text)::regclass) NOT NULL,
    lbrrate_code text UNIQUE NOT NULL CHECK(lbrrate_code != ''),
    lbrrate_descrip text,
    lbrrate_rate numeric(16,4)
);

COMMENT ON TABLE xtmfg.lbrrate IS 'Standard Labor Rate information';

CREATE SEQUENCE xtmfg.lbrrate_lbrrate_id_seq
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;

ALTER TABLE ONLY xtmfg.lbrrate
    ADD CONSTRAINT lbrrate_pkey PRIMARY KEY (lbrrate_id);

REVOKE ALL ON TABLE xtmfg.lbrrate FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.lbrrate TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.lbrrate_lbrrate_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.lbrrate_lbrrate_id_seq TO xtrole;
