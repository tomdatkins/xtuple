CREATE TABLE xtmfg.whsecal (
    whsecal_id integer NOT NULL,
    whsecal_warehous_id integer,
    whsecal_effective date,
    whsecal_expires date,
    whsecal_descrip text,
    whsecal_active boolean DEFAULT false NOT NULL
);

COMMENT ON TABLE xtmfg.whsecal IS 'Warehouse calendar exceptions.';

CREATE SEQUENCE xtmfg.whsecal_whsecal_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.whsecal_whsecal_id_seq OWNED BY xtmfg.whsecal.whsecal_id;

ALTER TABLE xtmfg.whsecal ALTER COLUMN whsecal_id SET DEFAULT nextval('whsecal_whsecal_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.whsecal
    ADD CONSTRAINT whsecal_pkey PRIMARY KEY (whsecal_id);

REVOKE ALL ON TABLE xtmfg.whsecal FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.whsecal TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.whsecal_whsecal_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.whsecal_whsecal_id_seq TO xtrole;
