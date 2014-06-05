CREATE OR REPLACE FUNCTION xwd.movePoitemDown(pPoitemid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _nextpoitem RECORD;

BEGIN

  SELECT nextpoitem.poitem_linenumber AS next_linenumber,
         thispoitem.poitem_linenumber AS this_linenumber,
         thispoitem.poitem_pohead_id AS parent_id
          INTO _nextpoitem
  FROM poitem AS nextpoitem, poitem AS thispoitem
  WHERE ((nextpoitem.poitem_linenumber > thispoitem.poitem_linenumber)
   AND (nextpoitem.poitem_pohead_id=thispoitem.poitem_pohead_id)
   AND (thispoitem.poitem_id=pPoitemid))
  ORDER BY next_linenumber
  LIMIT 1;

  IF (FOUND) THEN
--  Swap the linenumber of the current poitem and the next poitem
--  There is the potential for multiple poitems with the same linenumber

    UPDATE poitem
    SET poitem_linenumber=0
    WHERE (poitem_linenumber=_nextpoitem.next_linenumber)
      AND (poitem_pohead_id=_nextpoitem.parent_id);

    UPDATE poitem 
    SET poitem_linenumber=_nextpoitem.next_linenumber
    WHERE (poitem_linenumber=_nextpoitem.this_linenumber)
      AND (poitem_pohead_id=_nextpoitem.parent_id);

    UPDATE poitem
    SET poitem_linenumber=_nextpoitem.this_linenumber
    WHERE (poitem_linenumber=0)
      AND (poitem_pohead_id=_nextpoitem.parent_id);
  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
