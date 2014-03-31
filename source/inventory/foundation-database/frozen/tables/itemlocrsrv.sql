CREATE TABLE itemlocrsrv (
    itemlocrsrv_id serial NOT NULL,
    itemlocrsrv_source text NOT NULL,
    itemlocrsrv_source_id integer NOT NULL,
    itemlocrsrv_itemloc_id integer NOT NULL,
    itemlocrsrv_qty numeric(18,6) NOT NULL
);

COMMENT ON TABLE itemlocrsrv IS 'This table is reservations on item location.';

ALTER TABLE ONLY itemlocrsrv
    ADD CONSTRAINT itemlocrsrv_pkey PRIMARY KEY (itemlocrsrv_id);

ALTER TABLE ONLY itemlocrsrv
    ADD CONSTRAINT itemlocrsrv_itemlocrsrv_itemloc_id_fkey FOREIGN KEY (itemlocrsrv_itemloc_id) REFERENCES itemloc(itemloc_id);

REVOKE ALL ON TABLE itemlocrsrv FROM PUBLIC;
GRANT ALL ON TABLE itemlocrsrv TO xtrole;

REVOKE ALL ON SEQUENCE itemlocrsrv_itemlocrsrv_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE itemlocrsrv_itemlocrsrv_id_seq TO xtrole;
