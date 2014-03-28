CREATE TABLE xtmfg.whsewk (
    whsewk_id integer NOT NULL,
    whsewk_warehous_id integer,
    whsewk_weekday integer
);

COMMENT ON TABLE xtmfg.whsewk IS 'Warehouse work week calendar';

CREATE SEQUENCE xtmfg.whsewk_whsewk_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.whsewk_whsewk_id_seq OWNED BY xtmfg.whsewk.whsewk_id;

ALTER TABLE xtmfg.whsewk ALTER COLUMN whsewk_id SET DEFAULT nextval('whsewk_whsewk_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.whsewk
    ADD CONSTRAINT whsewk_pkey PRIMARY KEY (whsewk_id);

REVOKE ALL ON TABLE xtmfg.whsewk FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.whsewk TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.whsewk_whsewk_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.whsewk_whsewk_id_seq TO xtrole;
