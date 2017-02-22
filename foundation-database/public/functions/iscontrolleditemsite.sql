
CREATE OR REPLACE FUNCTION isControlledItemsite(pItemsiteId INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _controlled BOOLEAN;

BEGIN
  SELECT itemsite_controlmethod != 'N' 
    AND (itemsite_loccntrl OR itemsite_controlmethod IN ('L', 'S')) INTO _controlled
  FROM itemsite
  WHERE itemsite_id = pItemsiteId;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No Itemsite Found For itemsite_id % [xtuple: isControlledItemsite, %, -1]',
      pItemsiteId, pItemsiteId;
  END IF;

  RETURN _controlled;
END;
$$ LANGUAGE plpgsql;

