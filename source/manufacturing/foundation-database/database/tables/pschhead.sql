CREATE TABLE xtmfg.pschhead (
    pschhead_id integer NOT NULL,
    pschhead_number text NOT NULL CHECK(pschhead_number != ''),
    pschhead_descrip text,
    pschhead_warehous_id integer NOT NULL,
    pschhead_start_date date NOT NULL,
    pschhead_end_date date NOT NULL,
    pschhead_status character(1) DEFAULT 'U'::bpchar NOT NULL,
    pschhead_created timestamp without time zone DEFAULT now() NOT NULL,
    pschhead_creator text DEFAULT getEffectiveXtUser() NOT NULL,
    pschhead_type character(1) DEFAULT 'N'::bpchar NOT NULL
);

COMMENT ON TABLE xtmfg.pschhead IS 'Planned Schedule (MPS) Header.';

CREATE SEQUENCE xtmfg.pschhead_pschhead_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.pschhead_pschhead_id_seq OWNED BY xtmfg.pschhead.pschhead_id;

ALTER TABLE xtmfg.pschhead ALTER COLUMN pschhead_id SET DEFAULT nextval('pschhead_pschhead_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.pschhead
    ADD CONSTRAINT pschhead_pkey PRIMARY KEY (pschhead_id);
ALTER TABLE ONLY xtmfg.pschhead
    ADD CONSTRAINT pschhead_pschhead_number_key UNIQUE (pschhead_number);

ALTER TABLE ONLY xtmfg.pschhead
    ADD CONSTRAINT pschhead_pschhead_warehous_id_fkey FOREIGN KEY (pschhead_warehous_id) REFERENCES public.whsinfo(warehous_id);

REVOKE ALL ON TABLE xtmfg.pschhead FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.pschhead TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.pschhead_pschhead_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.pschhead_pschhead_id_seq TO xtrole;
