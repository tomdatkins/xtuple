-- Shipment's Sales Order CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_shiphead';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_shiphead',
  'obj_uuid',
  'username'
);
