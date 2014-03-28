SELECT backupanddroptable('shipitemlocrsrv'); -- some 3.7 postbooks databases have this but shouldn't
CREATE TABLE shipitemlocrsrv
(
  shipitemlocrsrv_id serial NOT NULL PRIMARY KEY,
  shipitemlocrsrv_shipitem_id integer NOT NULL REFERENCES shipitem (shipitem_id) ON DELETE CASCADE,
  shipitemlocrsrv_itemsite_id integer NOT NULL REFERENCES itemsite (itemsite_id),
  shipitemlocrsrv_location_id integer NOT NULL REFERENCES location (location_id),
  shipitemlocrsrv_ls_id integer REFERENCES ls (ls_id),
  shipitemlocrsrv_expiration date,
  shipitemlocrsrv_warrpurc date,
  shipitemlocrsrv_qty numeric(18,6) NOT NULL
)
WITH (
  OIDS=FALSE
);
GRANT ALL ON TABLE shipitemlocrsrv TO xtrole;
GRANT ALL ON SEQUENCE shipitemlocrsrv_shipitemlocrsrv_id_seq TO xtrole;
COMMENT ON TABLE shipitemlocrsrv IS 'This table records reservations by location used to fullfill issue. Used to restore reservation state if stock returned';
