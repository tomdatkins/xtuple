CREATE TABLE xtmfg.bufrsts (
    bufrsts_id integer NOT NULL,
    bufrsts_itemsite_id integer,
    bufrsts_date date,
    bufrsts_target_type text,
    bufrsts_target_id integer,
    bufrsts_type text,
    bufrsts_size numeric(18,6) NOT NULL,
    bufrsts_status integer
);

COMMENT ON TABLE xtmfg.bufrsts IS 'Buffer Status';

CREATE SEQUENCE xtmfg.bufrsts_bufrsts_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.bufrsts_bufrsts_id_seq OWNED BY xtmfg.bufrsts.bufrsts_id;

ALTER TABLE xtmfg.bufrsts ALTER COLUMN bufrsts_id SET DEFAULT nextval('xtmfg.bufrsts_bufrsts_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.bufrsts
    ADD CONSTRAINT bufrsts_pkey PRIMARY KEY (bufrsts_id);

CREATE INDEX bufrsts_date ON xtmfg.bufrsts USING btree (bufrsts_date);
CREATE INDEX bufrsts_itemsite_id ON xtmfg.bufrsts USING btree (bufrsts_itemsite_id);
CREATE INDEX bufrsts_target ON xtmfg.bufrsts USING btree (bufrsts_target_type, bufrsts_target_id);

REVOKE ALL ON TABLE xtmfg.bufrsts FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.bufrsts TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.bufrsts_bufrsts_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.bufrsts_bufrsts_id_seq TO xtrole;
