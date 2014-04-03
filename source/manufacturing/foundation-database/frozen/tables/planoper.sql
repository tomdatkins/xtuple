CREATE TABLE xtmfg.planoper (
    planoper_id integer DEFAULT nextval(('xtmfg.planoper_planoper_id_seq'::text)::regclass) NOT NULL,
    planoper_planord_id integer,
    planoper_wrkcnt_id integer,
    planoper_sutime numeric(10,2),
    planoper_rntime numeric(10,2),
    planoper_seq_id INTEGER
);


COMMENT ON TABLE xtmfg.planoper IS 'Temporary table for storing information about Planned Operations from exploded Planned Work Orders';
COMMENT ON COLUMN xtmfg.planoper.planoper_seq_id IS 'The Operation Sequence Id';

CREATE SEQUENCE xtmfg.planoper_planoper_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;

ALTER TABLE ONLY xtmfg.planoper
    ADD CONSTRAINT planoper_pkey PRIMARY KEY (planoper_id);

CREATE INDEX planoper_planord_idx ON xtmfg.planoper USING btree (planoper_planord_id);

REVOKE ALL ON TABLE xtmfg.planoper FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.planoper TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.planoper_planoper_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.planoper_planoper_id_seq TO xtrole;
