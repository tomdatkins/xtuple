CREATE OR REPLACE FUNCTION getItemSrcId(text,text,date,date) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemNumber ALIAS FOR $1;
  pVendNumber ALIAS FOR $2;
  pEffective  ALIAS FOR $3;
  pExpires    ALIAS FOR $4;
  _returnVal INTEGER;
BEGIN
  IF ((pItemNumber IS NULL) OR (pVendNumber IS NULL) OR (pEffective IS NULL) OR (pExpires IS NULL)) THEN
    RETURN NULL;
  END IF;

  SELECT itemsrc_id INTO _returnVal
  FROM itemsrc
  WHERE ((itemsrc_item_id=getItemId(pItemNumber))
  AND (itemsrc_vend_id=getVendId(pVendNumber))
  AND (itemsrc_effective=pEffective)
  AND (itemsrc_expires=pExpires));

  IF (_returnVal IS NULL) THEN
        RAISE EXCEPTION ''Item Source Item % Vendor % Effective % Expires % not found.'', pItemNumber,pVendNumber,pEffective,pExpires;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION getItemSrcId(text,text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemNumber ALIAS FOR $1;
  pVendNumber ALIAS FOR $2;
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
	RAISE EXCEPTION ''Item Source Item % Vendor % not found.'', pItemNumber,pVendNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
