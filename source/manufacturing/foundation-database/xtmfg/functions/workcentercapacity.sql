CREATE OR REPLACE FUNCTION xtmfg.workCenterCapacity(INTEGER, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWrkcntid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _value NUMERIC;
 
BEGIN
 
  SELECT ((wrkcnt_dailycap * wrkcnt_efficfactor) * (pEndDate - pStartDate + 1)) INTO _value
  FROM xtmfg.wrkcnt
  WHERE (wrkcnt_id=pWrkcntid);
 
  IF (NOT FOUND) THEN
    _value := 0;
  END IF;
 
  RETURN _value;
 
END;
$$ LANGUAGE 'plpgsql';
 
 
CREATE OR REPLACE FUNCTION xtmfg.workCenterCapacity(INTEGER, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWrkcntid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  _value NUMERIC;
 
BEGIN
 
  SELECT xtmfg.workCenterCapacity(pWrkcntid, findPeriodStart(pPeriodid), findPeriodEnd(pPeriodid)) INTO _value;
 
  RETURN _value;
 
END;
$$ LANGUAGE 'plpgsql';
