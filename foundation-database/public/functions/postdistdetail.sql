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

BEGIN 
  IF (NOT pLotSerialCntrld AND NOT pLocCntrld) THEN 
    IF (SELECT postitemlocseries(pItemlocSeries)) THEN
      RETURN 1;
    ELSE 
      RETURN 0;
    END IF;
  END IF;

  -- For all the itemlocdist records with itemlocdist_series values, 
  -- update the itemlocdist_invhist_id if passed.
  UPDATE itemlocdist ild
  SET itemlocdist_invhist_id = pInvhistid
  FROM getallitemlocdist(pItemlocSeries) AS ilds
  WHERE pInvhistid IS NOT NULL
    AND ild.itemlocdist_invhist_id IS NULL
    AND ild.itemlocdist_series IS NOT NULL
    AND ild.itemlocdist_id = ilds.itemlocdist_id;

  FOR _series IN 
    SELECT DISTINCT itemlocdist_child_series, itemlocdist_qty, itemlocdist_reqlotserial
    FROM itemlocdist 
    WHERE itemlocdist_series = pItemlocSeries 
      AND itemlocdist_child_series IS NOT NULL
    LOOP

    IF (_series.itemlocdist_reqlotserial) THEN 
      
      IF (pLocCntrld) THEN

        PERFORM distributeToLocations(itemlocdist_id)
        FROM itemlocdist
        WHERE itemlocdist_series = _series.itemlocdist_child_series;
      ELSEIF (NOT pLocCntrld) THEN

        PERFORM distributeitemlocseries(itemlocdist_series)
        FROM itemlocdist
        WHERE itemlocdist_series = _series.itemlocdist_child_series;
      END IF;
    ELSEIF (NOT _series.itemlocdist_reqlotserial) THEN
      
      IF (_series.itemlocdist_qty > 0) THEN 
        RAISE EXCEPTION 'Expected itemlocdist_qty > 0 When Not itemlocdist_reqlotserial 
          [xtuple, postDistDetail, -1]';
      END IF;

      PERFORM distributeToLocations(itemlocdist_id)
      FROM itemlocdist
      WHERE itemlocdist_series = pItemlocSeries;

    END IF;
    
  END LOOP;

  PERFORM postitemlocseries(pItemlocSeries);

  RETURN 1;

END;
$$ LANGUAGE plpgsql;
