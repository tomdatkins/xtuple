CREATE TABLE xtmfg.woopervar (
    woopervar_id integer DEFAULT nextval(('xtmfg.woopervar_woopervar_id_seq'::text)::regclass) NOT NULL,
    woopervar_number integer,
    woopervar_subnumber integer,
    woopervar_posted date,
    woopervar_parent_itemsite_id integer,
    woopervar_booitem_id integer,
    woopervar_qtyord numeric(18,6),
    woopervar_qtyrcv numeric(18,6),
    woopervar_stdsutime numeric(10,2),
    woopervar_sutime numeric(10,2),
    woopervar_stdrntime numeric(10,2),
    woopervar_rntime numeric(10,2),
    woopervar_wrkcnt_id integer,
    woopervar_seqnumber integer
);

COMMENT ON TABLE xtmfg.woopervar IS 'Work Order Operations Variance information';

CREATE SEQUENCE xtmfg.woopervar_woopervar_id_seq
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;

ALTER TABLE ONLY xtmfg.woopervar
    ADD CONSTRAINT woopervar_pkey PRIMARY KEY (woopervar_id);

REVOKE ALL ON TABLE xtmfg.woopervar FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.woopervar TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.woopervar_woopervar_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.woopervar_woopervar_id_seq TO xtrole;
