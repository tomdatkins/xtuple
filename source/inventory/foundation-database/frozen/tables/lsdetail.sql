CREATE TABLE lsdetail (
    lsdetail_id serial NOT NULL,
    lsdetail_itemsite_id integer,
    lsdetail_created timestamp without time zone,
    lsdetail_source_type character(2),
    lsdetail_source_id integer,
    lsdetail_source_number text,
    lsdetail_ls_id integer,
    lsdetail_qtytoassign numeric(18,6) DEFAULT 0
);

COMMENT ON TABLE lsdetail IS 'Lot/Serial history';

ALTER TABLE ONLY lsdetail
    ADD CONSTRAINT lsdetail_pkey PRIMARY KEY (lsdetail_id);

ALTER TABLE ONLY lsdetail
    ADD CONSTRAINT lsdetail_lsdetail_ls_id_fkey FOREIGN KEY (lsdetail_ls_id) REFERENCES ls(ls_id);

REVOKE ALL ON TABLE lsdetail FROM PUBLIC;
GRANT ALL ON TABLE lsdetail TO xtrole;

REVOKE ALL ON SEQUENCE lsdetail_lsdetail_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE lsdetail_lsdetail_id_seq TO xtrole;
