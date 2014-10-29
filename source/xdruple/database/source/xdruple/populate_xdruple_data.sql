
-- TODO: Add an xdruple_site?
-- TODO: Add xdruple user associations, but need Drupal User's UUID?

-- Populate the xdruple.xd_commerce_product_data table:
INSERT INTO xdruple.xd_commerce_product_data (item_id) (
  SELECT
    item_id
  FROM item
  WHERE true
    AND item_sold
    AND item_active
    AND item_classcode_id IN (
      SELECT classcode_id
      FROM classcode
      WHERE true
        AND classcode_code NOT ILIKE ('TOYS%')
        AND classcode_code NOT ILIKE ('SERVICES%')
    )
    AND item_id NOT IN (
      SELECT item_id
      FROM xdruple.xd_commerce_product_data
    )
);
