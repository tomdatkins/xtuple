-- Function: iscatalogitemgrp(integer)

-- DROP FUNCTION iscatalogitemgrp(integer);

CREATE OR REPLACE FUNCTION iscatalogitemgrp(integer)
  RETURNS boolean AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemGrp ALIAS FOR $1;
  _parents RECORD;
  _isCatalogChild BOOLEAN := false;

BEGIN

  -- Check all group parents for the catalog root.
  FOR _parents IN
    SELECT
      itemgrpitem_itemgrp_id AS parent,
      itemgrp_catalog
    FROM itemgrpitem, itemgrp
    WHERE true
      AND itemgrpitem_itemgrp_id = itemgrp_id
      AND itemgrpitem_item_type = 'G'
      AND itemgrpitem_item_id = pItemGrp
  LOOP
    -- Immediate parent is the catalog root. Return true.
    IF (_parents.itemgrp_catalog) THEN
      RETURN TRUE;
    ELSE
      -- Recurse into parent and check grandparents.
      SELECT iscatalogitemgrp(_parents.parent) INTO _isCatalogChild;
      -- Grandparent is the catalog root. Return true.
      IF (_isCatalogChild) THEN
        RETURN TRUE;
      END IF;
    END IF;
  END LOOP;

  -- If no catalog root was found. Return false.
  RETURN _isCatalogChild;

END;
$BODY$
  LANGUAGE plpgsql IMMUTABLE
  COST 100;
ALTER FUNCTION iscatalogitemgrp(integer)
  OWNER TO admin;
