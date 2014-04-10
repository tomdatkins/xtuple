CREATE TABLE xtmfg.boohead (
    boohead_id integer DEFAULT nextval(('xtmfg.boohead_boohead_id_seq'::text)::regclass) NOT NULL,
    boohead_item_id integer,
    boohead_serial_id integer,
    boohead_docnum text,
    boohead_revision text,
    boohead_revisiondate date,
    boohead_leadtime integer,
    boohead_final_location_id integer DEFAULT -1 NOT NULL,
    boohead_closewo boolean DEFAULT false NOT NULL,
    boohead_rev_id integer DEFAULT -1
);

COMMENT ON TABLE xtmfg.boohead IS 'Bill of Operations (BOO) header information';

CREATE SEQUENCE xtmfg.boohead_boohead_id_seq
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;

ALTER TABLE ONLY xtmfg.boohead
    ADD CONSTRAINT boohead_boohead_item_id_key UNIQUE (boohead_item_id, boohead_rev_id);

ALTER TABLE ONLY xtmfg.boohead
    ADD CONSTRAINT boohead_pkey PRIMARY KEY (boohead_id);

REVOKE ALL ON TABLE xtmfg.boohead FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.boohead TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.boohead_boohead_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.boohead_boohead_id_seq TO xtrole;
