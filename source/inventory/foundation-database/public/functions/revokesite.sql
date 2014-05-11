
CREATE OR REPLACE FUNCTION revokeSite(TEXT, INTEGER) RETURNS BOOL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  pWarehousId ALIAS FOR $2;

BEGIN

  DELETE FROM usrsite
  WHERE ( (usrsite_username=pUsername)
   AND (usrsite_warehous_id=pWarehousId) );

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';
