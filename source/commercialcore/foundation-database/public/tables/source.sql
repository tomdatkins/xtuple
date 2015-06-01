-- Add Document and Characteristic association support to Item Groups.
DELETE FROM source WHERE source_charass = 'ITEMGRP';
SELECT createDoctype(NULL, 'ITEMGRP','ITEMGRP',
  'ITEMGRP', 'Item Group', 'itemgrp',
  'itemgrp_id', 'itemgrp_name', 'itemgrp_descrip',
  'itemgrp_catalog::text',
  'SELECT itemgrp_id, itemgrp_name, itemgrp_name FROM itemgrp ORDER BY 2;', '',
  'itemgrp_id', 'itemGroup', '');
