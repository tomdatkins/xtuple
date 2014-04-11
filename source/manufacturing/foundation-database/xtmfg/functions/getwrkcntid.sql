
CREATE OR REPLACE FUNCTION xtmfg.getWrkCntId(text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWorkCenter ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pWorkCenter IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT wrkcnt_id INTO _returnVal
  FROM xtmfg.wrkcnt
  WHERE (UPPER(wrkcnt_code)=UPPER(pWorkCenter));

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Work Center % not found.', pWorkCenter;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
