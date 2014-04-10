CREATE OR REPLACE FUNCTION formatToitemBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  ptoitemid	ALIAS FOR $1;
  _barcode	TEXT;
BEGIN

  SELECT ( E'\138TOLI' ||
           LENGTH(TEXT(tohead_number)) || LENGTH(TEXT(toitem_linenumber)) ||
           TEXT(tohead_number) || TEXT(toitem_linenumber) ) INTO _barcode
  FROM tohead, toitem
  WHERE ((toitem_tohead_id=tohead_id)
    AND  (toitem_id=ptoitemid));

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';
