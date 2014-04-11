
CREATE OR REPLACE FUNCTION formatLotSerialNumberBarcode(TEXT) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  plotserialnumber ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  SELECT ( E'\138LSNX' ||
           LENGTH(TEXT(plotserialnumber)) ||
	   TEXT(plotserialnumber)) INTO _barcode;

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

