CREATE TABLE shipitemrsrv (
  shipitemrsrv_id serial primary key,
  shipitemrsrv_shipitem_id integer references shipitem (shipitem_id) on delete cascade,
  shipitemrsrv_qty numeric(18,6)
);
grant all on table shipitemrsrv to xtrole;
grant all on sequence shipitemrsrv_shipitemrsrv_id_seq to xtrole;
