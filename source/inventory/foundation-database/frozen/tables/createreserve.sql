CREATE TABLE reserve (
  reserve_id SERIAL PRIMARY KEY NOT NULL,
  reserve_demand_type TEXT NOT NULL,
  reserve_demand_id INTEGER NOT NULL,
  reserve_supply_type TEXT NOT NULL,
  reserve_supply_id INTEGER NOT NULL,
  reserve_qty NUMERIC(18,6) NOT NULL,
  reserve_status CHAR(1) NOT NULL
);

REVOKE ALL ON reserve FROM PUBLIC;
GRANT ALL ON reserve TO GROUP xtrole;

REVOKE ALL ON reserve_reserve_id_seq FROM PUBLIC;
GRANT ALL ON reserve_reserve_id_seq TO GROUP xtrole;

COMMENT ON TABLE reserve IS 'This table is demand reservations on supplies.';

INSERT INTO reserve (
  reserve_demand_type,
  reserve_demand_id,
  reserve_supply_type,
  reserve_supply_id,
  reserve_qty,
  reserve_status )
SELECT
  itemlocrsrv_source,
  itemlocrsrv_source_id,
  'I',
  itemlocrsrv_itemloc_id,
  itemlocrsrv_qty,
  'R'
FROM itemlocrsrv;

DROP TABLE itemlocrsrv;

ALTER TABLE shipitemlocrsrv DROP CONSTRAINT shipitemlocrsrv_shipitemlocrsrv_location_id_fkey;
