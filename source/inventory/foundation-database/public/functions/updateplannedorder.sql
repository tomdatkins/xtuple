CREATE OR REPLACE FUNCTION updatePlannedOrder(integer,numeric,date,boolean,text) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanOrdId ALIAS FOR $1;
  pQty	     ALIAS FOR $2;
  pDueDate   ALIAS FOR $3;
  pFirm      ALIAS FOR $4;
  pComments  ALIAS FOR $5;
  _result    NUMERIC;
  _p	     RECORD;
BEGIN

  -- Get planned order information
  SELECT planord_number,planord_itemsite_id,planord_qty,planord_duedate,
         planord_firm, itemsite_leadtime, planord_qty INTO _p
  FROM planord, itemsite
  WHERE ((planord_id=pPlanOrdId)
  AND (planord_itemsite_id=itemsite_id));

  IF (FOUND) THEN
    IF ((_p.planord_qty != pQty) OR
        (_p.planord_duedate != pDueDate)) THEN

      -- Critical information has changed, rebuild planned order set
      PERFORM deletePlannedOrder(pPlanOrdId, TRUE);
      
      _result := createPlannedOrder(_p.planord_number,_p.planord_itemsite_id,
                                       pQty,pDueDate-_p.itemsite_leadtime,pDueDate);
    ELSE
      _result := _p.planord_qty;
    END IF;

    -- Update all planned orders in this set with new status and comments
    UPDATE planord SET
      planord_firm=pFirm,
      planord_comments=pComments
    WHERE (planord_number=_p.planord_number);
    
  ELSE
    RAISE EXCEPTION ''Planned Order not found'';
  END IF;

  RETURN _result;

END;
' LANGUAGE 'plpgsql';
