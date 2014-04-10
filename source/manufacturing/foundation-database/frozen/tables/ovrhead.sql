-- Table: xtmfg.ovrhead

-- DROP TABLE xtmfg.ovrhead;

CREATE TABLE xtmfg.ovrhead
(
  ovrhead_id serial NOT NULL,
  ovrhead_code text NOT NULL,
  ovrhead_descrip text,
  ovrhead_accnt_id integer,
  ovrhead_default boolean,
  CONSTRAINT ovrhead_pkey PRIMARY KEY (ovrhead_id),
  CONSTRAINT ovrhead_accnt_fk FOREIGN KEY (ovrhead_accnt_id)
      REFERENCES accnt (accnt_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT ovrhead_ovrhead_code_key UNIQUE (ovrhead_code),
  CONSTRAINT ovrhead_ovrhead_code_check CHECK (ovrhead_code <> ''::text)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE xtmfg.ovrhead
  OWNER TO admin;
GRANT ALL ON TABLE xtmfg.ovrhead TO admin;
GRANT ALL ON TABLE xtmfg.ovrhead TO xtrole;
COMMENT ON TABLE xtmfg.ovrhead
  IS 'Overhead Assignment information';
