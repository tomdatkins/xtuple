create or replace function xdruple._xd_commerce_product_trigger() returns trigger as $$

  if (TG_OP === 'INSERT') {
    plv8.elog(ERROR, 'Adding items through xDruple Commerce Product resource is not allowed.');
  } else if (TG_OP === 'UPDATE') {
    /* We do not support changing several item columns. Just marketing related columns. */
    var updateSql = "UPDATE item SET \n";
    var updateableColumns = [
      'title',
      'sub_title',
      'notes',
      'ext_descrip',
      'product_weight',
      'package_weight',
      'barcode',
      'item_length',
      'item_width',
      'item_height',
      'item_phy_uom_id',
      'item_pack_length',
      'item_pack_width',
      'item_pack_height',
      'item_pack_phy_uom_id',
      'item_mrkt_title',
      'item_mrkt_subtitle',
      'item_mrkt_teaser',
      'item_mrkt_descrip',
      'item_mrkt_seokey',
      'item_mrkt_seotitle'
    ];
    var updateParams = [];
    var paramIndex = 0;

    updateableColumns.forEach(function(column) {
      if (OLD[column] !== NEW[column]) {
        updateParams.push(NEW[column]);
        updateSql += '  ' + column + ' = $' + (updateParams.length) + ',\n';
      }
    });

    if (updateParams.length > 0) {
      updateParams.push(OLD.product_id);
      updateSql = updateSql.replace(/,\s*$/, "");
      updateSql += '\nWHERE item_id = $'  + (updateParams.length) + ';';

      if (DEBUG) {
        XT.debug('xd_commerce_product_trigger updateSql =', updateSql);
        XT.debug('xd_commerce_product_trigger values =', updateParams);
      }

      plv8.execute(updateSql, updateParams);
    }
  } else if (TG_OP === 'DELETE') {
    /* Neither xTuple or Drupal Commerce allow you to delete an item. */
    plv8.elog(ERROR, 'Deleting items through xDruple Commerce Product resource is not allowed.');
  }

$$ language plv8;
