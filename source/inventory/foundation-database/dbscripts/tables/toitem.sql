CREATE TABLE toitem (
    toitem_id serial NOT NULL,
    toitem_tohead_id integer NOT NULL,
    toitem_linenumber integer,
    toitem_item_id integer NOT NULL,
    toitem_status character(1) NOT NULL,
    toitem_duedate date NOT NULL,
    toitem_schedshipdate date NOT NULL,
    toitem_schedrecvdate date,
    toitem_qty_ordered numeric(18,6) NOT NULL,
    toitem_qty_shipped numeric(18,6) DEFAULT 0.0 NOT NULL,
    toitem_qty_received numeric(18,6) DEFAULT 0.0 NOT NULL,
    toitem_uom text NOT NULL,
    toitem_stdcost numeric(16,6) NOT NULL,
    toitem_prj_id integer,
    toitem_freight numeric(16,4) DEFAULT 0.0 NOT NULL,
    toitem_freight_curr_id integer,
    toitem_notes text,
    toitem_closedate timestamp with time zone,
    toitem_close_username text,
    toitem_lastupdated timestamp with time zone DEFAULT now() NOT NULL,
    toitem_created timestamp with time zone DEFAULT now() NOT NULL,
    toitem_creator text DEFAULT geteffectivextuser() NOT NULL,
    toitem_freight_received numeric(16,4) DEFAULT 0.0 NOT NULL,
    CONSTRAINT toitem_check CHECK ((((toitem_freight = 0.0) AND (toitem_freight_received = 0.0)) OR (toitem_freight_curr_id IS NOT NULL))),
    CONSTRAINT toitem_toitem_status_check CHECK (((((toitem_status = 'U'::bpchar) OR (toitem_status = 'O'::bpchar)) OR (toitem_status = 'C'::bpchar)) OR (toitem_status = 'X'::bpchar)))
);

COMMENT ON TABLE toitem IS 'Transfer Order Line Item information';

ALTER TABLE ONLY toitem
    ADD CONSTRAINT toitem_pkey PRIMARY KEY (toitem_id);

CREATE INDEX toitem_item_id_idx ON toitem USING btree (toitem_item_id);
CREATE INDEX toitem_linenumber_idx ON toitem USING btree (toitem_linenumber);
CREATE INDEX toitem_status_idx ON toitem USING btree (toitem_status);
CREATE INDEX toitem_tohead_id_idx ON toitem USING btree (toitem_tohead_id);

ALTER TABLE ONLY toitem
    ADD CONSTRAINT toitem_toitem_freight_curr_id_fkey FOREIGN KEY (toitem_freight_curr_id) REFERENCES curr_symbol(curr_id);

ALTER TABLE ONLY toitem
    ADD CONSTRAINT toitem_toitem_item_id_fkey FOREIGN KEY (toitem_item_id) REFERENCES item(item_id);

ALTER TABLE ONLY toitem
    ADD CONSTRAINT toitem_toitem_prj_id_fkey FOREIGN KEY (toitem_prj_id) REFERENCES prj(prj_id);

ALTER TABLE ONLY toitem
    ADD CONSTRAINT toitem_toitem_tohead_id_fkey FOREIGN KEY (toitem_tohead_id) REFERENCES tohead(tohead_id);

REVOKE ALL ON TABLE toitem FROM PUBLIC;
GRANT ALL ON TABLE toitem TO xtrole;

REVOKE ALL ON SEQUENCE toitem_toitem_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE toitem_toitem_id_seq TO xtrole;
