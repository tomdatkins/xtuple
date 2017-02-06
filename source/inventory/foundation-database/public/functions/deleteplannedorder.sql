CREATE OR REPLACE FUNCTION deletePlannedOrder(pPlanordid INTEGER,
                                              pDeleteChildren BOOLEAN)
  RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  DELETE FROM planord
  WHERE (planord_id=pPlanordid);

  IF packageIsEnabled('xtmfg') AND fetchmetricbool('Routings') THEN
    DELETE FROM xtmfg.planoper
    WHERE (planoper_planord_id=pPlanordid);
  END IF;

  DELETE FROM planreq
  WHERE ( (planreq_source='P')
   AND (planreq_source_id=pPlanordid) );

  IF (pDeleteChildren) THEN
    PERFORM deletePlannedOrder(planord_id, TRUE)
    FROM planord
    WHERE (planord_planord_id=pPlanordid);
  END IF;

  RETURN TRUE;

END;
$$ LANGUAGE plpgsql;

