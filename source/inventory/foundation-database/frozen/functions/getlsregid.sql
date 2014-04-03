CREATE OR REPLACE FUNCTION getLsRegId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pLsRegNumber ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pLsRegNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT lsreg_id INTO _returnVal
  FROM lsreg
  WHERE (lsreg_number=pLsRegNumber);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Lot/Serial Registration % not found.'', pLsRegNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
