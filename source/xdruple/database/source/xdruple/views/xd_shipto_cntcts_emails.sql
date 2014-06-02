-- View definition for Drupal Commerce integration of 'ship to' entity data.

select xt.create_view('xdruple.xd_shipto_cntcts_emails', $$
SELECT
  shipto_id,
  shipto_num,
  shiptoinfo.obj_uuid,
  cntct_email
FROM shiptoinfo
LEFT JOIN docass ON docass_source_id = shipto_id AND docass_source_type = 'SHP'
LEFT JOIN cntct ON docass_target_id = cntct_id;
$$, false);
