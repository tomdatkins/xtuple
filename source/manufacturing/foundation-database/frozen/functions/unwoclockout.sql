
CREATE OR REPLACE FUNCTION xtmfg.unWoClockOut(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWotcid	ALIAS FOR $1;
  _wotc_timein	TIMESTAMP WITH TIME ZONE;

BEGIN
  SELECT wotc_timein INTO _wotc_timein
  FROM xtmfg.wotc
  WHERE (wotc_id=pWotcid);

  IF (NOT FOUND) THEN
    RETURN -1;
  ELSIF (_wotc_timein IS NULL) THEN	-- clocked out without ever clocking in
    DELETE FROM xtmfg.wotc WHERE (wotc_id=pWotcid);
  ELSE
    UPDATE xtmfg.wotc
    SET wotc_timeout=NULL
    WHERE (wotc_id=pWotcid);
  END IF;

  RETURN pWotcid;
END;
$$ LANGUAGE 'plpgsql';
