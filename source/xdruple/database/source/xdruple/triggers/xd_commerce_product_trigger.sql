create or replace function xdruple._xd_commerce_product_trigger() returns trigger as $$

  var cols = [],
      colsvals = [],
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
        tokens = tokens + '$' + (i + 1) + ', ';
        params.push(colsvals[i]);
      }
    }

    /* Trim comma space from the end. */
    sql = sql.replace(/[, ]+$/,'');
    tokens = tokens.replace(/[, ]+$/,'');

    sql = sql + ") VALUES (" + tokens + ")";

    plv8.execute(sql, params);
  } else if (TG_OP === 'UPDATE') {
    /* The only item column that can be changed from Drupal is the title. */
    /* We do not support changing the sku or id. */
    if (OLD.title !== NEW.title) {
      sql = "update item set item_descrip1 = $1 where item_id = $2";

      plv8.execute(sql, [NEW.title, OLD.product_id]);
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

    plv8.execute(sql, [NEW.type, NEW.language, NEW.uid, NEW.status, NEW.data, OLD.id]);

  } else if (TG_OP === 'DELETE') {
    /* Neither xTuple or Drupal Commerce allow you to delete an item. */
  }

$$ language plv8;
