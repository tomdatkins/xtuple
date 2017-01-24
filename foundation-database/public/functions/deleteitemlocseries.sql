CREATE OR REPLACE FUNCTION deleteItemlocSeries(pItemlocSeries INTEGER, pFailed BOOLEAN DEFAULT FALSE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r          RECORD;
  _funcExists BOOLEAN;
  _count      INTEGER := 0;

BEGIN
  IF EXISTS (SELECT * FROM pg_proc WHERE proname = 'deleteitemlocdist') THEN
    _funcExists := TRUE;
  END IF;

  FOR _r IN SELECT * FROM getallitemlocdist(pItemlocSeries) LOOP
    IF (_funcExists) THEN
      PERFORM deleteitemlocdist(_r.itemlocdist_id);
    ELSE 
      DELETE FROM itemlocdist WHERE itemlocdist_id = _r.itemlocdist_id;
    END IF;
    
    _count := _count + 1;
  END LOOP;

  IF (pFailed) THEN
    DELETE
    FROM invdetail
    USING itemlocdist
      JOIN invhist ON invhist_id = itemlocdist_invhist_id
    WHERE invdetail_invhist_id = invhist_id 
      AND itemlocdist_series = pItemlocSeries;

    DELETE FROM invhist WHERE invhist_series = pItemlocSeries;
    
    DELETE FROM itemlocpost WHERE itemlocpost_itemlocseries = pItemlocseries;
    
    DELETE FROM lsdetail 
    USING itemlocdist 
    WHERE lsdetail_source_id = itemlocdist_id
      AND itemlocdist_series = pItemlocSeries;
  END IF;
  
  RETURN _count;

END;
$$ LANGUAGE 'plpgsql';
  
       
