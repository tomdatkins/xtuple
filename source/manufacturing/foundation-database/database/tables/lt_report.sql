CREATE TABLE xtmfg.lt_report
(
  report_id integer DEFAULT nextval(('xtmfg.lt_report_id_seq'::text)::regclass) NOT NULL,
  lvl integer,
  item text,
  item_id integer,
  itemsite_id integer,
  seq_number integer,
  item_descrip1 text,
  item_type text,
  lt integer,
  parent_lt integer,
  total_lt integer,
  parent text
);

CREATE SEQUENCE xtmfg.lt_report_id_seq
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;

REVOKE ALL ON TABLE xtmfg.lt_report FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.lt_report TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.lt_report_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.lt_report_id_seq TO xtrole;

ALTER SEQUENCE xtmfg.lt_report_id_seq OWNED BY xtmfg.lt_report.report_id;

