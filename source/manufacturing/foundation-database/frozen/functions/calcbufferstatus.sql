SELECT dropIfExists('FUNCTION', 'calcbufferstatus(numeric,numeric)', 'xtmfg');
CREATE OR REPLACE FUNCTION xtmfg.calcbufferstatus(NUMERIC, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pSize    ALIAS FOR $1;
  pCurrent ALIAS FOR $2;

BEGIN
  IF (pSize = 0) THEN
    RETURN -9999;
  ELSE
    RETURN CAST(ROUND((1-pCurrent/pSize) * 100) AS INTEGER);
  END IF;

END;
$$ LANGUAGE 'plpgsql';
