CREATE OR REPLACE FUNCTION xwd.updateCommLevel(pPikid INTEGER,
                                               pLevel INTEGER,
                                               pCounter INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN

  IF (pCounter > 5) THEN
    RETURN 0;
  END IF;

  FOR _r IN
  SELECT *
  FROM xwd.catcomm
  WHERE (catcomm_parent_pik=pPikid)
  LOOP
    UPDATE xwd.catcomm SET catcomm_level=(pLevel + 1) WHERE catcomm_id=_r.catcomm_id;
    PERFORM updateCommLevel(_r.catcomm_pik, (pLevel + 1), (pCounter + 1));
  END LOOP;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

