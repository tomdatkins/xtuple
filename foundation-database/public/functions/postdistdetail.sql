CREATE OR REPLACE FUNCTION postDistDetail(pItemlocSeries   INTEGER,
                                        pInvhistId        INTEGER)
  RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
-- pInvhistid is passed with all "non-locking" inventory transactions (before incident #22868 fix)
DECLARE
  _distCount      INTEGER := 0;
  _distCountTotal INTEGER := 0;
  _r              RECORD;

BEGIN 
  -- For all the itemlocdist records with itemlocdist_series values, 
  -- update the itemlocdist_invhist_id if passed.
  UPDATE itemlocdist ild
  SET itemlocdist_invhist_id = pInvhistid
  FROM getallitemlocdist(pItemlocSeries) AS ilds
  WHERE pInvhistid IS NOT NULL
    AND ild.itemlocdist_invhist_id IS NULL
    AND ild.itemlocdist_series IS NOT NULL
    AND ild.itemlocdist_id = ilds.itemlocdist_id;

  FOR _r IN 
    SELECT DISTINCT itemlocdist_child_series AS series
    FROM itemlocdist 
      JOIN itemsite ON itemlocdist_itemsite_id = itemsite_id
    WHERE itemlocdist_series = pItemlocSeries
      AND itemsite_controlmethod IN ('L', 'S')
      AND itemlocdist_qty > 0
      AND itemlocdist_child_series IS NOT NULL LOOP

    _distCount := distributeItemlocSeries(_r.series);

    _distCountTotal := _distCountTotal + COALESCE(_distCount, 0);

  END LOOP;

  FOR _r IN 
    SELECT itemlocdist_id
    FROM itemlocdist
      JOIN itemsite ON itemlocdist_itemsite_id = itemsite_id
    WHERE itemlocdist_series = pItemlocSeries
      AND NOT (itemsite_controlmethod IN ('L', 'S') AND itemlocdist_qty > 0) LOOP

    _distCount := distributetolocations(_r.itemlocdist_id);

    _distCountTotal := _distCountTotal + COALESCE(_distCount, 0);  

  END LOOP;

  PERFORM postitemlocseries(pItemlocSeries);

  RETURN _distCountTotal;
END;
$$ LANGUAGE plpgsql;
