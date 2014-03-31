CREATE TABLE mpsmrpwork (
    mpsmrpwork_id serial NOT NULL,
    mpsmrpwork_set_id integer,
    mpsmrpwork_order integer,
    mpsmrpwork_startdate date,
    mpsmrpwork_enddate date,
    mpsmrpwork_qoh numeric(20,8),
    mpsmrpwork_allocations numeric(20,8),
    mpsmrpwork_orders numeric(20,8),
    mpsmrpwork_availability numeric(20,8),
    mpsmrpwork_planned numeric(20,8),
    mpsmrpwork_plannedavailability numeric(20,8),
    mpsmrpwork_firmed numeric(20,8),
    mpsmrpwork_firmedavailability numeric(20,8),
    mpsmrpwork_available numeric(20,8)
);

COMMENT ON TABLE mpsmrpwork IS 'Temporary table for storing information requested by Material Requirements Planning (MRP) and Master Production Scheduling (MPS) displays and reports';

ALTER TABLE ONLY mpsmrpwork
    ADD CONSTRAINT mpsmrpwork_pkey PRIMARY KEY (mpsmrpwork_id);

REVOKE ALL ON TABLE mpsmrpwork FROM PUBLIC;
GRANT ALL ON TABLE mpsmrpwork TO xtrole;

REVOKE ALL ON SEQUENCE mpsmrpwork_mpsmrpwork_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE mpsmrpwork_mpsmrpwork_id_seq TO xtrole;
