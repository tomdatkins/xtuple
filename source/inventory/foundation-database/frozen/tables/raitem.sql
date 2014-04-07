CREATE TABLE raitem (
    raitem_id serial NOT NULL,
    raitem_rahead_id integer NOT NULL,
    raitem_linenumber integer NOT NULL,
    raitem_itemsite_id integer NOT NULL,
    raitem_rsncode_id integer,
    raitem_disposition character(1) NOT NULL,
    raitem_qtyauthorized numeric(18,6) NOT NULL,
    raitem_warranty boolean DEFAULT false,
    raitem_qty_uom_id integer NOT NULL,
    raitem_qty_invuomratio numeric(20,10) NOT NULL,
    raitem_qtyreceived numeric(18,6) DEFAULT 0,
    raitem_unitprice numeric(16,4) NOT NULL,
    raitem_price_uom_id integer NOT NULL,
    raitem_price_invuomratio numeric(20,10) NOT NULL,
    raitem_amtcredited numeric(16,4) DEFAULT 0,
    raitem_notes text,
    raitem_status character(1) DEFAULT 'O'::bpchar,
    raitem_cos_accnt_id integer,
    raitem_orig_coitem_id integer,
    raitem_new_coitem_id integer,
    raitem_scheddate date,
    raitem_qtycredited numeric(16,4) DEFAULT 0,
    raitem_taxtype_id integer,
    raitem_coitem_itemsite_id integer,
    raitem_subnumber integer DEFAULT 0 NOT NULL,
    raitem_saleprice numeric(16,4) DEFAULT 0,
    raitem_unitcost numeric(18,6),
    raitem_custpn   text,
    CONSTRAINT raitem_raitem_disposition_check CHECK ((((((raitem_disposition = 'C'::bpchar) OR (raitem_disposition = 'R'::bpchar)) OR (raitem_disposition = 'P'::bpchar)) OR (raitem_disposition = 'V'::bpchar)) OR (raitem_disposition = 'S'::bpchar))),
    CONSTRAINT raitem_raitem_status_check CHECK (((raitem_status = 'O'::bpchar) OR (raitem_status = 'C'::bpchar)))
);

COMMENT ON TABLE raitem IS 'Return Authorization Line Item information';

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_pkey PRIMARY KEY (raitem_id);

CREATE UNIQUE INDEX raitem_raitem_rahead_id_key ON raitem USING btree (raitem_rahead_id, raitem_linenumber, raitem_subnumber);

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_raitem_coitem_itemsite_id_fkey FOREIGN KEY (raitem_coitem_itemsite_id) REFERENCES itemsite(itemsite_id);

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_raitem_cos_accnt_id_fkey FOREIGN KEY (raitem_cos_accnt_id) REFERENCES accnt(accnt_id);

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_raitem_itemsite_id_fkey FOREIGN KEY (raitem_itemsite_id) REFERENCES itemsite(itemsite_id);

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_raitem_new_coitem_id_fkey FOREIGN KEY (raitem_new_coitem_id) REFERENCES coitem(coitem_id);

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_raitem_orig_coitem_id_fkey FOREIGN KEY (raitem_orig_coitem_id) REFERENCES coitem(coitem_id);

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_raitem_price_uom_id_fkey FOREIGN KEY (raitem_price_uom_id) REFERENCES uom(uom_id);

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_raitem_qty_uom_id_fkey FOREIGN KEY (raitem_qty_uom_id) REFERENCES uom(uom_id);

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_raitem_rahead_id_fkey FOREIGN KEY (raitem_rahead_id) REFERENCES rahead(rahead_id) ON DELETE CASCADE;

ALTER TABLE ONLY raitem
    ADD CONSTRAINT raitem_raitem_rsncode_id_fkey FOREIGN KEY (raitem_rsncode_id) REFERENCES rsncode(rsncode_id);

REVOKE ALL ON TABLE raitem FROM PUBLIC;
GRANT ALL ON TABLE raitem TO xtrole;

REVOKE ALL ON SEQUENCE raitem_raitem_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE raitem_raitem_id_seq TO xtrole;
