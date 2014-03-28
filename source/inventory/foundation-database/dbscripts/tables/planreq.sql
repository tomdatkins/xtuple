CREATE TABLE planreq (
    planreq_id serial NOT NULL,
    planreq_source character(1),
    planreq_source_id integer,
    planreq_itemsite_id integer,
    planreq_qty numeric(16,4),
    planreq_notes text,
    planreq_planoper_seq_id integer
);

COMMENT ON TABLE planreq IS 'Temporary table for storing information about Planned Work Order Material Requirements from exploded Planned Work Orders';
COMMENT ON COLUMN planreq.planreq_planoper_seq_id IS 'The Operation Sequence Id';

ALTER TABLE ONLY planreq
    ADD CONSTRAINT planreq_pkey PRIMARY KEY (planreq_id);

CREATE INDEX planreq_itemsite_id_key ON planreq USING btree (planreq_itemsite_id);
CREATE INDEX planreq_source_id_key ON planreq USING btree (planreq_source_id);

REVOKE ALL ON TABLE planreq FROM PUBLIC;
GRANT ALL ON TABLE planreq TO xtrole;

REVOKE ALL ON SEQUENCE planreq_planreq_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE planreq_planreq_id_seq TO xtrole;
