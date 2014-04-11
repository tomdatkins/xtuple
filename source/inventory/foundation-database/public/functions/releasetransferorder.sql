CREATE OR REPLACE FUNCTION releaseTransferOrder(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pToheadid ALIAS FOR $1;

  _count    INTEGER := 0;

BEGIN

  UPDATE toitem
  SET toitem_status='O'
  WHERE ( (toitem_tohead_id=pToheadid)
    AND   (toitem_status='U') );
  GET DIAGNOSTICS _count = ROW_COUNT;

  IF (_count < 1 AND NOT EXISTS(SELECT toitem_id
                                  FROM toitem
                                 WHERE ((toitem_status != 'X'
                                    AND (toitem_tohead_id=pToheadid))))) THEN
    RETURN -1;  -- cannot release t/o with no items
  END IF;

  IF ( ( SELECT (tohead_status='U')
         FROM tohead
         WHERE (tohead_id=pToheadid) ) ) THEN

    UPDATE tohead
    SET tohead_status='O'
    WHERE (tohead_id=pToheadid);

  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
