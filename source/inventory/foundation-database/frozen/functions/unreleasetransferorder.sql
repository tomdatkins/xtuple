CREATE OR REPLACE FUNCTION unreleaseTransferOrder(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pToheadid ALIAS FOR $1;

BEGIN

  IF ( ( SELECT (tohead_status='O')
         FROM tohead
         WHERE (tohead_id=pToheadid) ) ) THEN

    UPDATE tohead
    SET tohead_status='U'
    WHERE (tohead_id=pToheadid);

  END IF;

  UPDATE toitem
  SET toitem_status='U'
  WHERE ( (toitem_tohead_id=pToheadid)
    AND   (toitem_status='O') );

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
