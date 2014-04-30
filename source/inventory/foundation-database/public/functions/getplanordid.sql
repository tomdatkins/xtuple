CREATE OR REPLACE FUNCTION getPlanOrdId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanOrdNumber ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pPlanOrdNumber IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT planord_id INTO _returnVal
  FROM planord
  WHERE (CAST(planord_number AS text) || ''-'' || CAST(planord_subnumber AS text)=pPlanOrdNumber);

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION ''Planned Order % not found.'', pPlanOrdNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
