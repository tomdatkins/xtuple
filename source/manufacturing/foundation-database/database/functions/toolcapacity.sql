
CREATE OR REPLACE FUNCTION xtmfg.toolCapacity(INTEGER, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _value NUMERIC;

BEGIN

  SELECT ((itemsitecap_dailycap * itemsitecap_efficfactor) * (pEndDate - pStartDate + 1)) INTO _value
  FROM xtmfg.itemsitecap
  WHERE (itemsitecap_itemsite_id=pItemsiteid);

  IF (NOT FOUND) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';

 
CREATE OR REPLACE FUNCTION xtmfg.toolCapacity(INTEGER, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  _value NUMERIC;

BEGIN

  SELECT xtmfg.toolCapacity(pItemsiteid, findPeriodStart(pPeriodid), findPeriodEnd(pPeriodid)) INTO _value;

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';
