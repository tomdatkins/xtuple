CREATE TABLE rahist (
    rahist_id serial NOT NULL,
    rahist_itemsite_id integer,
    rahist_date date DEFAULT ('now'::text)::date,
    rahist_descrip text,
    rahist_qty numeric(18,6),
    rahist_uom_id integer,
    rahist_curr_id integer DEFAULT basecurrid(),
    rahist_source text NOT NULL,
    rahist_source_id integer NOT NULL,
    rahist_amount numeric(16,4),
    rahist_rahead_id integer NOT NULL
);

COMMENT ON TABLE rahist IS 'Return Authorization historical transaction information';

ALTER TABLE ONLY rahist
    ADD CONSTRAINT rahist_pkey PRIMARY KEY (rahist_id);

ALTER TABLE ONLY rahist
    ADD CONSTRAINT rahist_rahist_curr_id_fkey FOREIGN KEY (rahist_curr_id) REFERENCES curr_symbol(curr_id);

ALTER TABLE ONLY rahist
    ADD CONSTRAINT rahist_rahist_uom_id_fkey FOREIGN KEY (rahist_uom_id) REFERENCES uom(uom_id);

REVOKE ALL ON TABLE rahist FROM PUBLIC;
GRANT ALL ON TABLE rahist TO xtrole;

REVOKE ALL ON SEQUENCE rahist_rahist_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE rahist_rahist_id_seq TO xtrole;
