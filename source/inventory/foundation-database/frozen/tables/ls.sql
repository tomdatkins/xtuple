CREATE TABLE ls (
    ls_id serial NOT NULL,
    ls_item_id integer,
    ls_number text NOT NULL,
    ls_notes text
);

COMMENT ON TABLE ls IS 'Lot and Serial numbers table.';

ALTER TABLE ONLY ls
    ADD CONSTRAINT ls_ls_item_id_key UNIQUE (ls_item_id, ls_number);

ALTER TABLE ONLY ls
    ADD CONSTRAINT ls_pkey PRIMARY KEY (ls_id);

ALTER TABLE ONLY ls
    ADD CONSTRAINT ls_ls_item_id_fkey FOREIGN KEY (ls_item_id) REFERENCES item(item_id);

REVOKE ALL ON TABLE ls FROM PUBLIC;
GRANT ALL ON TABLE ls TO xtrole;

REVOKE ALL ON SEQUENCE ls_ls_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE ls_ls_id_seq TO xtrole;
