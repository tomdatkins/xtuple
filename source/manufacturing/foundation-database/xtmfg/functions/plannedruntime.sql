
CREATE OR REPLACE FUNCTION xtmfg.plannedRunTime(INTEGER, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWrkcntid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;

BEGIN

  RETURN xtmfg.plannedRunTime('W', pWrkcntid, pPeriodid);

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION xtmfg.plannedRunTime(TEXT, INTEGER, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pResourceType ALIAS FOR $1;
  pResourceid ALIAS FOR $2;
  pPeriodid ALIAS FOR $3;
  _time NUMERIC;

BEGIN

  IF (pResourceType = 'W') THEN
    SELECT SUM(planoper_rntime) INTO _time
    FROM xtmfg.planoper, planord
    WHERE ( (planoper_planord_id=planord_id)
     AND (planoper_wrkcnt_id=pResourceid)
     AND (planord_startdate BETWEEN findPeriodStart(pPeriodid) AND findPeriodEnd(pPeriodid)) );

    RETURN _time;
  ELSEIF (pResourceType = 'T') THEN
    SELECT SUM(planoper_rntime) INTO _time
    FROM planreq, xtmfg.planoper, planord, item, itemsite, xtmfg.itemsitecap, whsinfo
    WHERE ( (planreq_source_id=planord_id)
      AND   (planreq_source='P')
      AND   (planreq_itemsite_id=itemsite_id)
      AND   (planreq_planoper_seq_id=planoper_seq_id)
      AND   (itemsite_warehous_id=warehous_id)
      AND   (itemsite_item_id=item_id)
      AND   (itemsitecap_itemsite_id=itemsite_id)
      AND   (item_id=pResourceid)
      AND   (planord_startdate BETWEEN findPeriodStart(pPeriodid) AND findPeriodEnd(pPeriodid)) );

    RETURN _time;
  ELSE
    RAISE EXCEPTION 'Invalid Resource Type (%)', pResourceType;
  END IF; 

END;
$$ LANGUAGE 'plpgsql';
