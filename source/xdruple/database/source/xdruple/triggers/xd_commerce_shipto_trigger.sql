create or replace function xdruple._xd_commerce_shipto_trigger() returns trigger as $$

  var nextval,
      params = [],
      sql = '';

  if (TG_OP === 'INSERT') {
    if (!NEW.shipto_id) {
      nextval = plv8.execute("select nextval('shipto_shipto_id_seq');")[0].nextval;
    } else {
      nextval = NEW.shipto_id;
    }

    sql = "insert into shiptoinfo (" +
            "shipto_id, " +
            "shipto_cust_id, " +
            "shipto_name, " +
            "shipto_salesrep_id, " +
            "shipto_shipvia, " +
            "shipto_commission, " +
            "shipto_shipform_id, " +
            "shipto_shipchrg_id, " +
            "shipto_active, " +
            "shipto_default, " +
            "shipto_num, " +
            "shipto_cntct_id, " +
            "shipto_addr_id, " +
            "shipto_taxzone_id, " +
            "obj_uuid " +
          ") select " +
            "$1 AS shipto_id, " +
            "$2 AS shipto_cust_id, " +
            "$3 AS shipto_name, " +
            "cust_salesrep_id AS shipto_salesrep_id, " +
            "cust_shipvia AS shipto_shipvia, " +
            "cust_commprcnt AS shipto_commission, " +
            "cust_shipform_id AS shipto_shipform_id, " +
            "cust_shipchrg_id AS shipto_shipchrg_id, " +
            "true AS shipto_active, " +
            "$4 AS shipto_default, " +
            "$5 AS shipto_num, " +
            "$6 AS shipto_cntct_id, " +
            "$7 AS shipto_addr_id, " +
            "cust_taxzone_id AS shipto_taxzone_id, " +
            "$8 AS obj_uuid " +
          "from custinfo " +
          "where 1=1 "+
            "and cust_id = $2;";

    params = [
      nextval,
      NEW.shipto_cust_id,
      NEW.shipto_name,
      NEW.shipto_default,
      NEW.shipto_num,
      NEW.shipto_cntct_id,
      NEW.shipto_addr_id,
      NEW.obj_uuid
    ];

    if (DEBUG) {
      XT.debug('xd_commerce_shipto_trigger sql =', sql);
      XT.debug('xd_commerce_shipto_trigger values =', params);
    }

    plv8.execute(sql, params);
  } else if (TG_OP === 'UPDATE') {
    /* We do not support changing the shipto_cust_id. */
    if (OLD.shipto_name !== NEW.shipto_name ||
       OLD.shipto_default !== NEW.shipto_default ||
       OLD.shipto_num !== NEW.shipto_num ||
       OLD.shipto_cntct_id !== NEW.shipto_cntct_id ||
       OLD.shipto_addr_id !== NEW.shipto_addr_id) {

      sql = "update shiptoinfo set " +
              "shipto_name = $1, " +
              "shipto_default = $2, " +
              "shipto_num = $3, " +
              "shipto_cntct_id = $4, " +
              "shipto_addr_id = $5 " +
            "where shipto_id = $6";

      params = [
        NEW.shipto_name,
        NEW.shipto_default,
        NEW.shipto_num,
        NEW.shipto_cntct_id,
        NEW.shipto_addr_id,
        OLD.shipto_id
      ];

      if (DEBUG) {
        XT.debug('xd_commerce_shipto_trigger sql =', sql);
        XT.debug('xd_commerce_shipto_trigger values =', params);
      }

      plv8.execute(sql, params);
    }
  } else if (TG_OP === 'DELETE') {
    /* Neither xTuple or Drupal Commerce allow you to delete an item. */
  }

  return NEW;

$$ language plv8;
