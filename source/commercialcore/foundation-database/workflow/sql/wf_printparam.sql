-- Table: workflow.wf_printparam

-- DROP TABLE workflow.wf_printparam;

CREATE TABLE workflow.wf_printparam
(
  wf_printparam_id serial NOT NULL,
  wf_printparam_order integer,
  wf_printparam_name text,
  wf_printparam_value text,
  wf_printparam_type text,
  wf_printparam_parent_uuid uuid,
  wf_printparam_wfsrc_uuid uuid,
  CONSTRAINT wf_printparam_pkey PRIMARY KEY (wf_printparam_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE workflow.wf_printparam
  OWNER TO admin;
GRANT ALL ON TABLE workflow.wf_printparam TO admin;
GRANT ALL ON TABLE workflow.wf_printparam TO xtrole;
COMMENT ON TABLE workflow.wf_printparam
  IS 'Printing Parameters used by workflow jobs scheduled to be run by xtConnect';