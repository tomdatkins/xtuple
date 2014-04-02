CREATE TABLE xtmfg.bbomitem (
    bbomitem_id integer DEFAULT nextval(('"xtmfg.bbomitem_bbomitem_id_seq"'::text)::regclass) NOT NULL,
    bbomitem_parent_item_id integer,
    bbomitem_item_id integer,
    bbomitem_seqnumber integer,
    bbomitem_qtyper numeric(20,8),
    bbomitem_effective date,
    bbomitem_expires date,
    bbomitem_comments text,
    bbomitem_costabsorb numeric(16,6),
    bbomitem_uniquemfg boolean
);

COMMENT ON TABLE xtmfg.bbomitem IS 'Breeder Bill of Materials (BBOM) component Items information';

CREATE SEQUENCE xtmfg.bbomitem_bbomitem_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;

ALTER TABLE ONLY xtmfg.bbomitem
    ADD CONSTRAINT bbomitem_pkey PRIMARY KEY (bbomitem_id);

REVOKE ALL ON TABLE xtmfg.bbomitem FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.bbomitem TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.bbomitem_bbomitem_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.bbomitem_bbomitem_id_seq TO xtrole;
