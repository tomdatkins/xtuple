CREATE TABLE xtmfg.wotc (
    wotc_id integer NOT NULL,
    wotc_wo_id integer,
    wotc_timein timestamp with time zone,
    wotc_timeout timestamp with time zone,
    wotc_wooper_id integer,
    wotc_username text,
    wotc_emp_code text
);

COMMENT ON TABLE xtmfg.wotc IS 'Work Order Time Clock - when each User clocked in and out of a particular Work Order';


CREATE SEQUENCE xtmfg.wotc_wotc_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.wotc_wotc_id_seq OWNED BY xtmfg.wotc.wotc_id;

ALTER TABLE xtmfg.wotc ALTER COLUMN wotc_id SET DEFAULT nextval('xtmfg.wotc_wotc_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.wotc
    ADD CONSTRAINT wotc_pkey PRIMARY KEY (wotc_id);

ALTER TABLE ONLY xtmfg.wotc
    ADD CONSTRAINT wotc_wotc_wo_id_fkey FOREIGN KEY (wotc_wo_id) REFERENCES public.wo(wo_id);

ALTER TABLE ONLY xtmfg.wotc
    ADD CONSTRAINT wotc_wotc_wooper_id_fkey FOREIGN KEY (wotc_wooper_id) REFERENCES xtmfg.wooper(wooper_id) ON DELETE SET NULL;

ALTER TABLE xtmfg.wotc
    ADD CONSTRAINT wotc_wotc_emp_code_fkey FOREIGN KEY (wotc_emp_code) REFERENCES public.emp(emp_code)
    ON UPDATE NO ACTION ON DELETE NO ACTION;

CREATE INDEX fki_wotc_wotc_emp_code_fkey ON xtmfg.wotc(wotc_emp_code);

REVOKE ALL ON TABLE xtmfg.wotc FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.wotc TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.wotc_wotc_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.wotc_wotc_id_seq TO xtrole;
