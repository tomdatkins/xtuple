
CREATE OR REPLACE FUNCTION xtmfg.formatWoOperBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWooperid ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  SELECT ( E'\138WOOP' ||
           LENGTH(wo_number::TEXT) || LENGTH(wo_subnumber::TEXT) || LENGTH(wooper_seqnumber::TEXT) ||
           wo_number::TEXT || wo_subnumber::TEXT || wooper_seqnumber::TEXT ) INTO _barcode
  FROM wo, xtmfg.wooper
  WHERE ( (wooper_wo_id=wo_id)
    AND (wooper_id=pWooperid) );

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

