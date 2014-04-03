CREATE TABLE tohead (
    tohead_id serial NOT NULL,
    tohead_number text NOT NULL CHECK(tohead_number != ''),
    tohead_status character(1),
    tohead_orderdate date,
    tohead_src_warehous_id integer NOT NULL,
    tohead_srcname text,
    tohead_srcaddress1 text,
    tohead_srcaddress2 text,
    tohead_srcaddress3 text,
    tohead_srccity text,
    tohead_srcstate text,
    tohead_srcpostalcode text,
    tohead_srccountry text,
    tohead_srccntct_id integer,
    tohead_srccntct_name text,
    tohead_srcphone text,
    tohead_trns_warehous_id integer NOT NULL,
    tohead_trnsname text,
    tohead_dest_warehous_id integer NOT NULL,
    tohead_destname text,
    tohead_destaddress1 text,
    tohead_destaddress2 text,
    tohead_destaddress3 text,
    tohead_destcity text,
    tohead_deststate text,
    tohead_destpostalcode text,
    tohead_destcountry text,
    tohead_destcntct_id integer,
    tohead_destcntct_name text,
    tohead_destphone text,
    tohead_agent_username text,
    tohead_shipvia text,
    tohead_shipform_id          INTEGER,
    tohead_shipchrg_id integer,
    tohead_freight numeric(16,4) DEFAULT 0.0 NOT NULL,
    tohead_freight_curr_id integer DEFAULT basecurrid(),
    tohead_shipcomplete boolean DEFAULT false NOT NULL,
    tohead_ordercomments text,
    tohead_shipcomments text,
    tohead_packdate date,
    tohead_prj_id integer,
    tohead_lastupdated timestamp without time zone DEFAULT now() NOT NULL,
    tohead_created timestamp without time zone DEFAULT now() NOT NULL,
    tohead_creator text DEFAULT geteffectivextuser() NOT NULL,
    tohead_taxzone_id integer,
    CONSTRAINT tohead_check CHECK (((tohead_freight = 0.0) OR ((tohead_freight <> 0.0) AND (tohead_freight_curr_id IS NOT NULL))))
);

COMMENT ON TABLE tohead IS 'Header information about Transfer Orders.';

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_pkey PRIMARY KEY (tohead_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_number_key UNIQUE (tohead_number);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_dest_warehous_id_fkey FOREIGN KEY (tohead_dest_warehous_id) REFERENCES whsinfo(warehous_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_destcntct_id_fkey FOREIGN KEY (tohead_destcntct_id) REFERENCES cntct(cntct_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_freight_curr_id_fkey FOREIGN KEY (tohead_freight_curr_id) REFERENCES curr_symbol(curr_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_prj_id_fkey FOREIGN KEY (tohead_prj_id) REFERENCES prj(prj_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_shipchrg_id_fkey FOREIGN KEY (tohead_shipchrg_id) REFERENCES shipchrg(shipchrg_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_shipform_id_fkey FOREIGN KEY (tohead_shipform_id) REFERENCES shipform(shipform_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_src_warehous_id_fkey FOREIGN KEY (tohead_src_warehous_id) REFERENCES whsinfo(warehous_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_srccntct_id_fkey FOREIGN KEY (tohead_srccntct_id) REFERENCES cntct(cntct_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_taxzone_id_fkey FOREIGN KEY (tohead_taxzone_id) REFERENCES taxzone(taxzone_id);

ALTER TABLE ONLY tohead
    ADD CONSTRAINT tohead_tohead_trns_warehous_id_fkey FOREIGN KEY (tohead_trns_warehous_id) REFERENCES whsinfo(warehous_id);

REVOKE ALL ON TABLE tohead FROM PUBLIC;
GRANT ALL ON TABLE tohead TO xtrole;

REVOKE ALL ON SEQUENCE tohead_tohead_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE tohead_tohead_id_seq TO xtrole;
