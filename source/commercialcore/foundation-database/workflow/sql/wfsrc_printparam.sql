-- Table: workflow.wfsrc_printparam

-- DROP TABLE workflow.wfsrc_printparam;

CREATE TABLE workflow.wfsrc_printparam
(
  wfsrc_printparam_id serial NOT NULL,
  wfsrc_printparam_wfsrc_id integer,
  wfsrc_printparam_order integer,
  wfsrc_printparam_name text,
  wfsrc_printparam_value text,
  wfsrc_printparam_type text,
  wfsrc_printparam_wfsrc_uuid uuid,
  CONSTRAINT wfsrc_printparam_pkey PRIMARY KEY (wfsrc_printparam_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE workflow.wfsrc_printparam
  OWNER TO admin;
GRANT ALL ON TABLE workflow.wfsrc_printparam TO admin;
GRANT ALL ON TABLE workflow.wfsrc_printparam TO xtrole;
COMMENT ON TABLE workflow.wfsrc_printparam
  IS 'Printing Parameters used by workflow jobs scheduled to be run by xtConnect';