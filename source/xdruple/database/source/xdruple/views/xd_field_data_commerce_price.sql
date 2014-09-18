-- View definition for Drupal Commerce integration of 'commerce_price' field data.

select xt.create_view('xdruple.xd_field_data_commerce_price', $$
  SELECT
    id,
    'commerce_product'::text AS entity_type,
    'product'::text AS bundle,
    0::integer AS deleted,
    item_id,
    item_id AS entity_id,
    item_id AS revision_id,
    'und'::text AS language,
    0::integer AS delta,
    round(item_listprice * 100) AS commerce_price_amount,
    basecurrid() AS curr_id,
    ''::text AS commerce_price_data
  FROM xdruple.xd_commerce_product_data
  LEFT JOIN item USING(item_id)
  WHERE 1=1;
$$, false);

-- Remove old trigger if any.
drop trigger if exists xd_field_data_commerce_price_trigger on xdruple.xd_field_data_commerce_price;

-- Create trigger.
create trigger xd_field_data_commerce_price_trigger instead of insert or update or delete on xdruple.xd_field_data_commerce_price for each row execute procedure xdruple._xd_field_data_commerce_price_trigger();
