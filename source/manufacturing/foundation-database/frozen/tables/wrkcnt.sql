CREATE TABLE xtmfg.wrkcnt (
    wrkcnt_id integer DEFAULT nextval(('xtmfg.wrkcnt_wrkcnt_id_seq'::text)::regclass) NOT NULL,
    wrkcnt_code text UNIQUE NOT NULL CHECK(wrkcnt_code != ''),
    wrkcnt_machcode text,
    wrkcnt_descrip text,
    wrkcnt_nummachs integer,
    wrkcnt_numpeople integer,
    wrkcnt_run_lbrrate_id integer,
    wrkcnt_runrate numeric(20,8),
    wrkcnt_setup_lbrrate_id integer,
    wrkcnt_setuprate numeric(20,8),
    wrkcnt_brd_prcntlbr numeric(10,6),
    wrkcnt_brd_rateperlbrhr numeric(16,4),
    wrkcnt_brd_ratepermachhr numeric(16,4),
    wrkcnt_brd_rateperunitprod numeric(16,4),
    wrkcnt_avgsutime numeric(10,7),
    wrkcnt_dailycap numeric(18,6),
    wrkcnt_caploaduom character(1),
    wrkcnt_efficfactor numeric(10,6),
    wrkcnt_usage_ptd numeric(18,6),
    wrkcnt_usage_ptd_next numeric(18,6),
    wrkcnt_usage_ytd numeric(18,6),
    wrkcnt_usage_ytd_last numeric(18,6),
    wrkcnt_lastmaint date,
    wrkcnt_warehous_id integer,
    wrkcnt_comments text,
    wrkcnt_avgqueuedays integer,
    wrkcnt_wip_location_id integer DEFAULT -1 NOT NULL,
    wrkcnt_dept_id integer
);

COMMENT ON TABLE xtmfg.wrkcnt IS 'Work Center information';

CREATE SEQUENCE xtmfg.wrkcnt_wrkcnt_id_seq
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;

ALTER TABLE ONLY xtmfg.wrkcnt
    ADD CONSTRAINT wrkcnt_pkey PRIMARY KEY (wrkcnt_id);

CREATE INDEX wrkcnt_warehous_id_key ON xtmfg.wrkcnt USING btree (wrkcnt_warehous_id);

ALTER TABLE ONLY xtmfg.wrkcnt
    ADD CONSTRAINT wrkcnt_wrkcnt_dept_id_fkey FOREIGN KEY (wrkcnt_dept_id) REFERENCES public.dept(dept_id);

REVOKE ALL ON TABLE xtmfg.wrkcnt FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.wrkcnt TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.wrkcnt_wrkcnt_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.wrkcnt_wrkcnt_id_seq TO xtrole;
