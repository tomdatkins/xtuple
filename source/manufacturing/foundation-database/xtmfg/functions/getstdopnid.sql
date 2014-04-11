
CREATE OR REPLACE FUNCTION xtmfg.getStdOpnId(text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pStdOpn ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pStdOpn IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT stdopn_id INTO _returnVal
  FROM xtmfg.stdopn
  WHERE (UPPER(stdopn_number)=UPPER(pStdOpn));

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Standard Operation % not found.', pStdOpn;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
