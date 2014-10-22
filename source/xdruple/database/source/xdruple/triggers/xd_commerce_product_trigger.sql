create or replace function xdruple._xd_commerce_product_trigger() returns trigger as $$

  var cols = [],
      colsvals = [],
      count = 0,
      item_params = [],
      params = [],
      sql = '',
      tokens = '';

  if (TG_OP === 'INSERT') {
    /* This will not add a new item, only expose an existing item to Drupal. */
    cols = ['item_id', 'type', 'language', 'uid', 'status', 'data'];
    colsvals = [NEW.product_id, NEW.type, NEW.language, NEW.uid, NEW.status, NEW.data];
    params = [];
    sql = "insert into xdruple.xd_commerce_product_data (";
    tokens = '';

    /* Loop through the user settable columns and build sql. */
    for (var i = 0; i < cols.length; i++) {
      if (colsvals[i]) {
        sql = sql + cols[i] + ', ';
        tokens = tokens + '$' + (count + 1) + ', ';
        params.push(colsvals[i]);
        count++;
      }
    }

    /* Trim comma space from the end. */
    sql = sql.replace(/[, ]+$/,'');
    tokens = tokens.replace(/[, ]+$/,'');

    sql = sql + ") VALUES (" + tokens + ")";

    if (DEBUG) {
      XT.debug('xd_commerce_product_trigger sql =', sql);
      XT.debug('xd_commerce_product_trigger values =', params);
    }

    plv8.execute(sql, params);
  } else if (TG_OP === 'UPDATE') {
// TODO: Support all the exposed columns. Right now, product updates should be
// done in xTuple Clients only. Not Drupal.
    /* We do not support changing the sku or id. */
    if (OLD.title !== NEW.title ||
       OLD.sub_title !== NEW.sub_title ||
       OLD.notes !== NEW.notes ||
       OLD.ext_descrip !== NEW.ext_descrip ||
       OLD.product_weight !== NEW.product_weight ||
       OLD.package_weight !== NEW.package_weight ||
       OLD.barcode !== NEW.barcode ||
       OLD.product_id !== NEW.product_id) {

      sql = "update item set " +
              "item_descrip1 = $1, " +
              "item_descrip2 = $2, " +
              "item_comments = $3, " +
              "item_extdescrip = $4, " +
              "item_prodweight = $5, " +
              "item_packweight = $6, " +
              "item_upccode = $7 " +
            "where item_id = $8";
      item_params = [NEW.title, NEW.sub_title, NEW.notes, NEW.ext_descrip, NEW.product_weight, NEW.package_weight, NEW.barcode, OLD.product_id];

      if (DEBUG) {
        XT.debug('xd_commerce_product_trigger sql =', sql);
        XT.debug('xd_commerce_product_trigger values =', item_params);
      }

      plv8.execute(sql, item_params);
    }

    /* Note: We don't support revisions, so we leave that column as is. */
    sql = "update xdruple.xd_commerce_product_data set " +
            "type = $1, " +
            "language = $2, " +
            "uid = $3, " +
            "status = $4, " +
            "changed = extract(EPOCH from CURRENT_DATE), " +
            "data = $5 " +
          "where item_id = $6";
    params = [NEW.type, NEW.language, NEW.uid, NEW.status, NEW.data, OLD.id];

    if (DEBUG) {
      XT.debug('xd_commerce_product_trigger sql =', sql);
      XT.debug('xd_commerce_product_trigger values =', params);
    }

    plv8.execute(sql, params);

  } else if (TG_OP === 'DELETE') {
    /* Neither xTuple or Drupal Commerce allow you to delete an item. */
  }

$$ language plv8;
