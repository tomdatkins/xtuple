DROP FUNCTION IF EXISTS changePrDate(INTEGER, DATE);
CREATE OR REPLACE FUNCTION changePrDate(INTEGER, DATE) RETURNS BOOL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPrid ALIAS FOR $1;
  pDate ALIAS FOR $2;

BEGIN

  UPDATE pr
  SET pr_duedate=pDate
  WHERE (pr_id=pPrid);

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';
