-- Ship To CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'xd_share_users_stdorditem';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xdruple',
  'xd_share_users_stdorditem',
  'obj_uuid',
  'username'
);

-- Ship To's Standard Order Items Child CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'xd_share_users_childcrm_stdorditem_viashiptocntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xdruple',
  'xd_share_users_childcrm_stdorditem_viashiptocntct',
  'obj_uuid',
  'username'
);
