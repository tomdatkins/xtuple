CREATE OR REPLACE FUNCTION getItemSrcId(pItemNumber TEXT,
                                        pVendNumber TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF ((pItemNumber IS NULL) OR (pVendNumber IS NULL)) THEN
    RETURN NULL;
  END IF;

  SELECT itemsrc_id INTO _returnVal
  FROM itemsrc
  WHERE ((itemsrc_item_id=getItemId(pItemNumber))
  AND (itemsrc_vend_id=getVendId(pVendNumber)));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Item Source Item % Vendor % not found.', pItemNumber,pVendNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getItemSrcId(pItemNumber TEXT,
                                        pVendNumber TEXT,
                                        pVendItemNumber TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF ((pItemNumber IS NULL) OR (pVendNumber IS NULL) OR (pVendItemNumber IS NULL)) THEN
    RETURN NULL;
  END IF;

  SELECT itemsrc_id INTO _returnVal
  FROM itemsrc
  WHERE ((itemsrc_item_id=getItemId(pItemNumber))
  AND (itemsrc_vend_id=getVendId(pVendNumber))
  AND (itemsrc_vend_item_number=pVendItemNumber));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Item Source Item % Vendor % Vend Item % not found.', pItemNumber,pVendNumber,pVendItemNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE plpgsql;
