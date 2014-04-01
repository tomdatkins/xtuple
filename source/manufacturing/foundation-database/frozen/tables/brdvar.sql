CREATE TABLE xtmfg.brdvar (
    brdvar_id integer NOT NULL,
    brdvar_postdate date,
    brdvar_itemsite_id integer,
    brdvar_wonumber text,
    brdvar_wo_qty numeric(20,8),
    brdvar_stdqtyper numeric(20,8),
    brdvar_actqtyper numeric(20,8),
    brdvar_parent_itemsite_id integer
);

COMMENT ON TABLE xtmfg.brdvar IS 'Breeder distribution variance information';

CREATE SEQUENCE xtmfg.brdvar_brdvar_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.brdvar_brdvar_id_seq OWNED BY xtmfg.brdvar.brdvar_id;

ALTER TABLE xtmfg.brdvar ALTER COLUMN brdvar_id SET DEFAULT nextval('xtmfg.brdvar_brdvar_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.brdvar
    ADD CONSTRAINT brdvar_pkey PRIMARY KEY (brdvar_id);

REVOKE ALL ON TABLE xtmfg.brdvar FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.brdvar TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.brdvar_brdvar_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.brdvar_brdvar_id_seq TO xtrole;
