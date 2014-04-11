
CREATE OR REPLACE FUNCTION xtmfg.loadByWorkCenter(INTEGER, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWrkcntid ALIAS FOR $1;
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
  FROM xtmfg.wooper JOIN wo ON (wo_id=wooper_wo_id)
  WHERE ( (wo_status <> 'C')
   AND (wooper_wrkcnt_id=pWrkcntid)
   AND (wooper_scheduled::DATE BETWEEN _startDate AND _endDate) );

  IF (_value IS NULL) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';

