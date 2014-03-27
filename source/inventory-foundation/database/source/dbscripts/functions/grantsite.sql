
CREATE OR REPLACE FUNCTION grantSite(TEXT, INTEGER) RETURNS BOOL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  pWarehousId ALIAS FOR $2;
  _test INTEGER;

BEGIN

  SELECT usrsite_id INTO _test
  FROM usrsite
  WHERE ( (usrsite_username=pUsername)
   AND (usrsite_warehous_id=pWarehousid) );

  IF (FOUND) THEN
    RETURN FALSE;
  END IF;

  INSERT INTO usrsite
  ( usrsite_username, usrsite_warehous_id )
  VALUES
  ( pUsername, pWarehousId );

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';

