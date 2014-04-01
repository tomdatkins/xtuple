CREATE TABLE xtmfg.mrpexcp
(
  mrpexcp_id serial NOT NULL,
  mrpexcp_itemsite_id integer,
  mrpexcp_created date DEFAULT ('now'::text)::date,
  mrpexcp_demand_type text,
  mrpexcp_demand_id integer,
  mrpexcp_demand_qty numeric,
  mrpexcp_demand_date date,
  mrpexcp_supply_type text,
  mrpexcp_supply_id integer,
  mrpexcp_supply_qty numeric,
  mrpexcp_supply_date date,
  mrpexcp_supply_suggqty numeric,
  mrpexcp_supply_suggdate date,
  CONSTRAINT mrpexcp_pkey PRIMARY KEY (mrpexcp_id)
);

CREATE INDEX mrpexcp_mrpexcp_itemsite_id_idx
  ON xtmfg.mrpexcp
  USING btree
  (mrpexcp_itemsite_id);

GRANT ALL ON TABLE xtmfg.mrpexcp TO xtrole;
GRANT ALL ON SEQUENCE xtmfg.mrpexcp_mrpexcp_id_seq TO xtrole;
