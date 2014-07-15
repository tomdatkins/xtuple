-- View definition for Drupal Commerce integration of 'commerce_product' entity data.

select xt.create_view('xdruple.xd_product_groups', $$
  SELECT
    itemgrp_id,
    itemgrp_name,
    itemgrp_descrip,
    itemgrpitem_item_id
  FROM itemgrp
  LEFT JOIN itemgrpitem ON itemgrp_id = itemgrpitem_itemgrp_id;
$$, false);
