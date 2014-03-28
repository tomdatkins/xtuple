
CREATE OR REPLACE FUNCTION xtmfg.woopermatlissued(INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoOper ALIAS FOR $1;
  _qtyNotIssued NUMERIC := 0.0;

BEGIN

  SELECT COALESCE(SUM(NONEG(womatl_qtyreq - womatl_qtyiss)), 0.0) INTO _qtyNotIssued
    FROM xtmfg.wooper JOIN womatl ON (womatl_wooper_id=wooper_id)
  WHERE (wooper_id=pWoOper);

  IF (_qtyNotIssued = 0.0) THEN
   RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE 'plpgsql';

