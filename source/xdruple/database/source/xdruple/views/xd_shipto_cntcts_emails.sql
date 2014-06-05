-- View definition for Drupal Commerce integration of 'ship to' entity data.

select xt.create_view('xdruple.xd_shipto_cntcts_emails', $$
  SELECT
    shipto_id,
    shiptoinfo.obj_uuid as shipto_uuid,
    shiptoinfo.obj_uuid,
    array_to_string(array_agg(cntct_email), ',') as emails
  FROM shiptoinfo
  LEFT JOIN docass ON docass_source_id = shipto_id AND docass_source_type = 'SHP'
  LEFT JOIN cntct ON docass_target_id = cntct_id
  WHERE cntct_email IS NOT NULL
  GROUP BY
    shipto_id,
    shipto_num,
    shiptoinfo.obj_uuid;
$$, false);
