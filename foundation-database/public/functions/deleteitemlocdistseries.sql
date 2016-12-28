CREATE OR REPLACE FUNCTION deleteItemlocdistSeries(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemlocdistSeries  ALIAS FOR $1;
  _funcexists         BOOLEAN;
  _deletedIds         RECORD;
  _count              INTEGER;

BEGIN
  --Cache itemlocdist
  IF EXISTS (SELECT * FROM pg_proc WHERE proname = 'deleteitemlocdist') THEN
    _funcexists := TRUE;
  END IF;

  _count := 0;
  FOR _deletedIds IN (
    -- Delete all itemlocdist records related to the pItemlocdistseries
    WITH RECURSIVE _itemlocdist(itemlocdist_id, itemlocdist_child_series, itemlocdist_series) AS (
      SELECT itemlocdist_id, itemlocdist_child_series, itemlocdist_series 
      FROM itemlocdist 
      WHERE itemlocdist_series = pItemlocdistseries
      UNION
      SELECT child.itemlocdist_id, child.itemlocdist_child_series, child.itemlocdist_series 
      FROM _itemlocdist, itemlocdist AS child
      WHERE child.itemlocdist_series = _itemlocdist.itemlocdist_child_series
        OR child.itemlocdist_itemlocdist_id = _itemlocdist.itemlocdist_id
    )
    SELECT itemlocdist_id FROM _itemlocdist
  ) LOOP
    
    IF (_funcexists) THEN 
      PERFORM deleteitemlocdist(_deletedIds.itemlocdist_id);
    ELSE 
      DELETE FROM itemlocdist WHERE itemlocdist_id = _deletedIds.itemlocdist_id 
      RETURNING itemlocdist_id;

      IF (NOT FOUND) THEN 
        RAISE EXCEPTION 'DELETE FROM itemlocdist WHERE itemlocdist_id = % failed.', 
          _deletedIds.itemlocdist_id;
      END IF;
    END IF;

    _count := _count + 1;

  END LOOP;
  
  RETURN _count;

END;
$$ LANGUAGE 'plpgsql';
  
       
