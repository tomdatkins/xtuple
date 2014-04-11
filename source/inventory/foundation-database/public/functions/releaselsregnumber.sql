CREATE OR REPLACE FUNCTION releaselsregnumber(TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _number ALIAS FOR $1;
  _check INTEGER;

BEGIN

  SELECT setval('lsreg_number_seq', (CAST(_number AS INTEGER) - 1)) INTO _check;

  IF (FOUND) THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
  
END;
$$ LANGUAGE 'plpgsql';

