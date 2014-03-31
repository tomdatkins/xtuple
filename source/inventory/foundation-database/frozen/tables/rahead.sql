CREATE TABLE rahead (
    rahead_id serial NOT NULL,
    rahead_number       TEXT NOT NULL UNIQUE CHECK(rahead_number <> ''),
    rahead_authdate date DEFAULT ('now'::text)::date,
    rahead_expiredate date,
    rahead_salesrep_id integer,
    rahead_commission numeric(8,4),
    rahead_rsncode_id integer,
    rahead_disposition character(1) DEFAULT 'R'::bpchar,
    rahead_timing character(1),
    rahead_creditmethod character(1) DEFAULT 'N'::bpchar,
    rahead_incdt_id integer,
    rahead_prj_id integer,
    rahead_cust_id integer,
    rahead_billtoname text,
    rahead_billtoaddress1 text,
    rahead_billtoaddress2 text,
    rahead_billtoaddress3 text,
    rahead_billtocity text,
    rahead_billtostate text,
    rahead_billtozip text,
    rahead_billtocountry text,
    rahead_shipto_id integer,
    rahead_shipto_name text,
    rahead_shipto_address1 text,
    rahead_shipto_address2 text,
    rahead_shipto_address3 text,
    rahead_shipto_city text,
    rahead_shipto_state text,
    rahead_shipto_zipcode text,
    rahead_shipto_country text,
    rahead_custponumber text,
    rahead_notes text,
    rahead_misc_accnt_id integer,
    rahead_misc_descrip text,
    rahead_misc numeric(16,4),
    rahead_curr_id integer DEFAULT basecurrid(),
    rahead_freight numeric(16,4),
    rahead_printed boolean,
    rahead_lastupdated timestamp without time zone DEFAULT now(),
    rahead_created timestamp without time zone DEFAULT now(),
    rahead_creator text DEFAULT geteffectivextuser(),
    rahead_orig_cohead_id integer,
    rahead_new_cohead_id integer,
    rahead_headcredited boolean DEFAULT false,
    rahead_warehous_id integer,
    rahead_cohead_warehous_id integer,
    rahead_taxzone_id integer,
    rahead_taxtype_id integer,
    rahead_calcfreight boolean DEFAULT false NOT NULL,
    rahead_saletype_id INTEGER REFERENCES saletype(saletype_id),
    rahead_shipzone_id INTEGER REFERENCES shipzone(shipzone_id),

    CONSTRAINT rahead_rahead_creditmethod_check CHECK (((((rahead_creditmethod = 'N'::bpchar) OR (rahead_creditmethod = 'M'::bpchar)) OR (rahead_creditmethod = 'K'::bpchar)) OR (rahead_creditmethod = 'C'::bpchar))),
    CONSTRAINT rahead_rahead_disposition_check CHECK ((((((rahead_disposition = 'C'::bpchar) OR (rahead_disposition = 'R'::bpchar)) OR (rahead_disposition = 'P'::bpchar)) OR (rahead_disposition = 'V'::bpchar)) OR (rahead_disposition = 'M'::bpchar))),
    CONSTRAINT rahead_rahead_timing_check CHECK (((rahead_timing = 'I'::bpchar) OR (rahead_timing = 'R'::bpchar)))
);

COMMENT ON TABLE rahead IS 'Return Authorization header information';
COMMENT ON COLUMN rahead.rahead_saletype_id IS 'Associated sale type for return authorization.';
COMMENT ON COLUMN rahead.rahead_shipzone_id IS 'Associated shipping zone for return authorization.';

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_pkey PRIMARY KEY (rahead_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_curr_id_fkey FOREIGN KEY (rahead_curr_id) REFERENCES curr_symbol(curr_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_cust_id_fkey FOREIGN KEY (rahead_cust_id) REFERENCES custinfo(cust_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_incdt_id_fkey FOREIGN KEY (rahead_incdt_id) REFERENCES incdt(incdt_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_misc_accnt_id_fkey FOREIGN KEY (rahead_misc_accnt_id) REFERENCES accnt(accnt_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_new_cohead_id_fkey FOREIGN KEY (rahead_new_cohead_id) REFERENCES cohead(cohead_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_orig_cohead_id_fkey FOREIGN KEY (rahead_orig_cohead_id) REFERENCES cohead(cohead_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_prj_id_fkey FOREIGN KEY (rahead_prj_id) REFERENCES prj(prj_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_rsncode_id_fkey FOREIGN KEY (rahead_rsncode_id) REFERENCES rsncode(rsncode_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_salesrep_id_fkey FOREIGN KEY (rahead_salesrep_id) REFERENCES salesrep(salesrep_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_shipto_id_fkey FOREIGN KEY (rahead_shipto_id) REFERENCES shiptoinfo(shipto_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_taxtype_id_fkey FOREIGN KEY (rahead_taxtype_id) REFERENCES taxtype(taxtype_id);

ALTER TABLE ONLY rahead
    ADD CONSTRAINT rahead_rahead_taxzone_id_fkey FOREIGN KEY (rahead_taxzone_id) REFERENCES taxzone(taxzone_id);

REVOKE ALL ON TABLE rahead FROM PUBLIC;
GRANT ALL ON TABLE rahead TO xtrole;

REVOKE ALL ON SEQUENCE rahead_rahead_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE rahead_rahead_id_seq TO xtrole;
