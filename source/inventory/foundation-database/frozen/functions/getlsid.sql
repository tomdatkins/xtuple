CREATE OR REPLACE FUNCTION getLsId(text,text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemNumber 	ALIAS FOR $1;
  pLsNumber 	ALIAS FOR $2;
  _returnVal 	INTEGER;
BEGIN
  IF (pLsNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT ls_id INTO _returnVal
  FROM ls
  WHERE ((ls_item_id=getItemId(pItemNumber))
  AND (ls_number=pLsNumber));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Lot/Serial Number % for % not found.'', pLsNumber, pItemNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
