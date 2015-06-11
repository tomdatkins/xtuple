-- View definition for Drupal Commerce integration of 'ship to' entity data.

select xt.create_view('xdruple.xd_commerce_shipto', $$
  SELECT
    shipto_id,
    shipto_cust_id,
    shipto_num,
    shipto_name,
    shipto_active,
    shipto_default,
    shipto_salesrep_id,
    shipto_commission,
    shipto_shipzone_id,
    shipto_taxzone_id,
    shipto_shipvia,
    shipto_shipchrg_id,
    shipto_cntct_id,
    shipto_addr_id,
    shipto_comments,
    shipto_shipcomments,
    obj_uuid
  FROM shiptoinfo
  WHERE 1=1
    AND shipto_active;
$$, false);

-- Remove old trigger if any.
drop trigger if exists xd_commerce_shipto_trigger on xdruple.xd_commerce_shipto;

-- Create trigger.
create trigger xd_commerce_shipto_trigger instead of insert or update or delete on xdruple.xd_commerce_shipto for each row execute procedure xdruple._xd_commerce_shipto_trigger();
