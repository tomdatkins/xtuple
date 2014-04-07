
CREATE OR REPLACE FUNCTION deleteMPSMRPWorkset(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
    pWorksetid ALIAS FOR $1;
BEGIN
  DELETE FROM mpsmrpwork
  WHERE (mpsmrpwork_set_id=pWorksetid);

  RETURN 1;
END;
' LANGUAGE 'plpgsql';

