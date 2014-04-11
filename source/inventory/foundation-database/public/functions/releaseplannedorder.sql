
CREATE OR REPLACE FUNCTION releasePlannedOrder(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
BEGIN
  RETURN releasePlannedOrder(pPlanordid, TRUE, TRUE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION releasePlannedOrder(INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  pCreateOrder ALIAS FOR $2;
BEGIN
  RETURN releasePlannedOrder(pPlanordid, pCreateOrder, TRUE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION releasePlannedOrder(INTEGER, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  pCreateOrder ALIAS FOR $2;
  pAppendTransferOrder ALIAS FOR $3;
  _p RECORD;
  _orderid INTEGER := 0;

BEGIN

  SELECT planord_type, planord_itemsite_id, planord_qty,
         (planord_duedate - planord_startdate) AS leadtime,
         CASE WHEN(planord_mps) THEN 'P'
              ELSE 'M'
         END AS plantype,
         CASE WHEN(planord_mps) THEN planord_pschitem_id
              ELSE planord_id
         END AS sourceid,
         planord_duedate, planord_supply_itemsite_id INTO _p
  FROM planord
  WHERE (planord_id=pPlanordid);

  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  IF (pCreateOrder) THEN
    IF (_p.planord_type = 'W') THEN
      SELECT createWo( fetchWoNumber(), _p.planord_itemsite_id,
                       _p.planord_qty, _p.leadtime, _p.planord_duedate,
                       '', _p.plantype, _p.sourceid ) INTO _orderid;

      IF (_orderid <= 0) THEN
        RETURN _orderid;
      END IF;

    ELSIF (_p.planord_type = 'P') THEN
      SELECT createPr('F', pPlanordid) INTO _orderid;

      IF (_orderid <= 0) THEN
        RETURN _orderid;
      END IF;

    ELSIF (_p.planord_type = 'T') THEN
      SELECT createTo(_p.planord_supply_itemsite_id, _p.planord_itemsite_id,
                      _p.planord_qty, _p.planord_duedate, pAppendTransferOrder) INTO _orderid;

      IF (_orderid <= 0) THEN
        RETURN _orderid;
      END IF;

    END IF;
  END IF;

  PERFORM deletePlannedOrder(pPlanordid, FALSE);

  RETURN _orderid;

END;
$$ LANGUAGE 'plpgsql';

