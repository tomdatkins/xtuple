
CREATE OR REPLACE FUNCTION xtmfg.moveBooitemDown(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pBooitemid ALIAS FOR $1;
  _booitem RECORD;
  _itemid INTEGER;
  _revid INTEGER;

BEGIN

  SELECT booitem_item_id INTO _itemid FROM xtmfg.booitem WHERE (booitem_id=pBooitemid);
  SELECT booitem_rev_id INTO _revid FROM xtmfg.booitem WHERE (booitem_id=pBooitemid);

  SELECT nextbooitem.booitem_id AS booitem_id, nextbooitem.booitem_seqnumber AS next_seqnumber,
         thisbooitem.booitem_seqnumber AS this_seqnumber INTO _booitem
  FROM xtmfg.booitem(_itemid, _revid) AS nextbooitem, xtmfg.booitem(_itemid, _revid) AS thisbooitem
  WHERE ((nextbooitem.booitem_seqnumber>thisbooitem.booitem_seqnumber)
   AND (nextbooitem.booitem_item_id=thisbooitem.booitem_item_id)
   AND (nextbooitem.booitem_rev_id=thisbooitem.booitem_rev_id)
   AND (thisbooitem.booitem_id=pBooitemid))
  ORDER BY next_seqnumber
  LIMIT 1;

  IF (FOUND) THEN

    UPDATE xtmfg.booitem
    SET booitem_seqnumber=NULL
    WHERE (booitem_id=_booitem.booitem_id);
  
    UPDATE xtmfg.booitem
    SET booitem_seqnumber=_booitem.next_seqnumber
    WHERE (booitem_id=pBooitemid);

    UPDATE xtmfg.booitem
    SET booitem_seqnumber=_booitem.this_seqnumber
    WHERE (booitem_id=_booitem.booitem_id);
  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

