CREATE TABLE bomhist (
    bomhist_id serial NOT NULL,
    bomhist_seq_id integer,
    bomhist_rev_id integer,
    bomhist_seqnumber integer,
    bomhist_item_id integer,
    bomhist_item_type character(1),
    bomhist_qtyper numeric(20,8),
    bomhist_scrap numeric(20,10),
    bomhist_status character(1),
    bomhist_level integer,
    bomhist_parent_id integer,
    bomhist_effective date,
    bomhist_expires date,
    bomhist_stdunitcost numeric(16,6),
    bomhist_actunitcost numeric(16,6),
    bomhist_parent_seqnumber integer,
    bomhist_createwo boolean,
    bomhist_issuemethod character(1),
    bomhist_char_id integer,
    bomhist_value text,
    bomhist_notes text,
    bomhist_ref text,
    bomhist_qtyfxd NUMERIC(20,8) DEFAULT 0 NOT NULL,
    bomhist_qtyreq NUMERIC(20,8) DEFAULT 0 NOT NULL
);

COMMENT ON TABLE bomhist IS 'An archive table for storing a multi-level bom detail snapshot when a revsion is deactivated';
COMMENT ON COLUMN bomhist.bomhist_qtyfxd IS 'The fixed quantity required';
COMMENT ON COLUMN bomhist.bomhist_qtyreq IS 'The total quantity required';

ALTER TABLE ONLY bomhist
    ADD CONSTRAINT bomhist_pkey PRIMARY KEY (bomhist_id);

ALTER TABLE ONLY bomhist
    ADD CONSTRAINT bomhist_bomhist_char_id_fkey FOREIGN KEY (bomhist_char_id) REFERENCES "char"(char_id);

REVOKE ALL ON TABLE bomhist FROM PUBLIC;
GRANT ALL ON TABLE bomhist TO xtrole;

REVOKE ALL ON SEQUENCE bomhist_bomhist_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE bomhist_bomhist_id_seq TO xtrole;
