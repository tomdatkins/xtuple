-- View definition for Drupal Commerce integration of 'commerce_product' entity data.

select xt.create_view('xdruple.xd_commerce_product', $$
  SELECT
    item_id AS id,
    item_id AS product_id,
    item_id AS revision_id,
    item_number AS sku,
    item_descrip1 AS title,
    item_descrip2 AS sub_title,
    item_comments AS notes,
    item_extdescrip AS ext_descrip,
    item_prodweight AS product_weight,
    item_packweight AS package_weight,
    item_upccode AS barcode,
    item_classcode_id,
    item_prodcat_id,
    item_freightclass_id,
    item_inv_uom_id,
    item_price_uom_id,
    type,
    language,
    uid,
    status,
    created,
    changed,
    data,
    uom_weight.uom_id as item_weight_uom_id,
    uom_dimension.uom_id as item_dimension_uom_id,
    itemuomtouomratio(item_id, item_inv_uom_id, item_price_uom_id) AS uom_ratio,
    itemuomtouomratio(item_id, item_phy_uom_id, item_pack_phy_uom_id) AS prod_pack_uom_ratio,
    itemuomtouomratio(item_id, item_phy_uom_id, item_price_uom_id) AS prod_price_uom_ratio,
    itemuomtouomratio(item_id, item_pack_phy_uom_id, item_price_uom_id) AS pack_price_uom_ratio,
    item_length,
    item_width,
    item_height,
    item_phy_uom_id,
    item_pack_length,
    item_pack_width,
    item_pack_height,
    item_pack_phy_uom_id,
    item_mrkt_title,
    item_mrkt_subtitle,
    item_mrkt_teaser,
    item_mrkt_descrip,
    item_mrkt_seokey,
    item_mrkt_seotitle
  FROM xdruple.xd_commerce_product_data
  LEFT JOIN item USING(item_id)
  CROSS JOIN uom AS uom_weight
  CROSS JOIN uom AS uom_dimension
  WHERE 1=1
    AND uom_weight.uom_item_weight
    AND uom_dimension.uom_item_dimension;
$$, false);

-- Remove old trigger if any.
drop trigger if exists xd_commerce_product_trigger on xdruple.xd_commerce_product;

-- Create trigger.
create trigger xd_commerce_product_trigger instead of insert or update or delete on xdruple.xd_commerce_product for each row execute procedure xdruple._xd_commerce_product_trigger();
