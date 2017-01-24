CREATE OR REPLACE FUNCTION getAllItemlocdist(pItemlocSeries INTEGER) RETURNS SETOF itemlocdist AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r    RECORD;
  _row  itemlocdist%ROWTYPE;
BEGIN
 
  FOR _row IN 
    WITH RECURSIVE _itemlocdist AS (
      SELECT *
      FROM itemlocdist 
      WHERE itemlocdist_series = pItemlocSeries
      UNION
      SELECT child.*
      FROM _itemlocdist, itemlocdist AS child
      WHERE child.itemlocdist_series = _itemlocdist.itemlocdist_child_series
        OR child.itemlocdist_itemlocdist_id = _itemlocdist.itemlocdist_id
    )
    SELECT * FROM _itemlocdist LOOP

  RETURN NEXT _row;

  END LOOP;

END;
$$ LANGUAGE 'plpgsql';
