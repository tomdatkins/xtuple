CREATE OR REPLACE FUNCTION xwd.findCommLevel(pPikid INTEGER,
                                             pLevel INTEGER,
                                             pCounter INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN

  IF (pCounter > 5) THEN
    RETURN '';
  END IF;

  SELECT * INTO _r
  FROM xwd.catcomm
  WHERE (catcomm_pik=pPikid);
  IF (FOUND) THEN
    IF (_r.catcomm_level=pLevel) THEN
      RETURN _r.catcomm_comm_desc;
    ELSE
      RETURN findCommLevel(_r.catcomm_parent_pik, pLevel, (pCounter + 1));
    END IF;
  ELSE
    RETURN 'N/A';
  END IF;
END;
$$ LANGUAGE 'plpgsql';

