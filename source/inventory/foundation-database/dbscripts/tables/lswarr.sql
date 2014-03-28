CREATE TABLE lswarr (
    lswarr_id serial NOT NULL,
    lswarr_crmacct_id integer NOT NULL,
    lswarr_regtype_id integer NOT NULL,
    lswarr_start date NOT NULL,
    lswarr_expiration date NOT NULL,
    lswarr_username text DEFAULT geteffectivextuser(),
    lswarr_lastupdated time without time zone DEFAULT ('now'::text)::time with time zone
);

COMMENT ON TABLE lswarr IS 'Lot/Serial Warranty Expiration Dates';

ALTER TABLE ONLY lswarr
    ADD CONSTRAINT lswarr_pkey PRIMARY KEY (lswarr_id);

ALTER TABLE ONLY lswarr
    ADD CONSTRAINT lswarr_lswarr_crmacct_id_fkey FOREIGN KEY (lswarr_crmacct_id) REFERENCES crmacct(crmacct_id);

ALTER TABLE ONLY lswarr
    ADD CONSTRAINT lswarr_lswarr_regtype_id_fkey FOREIGN KEY (lswarr_regtype_id) REFERENCES regtype(regtype_id);

REVOKE ALL ON TABLE lswarr FROM PUBLIC;
GRANT ALL ON TABLE lswarr TO xtrole;

REVOKE ALL ON SEQUENCE lswarr_lswarr_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE lswarr_lswarr_id_seq TO xtrole;
