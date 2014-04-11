
CREATE OR REPLACE FUNCTION xtmfg.setwhsewkday(INTEGER, INTEGER, BOOL) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWarehousId ALIAS FOR $1;
  pDayOfWeek ALIAS FOR $2;
  pActive ALIAS FOR $3;

BEGIN

  IF ((pDayOfWeek < 0) OR (pDayOfWeek > 6)) THEN
    RETURN -2;
  END IF;

  DELETE
    FROM xtmfg.whsewk
   WHERE ( (whsewk_warehous_id=pWarehousId)
     AND   (whsewk_weekday=pDayOfWeek) );

  IF (pActive) THEN
    INSERT INTO xtmfg.whsewk
           ( whsewk_warehous_id, whsewk_weekday )
    VALUES ( pWarehousId, pDayOfWeek );
  END IF;

  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';

