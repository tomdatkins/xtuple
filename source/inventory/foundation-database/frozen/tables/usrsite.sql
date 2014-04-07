CREATE TABLE usrsite (
    usrsite_id serial NOT NULL,
    usrsite_warehous_id integer NOT NULL,
    usrsite_username text NOT NULL
);

COMMENT ON TABLE usrsite IS 'This is a specific site for a specific user.';

ALTER TABLE ONLY usrsite
    ADD CONSTRAINT usrsite_pkey PRIMARY KEY (usrsite_id);

ALTER TABLE ONLY usrsite
    ADD CONSTRAINT usrsite_usrsite_warehous_id_fkey FOREIGN KEY (usrsite_warehous_id) REFERENCES whsinfo(warehous_id) ON DELETE CASCADE;

REVOKE ALL ON TABLE usrsite FROM PUBLIC;
GRANT ALL ON TABLE usrsite TO xtrole;

REVOKE ALL ON SEQUENCE usrsite_usrsite_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE usrsite_usrsite_id_seq TO xtrole;
