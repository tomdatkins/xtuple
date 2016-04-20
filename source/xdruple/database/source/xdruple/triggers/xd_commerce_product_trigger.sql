create or replace function xdruple._xd_commerce_product_trigger() returns trigger as $$

  var item_params = [],
      sql = '';

  if (TG_OP === 'INSERT') {
    plv8.elog(ERROR, 'Adding items through xDruple Commerce Product resource is now allowed.');
  } else if (TG_OP === 'UPDATE') {
    /* We do not support changing several item columns. Just marketing related columns. */
    if (OLD.title !== NEW.title ||
       OLD.sub_title !== NEW.sub_title ||
       OLD.notes !== NEW.notes ||
       OLD.ext_descrip !== NEW.ext_descrip ||
       OLD.product_weight !== NEW.product_weight ||
       OLD.package_weight !== NEW.package_weight ||
       OLD.barcode !== NEW.barcode ||
       OLD.item_length !== NEW.item_length ||
       OLD.item_width !== NEW.item_width ||
       OLD.item_height !== NEW.item_height ||
       OLD.item_phy_uom_id !== NEW.item_phy_uom_id ||
       OLD.item_pack_length !== NEW.item_pack_length ||
       OLD.item_pack_width !== NEW.item_pack_width ||
       OLD.item_pack_height !== NEW.item_pack_height ||
       OLD.item_pack_phy_uom_id !== NEW.item_pack_phy_uom_id ||
       OLD.item_mrkt_title !== NEW.item_mrkt_title ||
       OLD.item_mrkt_subtitle !== NEW.item_mrkt_subtitle ||
       OLD.item_mrkt_teaser !== NEW.item_mrkt_teaser ||
       OLD.item_mrkt_descrip !== NEW.item_mrkt_descrip ||
       OLD.item_mrkt_seokey !== NEW.item_mrkt_seokey ||
       OLD.item_mrkt_seotitle !== NEW.item_mrkt_seotitle) {

      sql = "update item set " +
              "item_descrip1 = $1, " +
              "item_descrip2 = $2, " +
              "item_comments = $3, " +
              "item_extdescrip = $4, " +
              "item_prodweight = $5, " +
              "item_packweight = $6, " +
              "item_upccode = $7 " +
              "item_length = $8 " +
              "item_width = $9 " +
              "item_height = $10 " +
              "item_phy_uom_id = $11 " +
              "item_pack_length = $12 " +
              "item_pack_width = $13 " +
              "item_pack_height = $14 " +
              "item_pack_phy_uom_id = $15 " +
              "item_mrkt_title = $16 " +
              "item_mrkt_subtitle = $17 " +
              "item_mrkt_teaser = $18 " +
              "item_mrkt_descrip = $19 " +
              "item_mrkt_seokey = $20 " +
              "item_mrkt_seotitle = $21 " +
            "where item_id = $22";

      item_params = [
        NEW.title,
        NEW.sub_title,
        NEW.notes,
        NEW.ext_descrip,
        NEW.product_weight,
        NEW.package_weight,
        NEW.barcode,
        NEW.item_length,
        NEW.item_width,
        NEW.item_height,
        NEW.item_phy_uom_id,
        NEW.item_pack_length,
        NEW.item_pack_width,
        NEW.item_pack_height,
        NEW.item_pack_phy_uom_id,
        NEW.item_mrkt_title,
        NEW.item_mrkt_subtitle,
        NEW.item_mrkt_teaser,
        NEW.item_mrkt_descrip,
        NEW.item_mrkt_seokey,
        NEW.item_mrkt_seotitle,
        OLD.product_id
      ];

      if (DEBUG) {
        XT.debug('xd_commerce_product_trigger sql =', sql);
        XT.debug('xd_commerce_product_trigger values =', item_params);
      }

      plv8.execute(sql, item_params);
    }
  } else if (TG_OP === 'DELETE') {
    /* Neither xTuple or Drupal Commerce allow you to delete an item. */
    plv8.elog(ERROR, 'Deleting items through xDruple Commerce Product resource is now allowed.');
  }

$$ language plv8;
