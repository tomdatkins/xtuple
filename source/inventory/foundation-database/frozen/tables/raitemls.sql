CREATE TABLE raitemls (
    raitemls_id serial NOT NULL,
    raitemls_raitem_id integer NOT NULL,
    raitemls_ls_id integer NOT NULL,
    raitemls_qtyauthorized numeric(18,6) NOT NULL,
    raitemls_qtyreceived numeric(18,6) NOT NULL
);

COMMENT ON TABLE raitemls IS 'Return Authorization Item Lot/Serial Detail';

ALTER TABLE ONLY raitemls
    ADD CONSTRAINT raitemls_pkey PRIMARY KEY (raitemls_id);

ALTER TABLE ONLY raitemls
    ADD CONSTRAINT raitemls_raitemls_raitem_id_key UNIQUE (raitemls_raitem_id, raitemls_ls_id);

ALTER TABLE ONLY raitemls
    ADD CONSTRAINT raitemls_raitemls_ls_id_fkey FOREIGN KEY (raitemls_ls_id) REFERENCES ls(ls_id);

ALTER TABLE ONLY raitemls
    ADD CONSTRAINT raitemls_raitemls_raitem_id_fkey FOREIGN KEY (raitemls_raitem_id) REFERENCES raitem(raitem_id) ON DELETE CASCADE;

REVOKE ALL ON TABLE raitemls FROM PUBLIC;
GRANT ALL ON TABLE raitemls TO xtrole;

REVOKE ALL ON SEQUENCE raitemls_raitemls_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE raitemls_raitemls_id_seq TO xtrole;
