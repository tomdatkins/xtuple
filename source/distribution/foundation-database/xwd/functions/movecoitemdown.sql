CREATE OR REPLACE FUNCTION xwd.moveCoitemDown(pCoitemid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _nextcoitem RECORD;

BEGIN

  SELECT nextcoitem.coitem_linenumber AS next_linenumber,
         thiscoitem.coitem_linenumber AS this_linenumber,
         thiscoitem.coitem_cohead_id AS parent_id
          INTO _nextcoitem
  FROM coitem AS nextcoitem, coitem AS thiscoitem
  WHERE ((nextcoitem.coitem_linenumber > thiscoitem.coitem_linenumber)
   AND (nextcoitem.coitem_cohead_id=thiscoitem.coitem_cohead_id)
   AND (thiscoitem.coitem_id=pCoitemid))
  ORDER BY next_linenumber
  LIMIT 1;

  IF (FOUND) THEN
--  Swap the linenumber of the current coitem and the next coitem
--  There is the potential for multiple coitems with the same linenumber

    UPDATE coitem
    SET coitem_linenumber=0
    WHERE (coitem_linenumber=_nextcoitem.next_linenumber)
      AND (coitem_cohead_id=_nextcoitem.parent_id);

    UPDATE coitem 
    SET coitem_linenumber=_nextcoitem.next_linenumber
    WHERE (coitem_linenumber=_nextcoitem.this_linenumber)
      AND (coitem_cohead_id=_nextcoitem.parent_id);

    UPDATE coitem
    SET coitem_linenumber=_nextcoitem.this_linenumber
    WHERE (coitem_linenumber=0)
      AND (coitem_cohead_id=_nextcoitem.parent_id);
  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
