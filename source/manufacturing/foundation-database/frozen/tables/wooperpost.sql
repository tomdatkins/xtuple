CREATE TABLE xtmfg.wooperpost (
    wooperpost_id integer NOT NULL,
    wooperpost_wo_id integer NOT NULL,
    wooperpost_seqnumber integer NOT NULL,
    wooperpost_username text DEFAULT getEffectiveXtUser() NOT NULL,
    wooperpost_timestamp timestamp without time zone DEFAULT ('now'::text)::timestamp(6) with time zone NOT NULL,
    wooperpost_qty numeric(18,6) NOT NULL,
    wooperpost_su_username text,
    wooperpost_sutime numeric(10,2),
    wooperpost_rn_username text,
    wooperpost_rntime numeric(10,2),
    wooperpost_wotc_id integer,
    wooperpost_sucost numeric(12,2) DEFAULT 0,
    wooperpost_rncost numeric(12,2) DEFAULT 0,
    wooperpost_wooper_id integer,
    wooperpost_su_emp_code text,
    wooperpost_rn_emp_code text
);

COMMENT ON TABLE xtmfg.wooperpost IS 'Posted W/O Operation information.';

CREATE SEQUENCE xtmfg.wooperpost_wooperpost_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.wooperpost_wooperpost_id_seq OWNED BY xtmfg.wooperpost.wooperpost_id;

ALTER TABLE xtmfg.wooperpost ALTER COLUMN wooperpost_id SET DEFAULT nextval('xtmfg.wooperpost_wooperpost_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.wooperpost
    ADD CONSTRAINT wooperpost_pkey PRIMARY KEY (wooperpost_id);

ALTER TABLE ONLY xtmfg.wooperpost
    ADD CONSTRAINT wooperpost_wooperpost_wo_id_fkey FOREIGN KEY (wooperpost_wo_id) REFERENCES public.wo(wo_id) ON DELETE CASCADE;

ALTER TABLE ONLY xtmfg.wooperpost
    ADD CONSTRAINT wooperpost_wooperpost_wooper_id_fkey FOREIGN KEY (wooperpost_wooper_id) REFERENCES xtmfg.wooper(wooper_id) ON DELETE CASCADE;

REVOKE ALL ON TABLE xtmfg.wooperpost FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.wooperpost TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.wooperpost_wooperpost_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.wooperpost_wooperpost_id_seq TO xtrole;
