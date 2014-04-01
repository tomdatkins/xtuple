CREATE TABLE xtmfg.brddist (
    brddist_id integer NOT NULL,
    brddist_wo_id integer,
    brddist_wo_qty numeric(20,8),
    brddist_itemsite_id integer,
    brddist_stdqtyper numeric(20,8),
    brddist_qty numeric(20,8),
    brddist_posted boolean
);

COMMENT ON TABLE xtmfg.brddist IS 'Temporary table for storing Breeder distribution records before Breeder Work Orders are closed ';

CREATE SEQUENCE xtmfg.brddist_brddist_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.brddist_brddist_id_seq OWNED BY xtmfg.brddist.brddist_id;

ALTER TABLE xtmfg.brddist ALTER COLUMN brddist_id SET DEFAULT nextval('xtmfg.brddist_brddist_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.brddist
    ADD CONSTRAINT brddist_pkey PRIMARY KEY (brddist_id);

REVOKE ALL ON TABLE xtmfg.brddist FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.brddist TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.brddist_brddist_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.brddist_brddist_id_seq TO xtrole;
