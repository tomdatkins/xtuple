
CREATE TABLE xtmfg.tashift
(
  tashift_id serial NOT NULL,
  tashift_shift_id integer,
  tashift_active boolean,
  tashift_starttime time without time zone,
  tashift_rndbeforestart integer,
  tashift_rndafterstart integer,
  tashift_endtime time without time zone,
  tashift_rndbeforeend integer,
  tashift_rndafterend integer,
  tashift_firstbreakstart time without time zone,
  tashift_firstbreakend time without time zone,
  tashift_firstbreakpaid boolean,
  tashift_scndbreakstart time without time zone,
  tashift_scndbreakend time without time zone,
  tashift_scndbreakpaid boolean,
  tashift_lnchbreakstart time without time zone,
  tashift_lnchbreakend time without time zone,
  tashift_lnchbreakpaid boolean,
  tashift_default_clockout time without time zone,
  tashift_labor_rate integer,
  tashift_overtimehours_day numeric,
  tashift_overtimehours_week numeric,
  tashift_overtimemultiplier numeric,
  tashift_overhead_accnt_id integer,
  CONSTRAINT tashift_pkey PRIMARY KEY (tashift_id ),
  CONSTRAINT tashift_shift_id_fk FOREIGN KEY (tashift_shift_id)
      REFERENCES shift (shift_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE xtmfg.tashift
  OWNER TO admin;
GRANT ALL ON TABLE xtmfg.tashift TO admin;
GRANT ALL ON TABLE xtmfg.tashift TO xtrole;
GRANT ALL ON SEQUENCE xtmfg.tashift_tashift_id_seq TO xtrole;

