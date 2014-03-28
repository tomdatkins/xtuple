CREATE TABLE lsreg (
    lsreg_id serial NOT NULL,
    lsreg_number text NOT NULL CHECK (lsreg_number != ''),
    lsreg_crmacct_id integer NOT NULL,
    lsreg_regtype_id integer NOT NULL,
    lsreg_regdate date NOT NULL,
    lsreg_solddate date NOT NULL,
    lsreg_expiredate date NOT NULL,
    lsreg_ls_id integer NOT NULL,
    lsreg_cntct_id integer NOT NULL,
    lsreg_cohead_id integer,
    lsreg_shiphead_id integer,
    lsreg_notes text,
    lsreg_qty numeric(18,6) DEFAULT 0
);

COMMENT ON TABLE lsreg IS 'Lot/Serial Warranty Registration';

ALTER TABLE ONLY lsreg
    ADD CONSTRAINT lsreg_lsreg_number_key UNIQUE (lsreg_number);

ALTER TABLE ONLY lsreg
    ADD CONSTRAINT lsreg_pkey PRIMARY KEY (lsreg_id);

ALTER TABLE ONLY lsreg
    ADD CONSTRAINT lsreg_lsreg_cntct_id_fkey FOREIGN KEY (lsreg_cntct_id) REFERENCES cntct(cntct_id);

ALTER TABLE ONLY lsreg
    ADD CONSTRAINT lsreg_lsreg_cohead_id_fkey FOREIGN KEY (lsreg_cohead_id) REFERENCES cohead(cohead_id);

ALTER TABLE ONLY lsreg
    ADD CONSTRAINT lsreg_lsreg_crmacct_id_fkey FOREIGN KEY (lsreg_crmacct_id) REFERENCES crmacct(crmacct_id);

ALTER TABLE ONLY lsreg
    ADD CONSTRAINT lsreg_lsreg_ls_id_fkey FOREIGN KEY (lsreg_ls_id) REFERENCES ls(ls_id);

ALTER TABLE ONLY lsreg
    ADD CONSTRAINT lsreg_lsreg_regtype_id_fkey FOREIGN KEY (lsreg_regtype_id) REFERENCES regtype(regtype_id);

ALTER TABLE ONLY lsreg
    ADD CONSTRAINT lsreg_lsreg_shiphead_id_fkey FOREIGN KEY (lsreg_shiphead_id) REFERENCES shiphead(shiphead_id);

REVOKE ALL ON TABLE lsreg FROM PUBLIC;
GRANT ALL ON TABLE lsreg TO xtrole;

REVOKE ALL ON SEQUENCE lsreg_lsreg_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE lsreg_lsreg_id_seq TO xtrole;
