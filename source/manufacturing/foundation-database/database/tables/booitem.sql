CREATE TABLE xtmfg.booitem (
    booitem_id integer DEFAULT nextval(('xtmfg.booitem_booitem_id_seq'::text)::regclass) NOT NULL,
    booitem_item_id integer,
    booitem_seqnumber integer,
    booitem_wrkcnt_id integer NOT NULL,
    booitem_stdopn_id integer NOT NULL,
    booitem_descrip1 text,
    booitem_descrip2 text,
    booitem_toolref text,
    booitem_sutime numeric(10,4) NOT NULL,
    booitem_sucosttype character(1) NOT NULL,
    booitem_surpt boolean NOT NULL,
    booitem_rntime numeric(10,4) NOT NULL,
    booitem_rncosttype character(1) NOT NULL,
    booitem_rnrpt boolean NOT NULL,
    booitem_rnqtyper numeric(20,8) NOT NULL,
    booitem_produom text,
    booitem_invproduomratio numeric(20,10) NOT NULL,
    booitem_issuecomp boolean NOT NULL,
    booitem_rcvinv boolean NOT NULL,
    booitem_instruc text,
    booitem_effective date NOT NULL,
    booitem_expires date NOT NULL,
    booitem_configtype character(1) NOT NULL,
    booitem_configid integer NOT NULL,
    booitem_pullthrough boolean NOT NULL,
    booitem_execday integer DEFAULT 1 NOT NULL,
    booitem_overlap boolean NOT NULL,
    booitem_configflag boolean NOT NULL,
    booitem_wip_location_id integer DEFAULT -1 NOT NULL,
    booitem_rev_id integer DEFAULT -1 NOT NULL,
    booitem_seq_id integer NOT NULL,
    CONSTRAINT booitem_booitem_rncosttype_check CHECK ((((booitem_rncosttype = 'D'::bpchar) OR (booitem_rncosttype = 'O'::bpchar)) OR (booitem_rncosttype = 'N'::bpchar))),
    CONSTRAINT booitem_booitem_sucosttype_check CHECK ((((booitem_sucosttype = 'D'::bpchar) OR (booitem_sucosttype = 'O'::bpchar)) OR (booitem_sucosttype = 'N'::bpchar)))
);

COMMENT ON TABLE xtmfg.booitem IS 'Bill of Operations (BOO) component Items information';

CREATE SEQUENCE xtmfg.booitem_booitem_id_seq
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;

CREATE SEQUENCE xtmfg.booitem_booitem_seq_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.booitem_booitem_seq_id_seq OWNED BY xtmfg.booitem.booitem_seq_id;

ALTER TABLE xtmfg.booitem ALTER COLUMN booitem_seq_id SET DEFAULT nextval('booitem_booitem_seq_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.booitem
    ADD CONSTRAINT booitem_pkey PRIMARY KEY (booitem_id);

ALTER TABLE ONLY xtmfg.booitem
    ADD CONSTRAINT booitem_booitem_item_id_fkey FOREIGN KEY (booitem_item_id) REFERENCES public.item(item_id) ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY xtmfg.booitem
    ADD CONSTRAINT booitem_booitem_wrkcnt_id_fkey FOREIGN KEY (booitem_wrkcnt_id) REFERENCES xtmfg.wrkcnt(wrkcnt_id);

CREATE INDEX booitem_booitem_item_id_idx ON xtmfg.booitem USING btree (booitem_item_id);
CREATE INDEX booitem_effective_key ON xtmfg.booitem USING btree (booitem_effective);
CREATE INDEX booitem_expires_key   ON xtmfg.booitem USING btree (booitem_expires);

REVOKE ALL ON TABLE xtmfg.booitem FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.booitem TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.booitem_booitem_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.booitem_booitem_id_seq TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.booitem_booitem_seq_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.booitem_booitem_seq_id_seq TO xtrole;
