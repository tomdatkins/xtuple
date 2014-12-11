-- CRM Account's Child CRM Account's Countact users.
delete from xt.sharetype where sharetype_tblname = 'share_users_crmchild_cntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_crmchild_cntct',
  'obj_uuid',
  'username'
);

-- CRM Account's Child CRM Account's Address users.
delete from xt.sharetype where sharetype_tblname = 'share_users_crmchild_addr';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_crmchild_addr',
  'obj_uuid',
  'username'
);

-- Customer Child CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_childcrm_cust_viashiptocntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_childcrm_cust_viashiptocntct',
  'obj_uuid',
  'username'
);

-- Ship To Child CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_childcrm_shipto_viashiptocntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_childcrm_shipto_viashiptocntct',
  'obj_uuid',
  'username'
);

-- Ship To Address through Ship To Child CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_childcrm_shiptoaddr_viashiptocntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_childcrm_shiptoaddr_viashiptocntct',
  'obj_uuid',
  'username'
);

-- Bill To Contact through Ship To Child CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_childcrm_custbillcntct_viashiptocntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_childcrm_custbillcntct_viashiptocntct',
  'obj_uuid',
  'username'
);

-- Bill To Address through Ship To Child CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_childcrm_custbilladdr_viashiptocntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_childcrm_custbilladdr_viashiptocntct',
  'obj_uuid',
  'username'
);

-- Correspondence Contact through Ship To Child CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_childcrm_custcorrscntct_viashiptocntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_childcrm_custcorrscntct_viashiptocntct',
  'obj_uuid',
  'username'
);

-- Correspondence Address through Ship To Child CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_childcrm_custcorrsaddr_viashiptocntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_childcrm_custcorrsaddr_viashiptocntct',
  'obj_uuid',
  'username'
);
