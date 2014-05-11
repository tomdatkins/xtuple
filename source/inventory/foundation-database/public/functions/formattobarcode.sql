CREATE OR REPLACE FUNCTION formatToBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  ptoheadid	ALIAS FOR $1;
  _barcode	TEXT;
BEGIN
  SELECT ( E'\138TOXX' ||
           LENGTH(tohead_number::TEXT) || tohead_number::TEXT ) INTO _barcode
  FROM tohead
  WHERE (tohead_id=ptoheadid);

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';
