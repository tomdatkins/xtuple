
CREATE OR REPLACE FUNCTION currentPlanNumber() RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _planNumber INTEGER;

BEGIN

  SELECT orderseq_number INTO _planNumber
  FROM orderseq
  WHERE (orderseq_name=''PlanNumber'');
  IF (NOT FOUND) THEN
    _planNumber := 0;
  END IF;

  RETURN _planNumber;

END;
' LANGUAGE 'plpgsql';

