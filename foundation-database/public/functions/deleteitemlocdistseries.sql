CREATE OR REPLACE FUNCTION deleteItemlocdistSeries(INTEGER) RETURNS BOOLEAN AS $$

-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemlocdistSeries  ALIAS FOR $1;
  _funcexists         BOOLEAN;
  _deletedIds         RECORD;

BEGIN
  --Cache itemlocdist
  IF EXISTS (SELECT * FROM pg_proc WHERE proname = 'deleteitemlocdist') THEN
    _funcexists := TRUE;
  END IF;

  FOR _deletedIds IN (
    -- Delete all itemlocdist records related to the pItemlocdistseries
    WITH RECURSIVE _itemlocdist(itemlocdist_id, itemlocdist_child_series, itemlocdist_series) AS (
      SELECT itemlocdist_id, itemlocdist_child_series, itemlocdist_series 
      FROM itemlocdist 
      WHERE itemlocdist_series = pItemlocdistseries
      UNION
      SELECT ild.itemlocdist_id, ild.itemlocdist_child_series, ild.itemlocdist_series 
      FROM _itemlocdist, itemlocdist AS ild
      WHERE ild.itemlocdist_series = _itemlocdist.itemlocdist_child_series
        OR ild.itemlocdist_itemlocdist_id = _itemlocdist.itemlocdist_id
    )
    SELECT itemlocdist_id FROM _itemlocdist
    ) LOOP
    
    IF (_funcexists) THEN 
      PERFORM deleteitemlocdist(_deletedIds.itemlocdist_id);
    ELSE 
      DELETE FROM itemlocdist WHERE itemlocdist_id = _deletedIds.itemlocdist_id;
    END IF;

  END LOOP;
  
  RETURN FOUND;

END;
$$ LANGUAGE 'plpgsql';
  
       
