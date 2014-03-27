CREATE OR REPLACE FUNCTION closeTransferOrder(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  ptoheadid	ALIAS FOR $1;

BEGIN
  -- TODO: add error checking
  -- fail if there are items which have been shipped but not recalled/received?
  UPDATE toitem SET toitem_status=''C''
  WHERE ((toitem_status <> ''X'')
    AND  (toitem_tohead_id=ptoheadid));

  RETURN ptoheadid;
END;
' LANGUAGE 'plpgsql';
