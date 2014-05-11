
CREATE OR REPLACE FUNCTION formatRaLineNumber(INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRaitemid ALIAS FOR $1;
  _r RECORD;

BEGIN

  SELECT raitem_linenumber, raitem_subnumber
    INTO _r
    FROM raitem
   WHERE(raitem_id=pRaitemid);

  IF(NOT FOUND) THEN
    RETURN NULL;
  END IF;

  IF(COALESCE(_r.raitem_subnumber, 0) > 0) THEN
    RETURN _r.raitem_linenumber || '.' || _r.raitem_subnumber;
  END IF;

  RETURN _r.raitem_linenumber; 
END;
$$ LANGUAGE 'plpgsql';

