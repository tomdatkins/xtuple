CREATE TABLE xtmfg.pschitem (
    pschitem_id integer NOT NULL,
    pschitem_pschhead_id integer NOT NULL,
    pschitem_linenumber integer NOT NULL,
    pschitem_itemsite_id integer NOT NULL,
    pschitem_scheddate date NOT NULL,
    pschitem_qty numeric(16,4) NOT NULL,
    pschitem_status character(1) DEFAULT 'O'::bpchar NOT NULL,
    pschitem_created timestamp without time zone DEFAULT now() NOT NULL,
    pschitem_creator text DEFAULT getEffectiveXtUser() NOT NULL
);

COMMENT ON TABLE xtmfg.pschitem IS 'Planned Schedule (MPS) Item.';

CREATE SEQUENCE xtmfg.pschitem_pschitem_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.pschitem_pschitem_id_seq OWNED BY xtmfg.pschitem.pschitem_id;

ALTER TABLE xtmfg.pschitem ALTER COLUMN pschitem_id SET DEFAULT nextval('xtmfg.pschitem_pschitem_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.pschitem
    ADD CONSTRAINT pschitem_pkey PRIMARY KEY (pschitem_id);

ALTER TABLE ONLY xtmfg.pschitem
    ADD CONSTRAINT pschitem_pschitem_itemsite_id_fkey FOREIGN KEY (pschitem_itemsite_id) REFERENCES public.itemsite(itemsite_id);

ALTER TABLE ONLY xtmfg.pschitem
    ADD CONSTRAINT pschitem_pschitem_pschhead_id_fkey FOREIGN KEY (pschitem_pschhead_id) REFERENCES xtmfg.pschhead(pschhead_id);

REVOKE ALL ON TABLE xtmfg.pschitem FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.pschitem TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.pschitem_pschitem_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.pschitem_pschitem_id_seq TO xtrole;
