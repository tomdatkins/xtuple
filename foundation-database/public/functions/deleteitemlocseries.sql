CREATE OR REPLACE FUNCTION deleteItemlocSeries(pItemlocSeries INTEGER, pFailed BOOLEAN DEFAULT FALSE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _funcexists         BOOLEAN;
  _deletedIds         RECORD;
  _count              INTEGER DEFAULT 0;

BEGIN
  --Cache itemlocdist
  IF EXISTS (SELECT * FROM pg_proc WHERE proname = 'deleteitemlocdist') THEN
    _funcexists := TRUE;
  END IF;
  
  FOR _deletedIds IN (
    -- Delete all itemlocdist records related to the pItemlocseries
    WITH RECURSIVE _itemlocdist(itemlocdist_id, itemlocdist_child_series, itemlocdist_series) AS (
      SELECT itemlocdist_id, itemlocdist_child_series, itemlocdist_series 
      FROM itemlocdist 
      WHERE itemlocdist_series = pItemlocseries
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
        RAISE EXCEPTION 'DELETE FROM itemlocdist WHERE itemlocdist_id = % failed.'
          '[xtuple: createItemlocSeries, -1, %]', _deletedIds.itemlocdist_id, _deletedIds.itemlocdist_id;
      END IF;
    END IF;
    
    _count := _count + 1;
  END LOOP;

  IF (pFailed = true) THEN
    
    DELETE 
    FROM invdetail  
         USING invhist 
    WHERE invdetail_invhist_id = invhist_id AND itemlocdist_series = pItemlocSeries;

    DELETE FROM invhist WHERE invhist_series = pItemlocSeries;
    DELETE FROM itemlocpost WHERE itemlocpost_itemlocseries = pItemlocseries;
    DELETE FROM lsdetail WHERE lsdetail_source_id IN (_deletedIds);
  END IF;
  
  RETURN _count;

END;
$$ LANGUAGE 'plpgsql';
  
       
