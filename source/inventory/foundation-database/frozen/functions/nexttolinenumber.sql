CREATE OR REPLACE FUNCTION nextToLineNumber(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pToheadid ALIAS FOR $1;
  _linenumber INTEGER := -1;

BEGIN

SELECT (COALESCE(MAX(toitem_linenumber), 0) + 1) INTO _linenumber
FROM toitem
WHERE (toitem_tohead_id=pToheadid);

RETURN _linenumber;

END;
$$ LANGUAGE 'plpgsql';
