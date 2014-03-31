DROP SEQUENCE IF EXISTS planord_planord_id_seq;

CREATE TABLE planord (
    planord_id serial NOT NULL,
    planord_type character(1),
    planord_itemsite_id integer,
    planord_duedate date,
    planord_qty numeric(16,4),
    planord_firm boolean,
    planord_comments text,
    planord_number integer,
    planord_subnumber integer,
    planord_startdate date,
    planord_planord_id integer,
    planord_mps boolean DEFAULT false NOT NULL,
    planord_pschitem_id integer,
    planord_supply_itemsite_id integer
);

COMMENT ON TABLE planord IS 'Temporary table for storing information about Planned Orders';

ALTER TABLE ONLY planord
    ADD CONSTRAINT planord_pkey PRIMARY KEY (planord_id);

ALTER TABLE ONLY planord
    ADD CONSTRAINT planord_planord_number_key UNIQUE (planord_number, planord_subnumber);

CREATE INDEX planord_itemsite_id_key ON planord USING btree (planord_itemsite_id);
CREATE INDEX planord_startdate_idx ON planord USING btree (planord_startdate);

REVOKE ALL ON TABLE planord FROM PUBLIC;
GRANT ALL ON TABLE planord TO xtrole;

REVOKE ALL ON SEQUENCE planord_planord_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE planord_planord_id_seq TO xtrole;
