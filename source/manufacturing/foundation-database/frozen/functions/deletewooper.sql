
CREATE OR REPLACE FUNCTION xtmfg.deleteWooper(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWooperid ALIAS FOR $1;
  _check INTEGER;

BEGIN

  SELECT wooper_id INTO _check
  FROM xtmfg.wooper
  WHERE (wooper_id=pWooperid) AND (COALESCE(wooper_suconsumed, 0.0) > 0.0)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;
 
  SELECT wooper_id INTO _check
  FROM xtmfg.wooper
  WHERE (wooper_id=pWooperid) AND (COALESCE(wooper_rnconsumed, 0.0) > 0.0)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;
 
  SELECT wooper_id INTO _check
  FROM xtmfg.wooper
  WHERE (wooper_id=pWooperid) AND (COALESCE(wooper_qtyrcv, 0.0) > 0.0)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;
 
  SELECT wotc_id INTO _check
  FROM xtmfg.wotc
  WHERE (wotc_wooper_id=pWooperid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

  DELETE FROM xtmfg.wooper
  WHERE (wooper_id=pWooperid);

  RETURN pWooperid;

END;
$$ LANGUAGE 'plpgsql';

