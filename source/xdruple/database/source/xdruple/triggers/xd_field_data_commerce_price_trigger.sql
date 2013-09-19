create or replace function xdruple._xd_field_data_commerce_price_trigger() returns trigger as $$

  var cols = [],
      colsvals = [],
      params = [],
      sql = '',
      tokens = '';

  if (TG_OP === 'INSERT') {
    /* This will not add a new item_listprice, only expose an existing item_listprice to Drupal. */
    cols = ['entity_type', 'bundle', 'deleted', 'item_id', 'language', 'delta', 'curr_id', 'commerce_price_data'];
    colsvals = [NEW.entity_type, NEW.bundle, NEW.deleted, NEW.item_id, NEW.language, NEW.delta. NEW.curr_id, NEW.commerce_price_data];
    params = [];
    sql = "insert into xdruple.xd_field_data_comm_price_data (";
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
    /* The only item column that can be changed from Drupal is the item_listprice. */
    /* We do not support changing the id or curr_id. */
    if (OLD.commerce_price_amount !== NEW.commerce_price_amount) {
      sql = "update item set item_listprice = round(($1 / 100), 6) where item_id = $2";

      plv8.execute(sql, [NEW.commerce_price_amount, OLD.item_id]);
    }

    /* Note: We don't support revisions, so we leave that column as is. */
    sql = "update xdruple.xd_field_data_comm_price_data set " +
            "entity_type = $1, " +
            "bundle = $2, " +
            "deleted = $3, " +
            "language = $4, " +
            "delta = &5, " +
            "commerce_price_data = $6 " +
          "where id = $7";

    plv8.execute(sql, [NEW.entity_type, NEW.bundle, NEW.deleted, NEW.language, NEW.delta, NEW.commerce_price_data, OLD.id]);

  } else if (TG_OP === 'DELETE') {
    /* Drupal doesn't allow you to delete field data. */
  }

$$ language plv8;
