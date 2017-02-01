CREATE OR REPLACE FUNCTION deleteItemlocSeries(pItemlocSeries INTEGER, pFailed BOOLEAN DEFAULT FALSE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r          RECORD;
  _count      INTEGER := 0;

BEGIN
  IF (pItemlocSeries IS NULL) THEN
    RAISE EXCEPTION 'Transaction series must be provided. [xtuple: deleteitemlocdist, -1, %]', pItemlocSeries;
  END IF;

  IF (EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'deleteitemlocdist')) THEN
    PERFORM deleteitemlocdist(itemlocdist_id) 
    FROM getallitemlocdist(pItemlocSeries);
    
    GET DIAGNOSTICS _count = ROW_COUNT;
  ELSE    
    DELETE FROM itemlocdist 
    USING getallitemlocdist(pItemlocSeries) AS ilds 
    WHERE ilds.itemlocdist_id = itemlocdist.itemlocdist_id;
    
    GET DIAGNOSTICS _count = ROW_COUNT;
  END IF;

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
$$ LANGUAGE plpgsql;
  
       
