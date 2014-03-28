
CREATE OR REPLACE FUNCTION xtmfg.loadByTool(INTEGER, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pCalitemid ALIAS FOR $2;
  _value NUMERIC;
  _startDate DATE;
  _endDate DATE;

BEGIN

  SELECT findPeriodStart(pCalitemid),
         findPeriodEnd(pCalitemid) INTO _startDate, _endDate;
  SELECT SUM( CASE WHEN (wooper_sucomplete) THEN 0
                   ELSE (wooper_sutime - wooper_suconsumed)
              END +
              CASE WHEN (wooper_rncomplete) THEN 0
                   ELSE (wooper_rntime - wooper_rnconsumed)
              END ) INTO _value
    FROM wooper
    JOIN wo ON (wooper_wo_id=wo_id)
    JOIN womatl ON (womatl_wooper_id=wooper_id)
    JOIN itemsite ON (womatl_itemsite_id=itemsite_id)
    JOIN item ON (itemsite_item_id=item_id)
    JOIN xtmfg.itemsitecap ON (itemsite_id=itemsitecap_itemsite_id)
    JOIN whsinfo ON (itemsite_warehous_id=warehous_id)
   WHERE ( (wo_status<>'C')
     AND   NOT wooper_rncomplete
     AND   (((CASE WHEN wooper_sucomplete THEN 0
                   ELSE NoNeg((wooper_sutime-wooper_suconsumed))
              END) + NoNeg(wooper_rntime-wooper_rnconsumed)) > 0)
     AND (womatl_itemsite_id=pItemsiteid)
     AND (wooper_scheduled::DATE BETWEEN _startDate AND _endDate) );

  IF (_value IS NULL) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';

