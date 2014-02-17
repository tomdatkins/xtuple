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
    item_classcode_id,
    item_prodcat_id,
    item_price_uom_id,
    type,
    language,
    uid,
    status,
    created,
    changed,
    data
  FROM xdruple.xd_commerce_product_data
  LEFT JOIN item USING(item_id)
  WHERE 1=1;
$$, false);

-- Remove old trigger if any.
drop trigger if exists xd_commerce_product_trigger on xdruple.xd_commerce_product;

-- Create trigger.
create trigger xd_commerce_product_trigger instead of insert or update or delete on xdruple.xd_commerce_product for each row execute procedure xdruple._xd_commerce_product_trigger();
