CREATE OR REPLACE FUNCTION xwd.moveQuitemUp(pQuitemid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _nextquitem RECORD;

BEGIN

  SELECT nextquitem.quitem_linenumber AS next_linenumber,
         thisquitem.quitem_linenumber AS this_linenumber,
         thisquitem.quitem_quhead_id AS parent_id
          INTO _nextquitem
  FROM quitem AS nextquitem, quitem AS thisquitem
  WHERE ((nextquitem.quitem_linenumber < thisquitem.quitem_linenumber)
   AND (nextquitem.quitem_quhead_id=thisquitem.quitem_quhead_id)
   AND (thisquitem.quitem_id=pQuitemid))
  ORDER BY next_linenumber DESC
  LIMIT 1;

  IF (FOUND) THEN
--  Swap the linenumber of the current quitem and the next quitem
--  There is the potential for multiple quitems with the same linenumber

    UPDATE quitem
    SET quitem_linenumber=0
    WHERE (quitem_linenumber=_nextquitem.next_linenumber)
      AND (quitem_quhead_id=_nextquitem.parent_id);

    UPDATE quitem 
    SET quitem_linenumber=_nextquitem.next_linenumber
    WHERE (quitem_linenumber=_nextquitem.this_linenumber)
      AND (quitem_quhead_id=_nextquitem.parent_id);

    UPDATE quitem
    SET quitem_linenumber=_nextquitem.this_linenumber
    WHERE (quitem_linenumber=0)
      AND (quitem_quhead_id=_nextquitem.parent_id);
  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

