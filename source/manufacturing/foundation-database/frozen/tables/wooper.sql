CREATE TABLE xtmfg.wooper (
    wooper_id integer DEFAULT nextval(('xtmfg.wooper_wooper_id_seq'::text)::regclass) NOT NULL,
    wooper_wo_id integer,
    wooper_seqnumber integer,
    wooper_wrkcnt_id integer,
    wooper_stdopn_id integer,
    wooper_descrip1 text,
    wooper_descrip2 text,
    wooper_toolref text,
    wooper_sutime numeric(10,2),
    wooper_sucosttype character(1),
    wooper_surpt boolean,
    wooper_rntime numeric(10,2),
    wooper_rncosttype character(1),
    wooper_rnrpt boolean,
    wooper_produom text,
    wooper_invproduomratio numeric(20,10),
    wooper_issue boolean,
    wooper_receive boolean,
    wooper_suconsumed numeric(10,2),
    wooper_sucomplete boolean,
    wooper_rnconsumed numeric(10,2),
    wooper_rncomplete boolean,
    wooper_instruc text,
    wooper_rcvinv boolean,
    wooper_booitem_id integer,
    wooper_qtyrcv numeric(18,6),
    wooper_rnqtyper numeric(20,8),
    wooper_issuecomp boolean,
    wooper_scheduled timestamp with time zone,
    wooper_wip_location_id integer DEFAULT -1 NOT NULL,
    wooper_price numeric(16,6) NOT NULL DEFAULT 0
);

COMMENT ON TABLE xtmfg.wooper IS 'Work Order Operations information';

ALTER TABLE ONLY xtmfg.wooper
    ADD CONSTRAINT wooper_pkey PRIMARY KEY (wooper_id);

CREATE INDEX wooper_scheduled_key ON xtmfg.wooper USING btree (wooper_scheduled);
CREATE INDEX wooper_wrkcnt_id_key ON xtmfg.wooper USING btree (wooper_wrkcnt_id);

REVOKE ALL ON TABLE xtmfg.wooper FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.wooper TO xtrole;

CREATE SEQUENCE xtmfg.wooper_wooper_id_seq
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;

REVOKE ALL ON SEQUENCE xtmfg.wooper_wooper_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.wooper_wooper_id_seq TO xtrole;
