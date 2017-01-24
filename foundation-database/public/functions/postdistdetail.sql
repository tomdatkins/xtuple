CREATE OR REPLACE FUNCTION postDistDetail(pItemlocSeries   INTEGER,
                                        pInvhistId        INTEGER,
                                        pLotSerialCntrld  BOOLEAN,
                                        pLocCntrld        BOOLEAN)
  RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
-- pInvhistid is passed with all "non-locking" inventory transactions (before incident #22868 fix)
DECLARE
  _r            RECORD;
  _series       RECORD;
  _distCounter  INTEGER := 0;

BEGIN 
  IF (pLotSerialCntrld = FALSE AND pLocCntrld = FALSE) THEN 
    IF (SELECT postitemlocseries(pItemlocSeries)) THEN
      RETURN 1;
    ELSE 
      RETURN 0;
    END IF;
  END IF;

  -- For all the itemlocdist records with itemlocdist_series values:
  --  - update the itemlocdist_invhist_id if passed
  FOR _r IN 
    SELECT * FROM getallitemlocdist(pItemlocSeries)
  LOOP
    IF (_r.itemlocdist_series IS NOT NULL) THEN
      UPDATE itemlocdist
      SET itemlocdist_invhist_id = pInvhistid
      WHERE pInvhistid IS NOT NULL
        AND _r.itemlocdist_invhist_id IS NULL
        AND itemlocdist_id = _r.itemlocdist_id;
    END IF;
  END LOOP;
  
  -- For all unique itemlocdist_series, call distributeItemlocSeries
  FOR _series IN 
    SELECT DISTINCT(itemlocdist_series) AS itemlocdist_series
    FROM getallitemlocdist(pItemlocSeries) 
    WHERE itemlocdist_series IS NOT NULL LOOP

    RAISE NOTICE '_series.itemlocdist_series: %', _series.itemlocdist_series; 
    
    SELECT distributeitemlocseries(_series.itemlocdist_series) + _distCounter INTO _distCounter; 
    RAISE NOTICE '_distCounter after distributeitemlocseries: %', _distCounter;
    
    SELECT distributeToLocations(itemlocdist_id) + _distCounter INTO _distCounter
    FROM itemlocdist
    WHERE itemlocdist_series = _series.itemlocdist_series;
  END LOOP;

  PERFORM postitemlocseries(pItemlocSeries);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'postItemlocSeries did not return any results for pItemlocSeries % '
      '[xtuple: postDistDetail, -4, %]', pItemlocSeries, pItemlocSeries;
  END IF; 
  
  RETURN _distCounter;

END;
$$ LANGUAGE 'plpgsql';
