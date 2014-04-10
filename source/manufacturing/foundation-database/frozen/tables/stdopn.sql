CREATE TABLE xtmfg.stdopn (
    stdopn_id integer DEFAULT nextval(('xtmfg.stdopn_stdopn_id_seq'::text)::regclass) NOT NULL,
    stdopn_number text UNIQUE NOT NULL CHECK(stdopn_number != ''),
    stdopn_descrip1 text,
    stdopn_descrip2 text,
    stdopn_wrkcnt_id integer,
    stdopn_toolref text,
    stdopn_stdtimes boolean,
    stdopn_reportsetup boolean,
    stdopn_reportrun boolean,
    stdopn_rnqtyper numeric(20,8),
    stdopn_produom text,
    stdopn_sucosttype character(1),
    stdopn_rncosttype character(1),
    stdopn_invproduomratio numeric(20,10),
    stdopn_instructions text,
    stdopn_sutime numeric(10,2),
    stdopn_rntime numeric(10,2)
);

COMMENT ON TABLE xtmfg.stdopn IS 'Standard Operation information';

CREATE SEQUENCE xtmfg.stdopn_stdopn_id_seq
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;

ALTER TABLE ONLY xtmfg.stdopn
    ADD CONSTRAINT stdopn_pkey PRIMARY KEY (stdopn_id);

REVOKE ALL ON TABLE xtmfg.stdopn FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.stdopn TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.stdopn_stdopn_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.stdopn_stdopn_id_seq TO xtrole;
