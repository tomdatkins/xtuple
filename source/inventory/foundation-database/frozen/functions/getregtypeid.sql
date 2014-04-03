CREATE OR REPLACE FUNCTION getRegTypeId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRegTypeCode ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pRegTypeCode IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT regtype_id INTO _returnVal
  FROM regtype
  WHERE (regtype_code=pRegTypeCode);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Registration Type % not found.'', pRegTypeCode;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
