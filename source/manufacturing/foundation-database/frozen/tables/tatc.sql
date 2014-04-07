
CREATE TABLE xtmfg.tatc
(
  tatc_id serial NOT NULL,
  tatc_emp_id integer,
  tatc_type text,
  tatc_wotc_id integer,
  tatc_wo_id integer,
  tatc_timein timestamp with time zone,
  tatc_timeout timestamp with time zone,
  tatc_overtime numeric,
  tatc_notes text,
  tatc_glaccnt_id integer,
  tatc_posted boolean,
  tatc_created timestamp without time zone DEFAULT now(),
  tatc_creator text DEFAULT geteffectivextuser(),
  tatc_adjust numeric,
  tatc_paid boolean,
  CONSTRAINT tatc_pkey PRIMARY KEY (tatc_id ),
  CONSTRAINT tatc_emp_id_fk FOREIGN KEY (tatc_emp_id)
      REFERENCES emp (emp_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT tatc_wo_id_fk FOREIGN KEY (tatc_wo_id)
      REFERENCES wo (wo_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT tatc_wotc_id_fk FOREIGN KEY (tatc_wotc_id)
      REFERENCES xtmfg.wotc (wotc_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT tatc_check_type CHECK (tatc_type = ANY (ARRAY['WO'::text, 'BR'::text, 'OH'::text, 'RE'::text]))
)
WITH (
  OIDS=FALSE
);
ALTER TABLE xtmfg.tatc
  OWNER TO admin;
GRANT ALL ON TABLE xtmfg.tatc TO admin;
GRANT ALL ON TABLE xtmfg.tatc TO xtrole;
GRANT ALL ON SEQUENCE xtmfg.tatc_tatc_id_seq TO xtrole;

