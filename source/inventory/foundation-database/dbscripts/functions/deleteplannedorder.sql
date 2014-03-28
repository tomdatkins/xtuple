
CREATE OR REPLACE FUNCTION deletePlannedOrder(INTEGER, BOOLEAN) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  pDeleteChildren ALIAS FOR $2;

BEGIN

  DELETE FROM planord
  WHERE (planord_id=pPlanordid);

  IF (fetchmetricbool('Routings')) THEN
    DELETE FROM xtmfg.planoper
    WHERE (planoper_planord_id=pPlanordid);
  END IF;

--  Delete any Planned Requirements
  DELETE FROM planreq
  WHERE ( (planreq_source='P')
   AND (planreq_source_id=pPlanordid) );

  IF (pDeleteChildren) THEN
--  Recursively delete and Planned Orders
    PERFORM deletePlannedOrder(planord_id, TRUE)
    FROM planord
    WHERE (planord_planord_id=pPlanordid);
  END IF;

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';

