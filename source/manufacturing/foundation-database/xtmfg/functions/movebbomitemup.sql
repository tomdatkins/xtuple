
CREATE OR REPLACE FUNCTION xtmfg.moveBbomitemUp(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pBbomitemid ALIAS FOR $1;
  _nextBbomitem RECORD;

BEGIN

  SELECT nextbbomitem.bbomitem_id AS bbomitem_id,
         nextbbomitem.bbomitem_seqnumber AS next_seqnumber,
         thisbbomitem.bbomitem_seqnumber AS this_seqnumber INTO _nextBbomitem
  FROM bbomitem AS nextbbomitem, bbomitem AS thisbbomitem
  WHERE ((nextbbomitem.bbomitem_seqnumber < thisbbomitem.bbomitem_seqnumber)
   AND (nextbbomitem.bbomitem_parent_item_id=thisbbomitem.bbomitem_parent_item_id)
   AND (thisbbomitem.bbomitem_id=pBbomitemid))
  ORDER BY next_seqnumber DESC
  LIMIT 1;

  IF (FOUND) THEN
--  Swap the seqnumber of the current bbomitem and the next bbomitem

    UPDATE bbomitem 
    SET bbomitem_seqnumber=_nextBbomitem.next_seqnumber
    WHERE (bbomitem_id=pBbomitemid);

    UPDATE bbomitem
    SET bbomitem_seqnumber=_nextBbomitem.this_seqnumber
    WHERE (bbomitem_id=_nextBbomitem.bbomitem_id);

    RETURN 1;
  ELSE
    RETURN -1;
  END IF;

END;
$$ LANGUAGE 'plpgsql';
