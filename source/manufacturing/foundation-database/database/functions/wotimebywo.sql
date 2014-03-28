
CREATE OR REPLACE FUNCTION xtmfg.woTimeByWo(INTEGER) RETURNS INTERVAL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoid	ALIAS FOR $1;
BEGIN
  RETURN xtmfg.woTime(pWoid, NULL);
END;
$$ LANGUAGE 'plpgsql';
