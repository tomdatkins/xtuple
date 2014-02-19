-- View definition for Drupal Commerce integration of 'commerce_price' field data.

select xt.create_view('xdruple.xd_field_data_commerce_price', $$
  SELECT
    id,
    entity_type,
    bundle,
    deleted,
    item_id,
    item_id AS entity_id,
    item_id AS revision_id,
    language,
    delta,
    round(item_listprice * 100) AS commerce_price_amount,
    curr_id,
    commerce_price_data
  FROM xdruple.xd_field_data_comm_price_data
  LEFT JOIN item USING(item_id)
  WHERE 1=1;
$$, false);

-- Remove old trigger if any.
drop trigger if exists xd_field_data_commerce_price_trigger on xdruple.xd_field_data_commerce_price;

-- Create trigger.
create trigger xd_field_data_commerce_price_trigger instead of insert or update or delete on xdruple.xd_field_data_commerce_price for each row execute procedure xdruple._xd_field_data_commerce_price_trigger();
