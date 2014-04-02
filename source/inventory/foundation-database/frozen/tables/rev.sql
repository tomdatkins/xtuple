CREATE TABLE rev (
    rev_id serial NOT NULL,
    rev_number text NOT NULL CHECK(rev_number != ''),
    rev_status character(1) DEFAULT 'P'::bpchar NOT NULL,
    rev_target_type text NOT NULL,
    rev_target_id integer NOT NULL,
    rev_created date DEFAULT ('now'::text)::date NOT NULL,
    rev_date date NOT NULL,
    rev_effective date,
    rev_expires date,
    CONSTRAINT rev_check CHECK (((((rev_status = 'P'::bpchar) OR (rev_status = 'A'::bpchar)) OR (rev_status = 'I'::bpchar)) AND ((rev_target_type = 'BOM'::text) OR (rev_target_type = 'BOO'::text))))
);

COMMENT ON TABLE rev IS 'Used to track document revision information';

ALTER TABLE ONLY rev
    ADD CONSTRAINT rev_pkey PRIMARY KEY (rev_id);

ALTER TABLE ONLY rev
    ADD CONSTRAINT rev_rev_number_key UNIQUE (rev_number, rev_target_type, rev_target_id);

CREATE INDEX rev_target ON rev USING btree (rev_target_type, rev_target_id);

REVOKE ALL ON TABLE rev FROM PUBLIC;
GRANT ALL ON TABLE rev TO xtrole;

REVOKE ALL ON SEQUENCE rev_rev_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE rev_rev_id_seq TO xtrole;
