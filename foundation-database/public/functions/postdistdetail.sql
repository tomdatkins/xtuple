CREATE OR REPLACE FUNCTION postDistDetail(pItemlocSeries   INTEGER, 
                                        pInvhistId        INTEGER,
                                        pLotSerialCntrld  BOOLEAN,
                                        pLocCntrld        BOOLEAN)
  RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
-- pInvhistid is the original transaction to be returned, reversed, etc.
DECLARE
  _parent      RECORD;
  _result INTEGER;
  _children RECORD;

BEGIN 

  IF (pLotSerialCntrld = FALSE AND pLocCntrld = FALSE) THEN 
    IF (SELECT postitemlocseries(pItemlocSeries)) THEN
      RETURN 1;
    ELSE 
      RETURN 0;
    END IF;
  END IF;

  SELECT itemlocdist_child_series, itemlocdist_id, itemlocdist_qty INTO _parent
  FROM itemlocdist 
  WHERE itemlocdist_series = pItemlocSeries;

  -- Set the invhist_id for parent itemlocdist record
  UPDATE itemlocdist SET itemlocdist_invhist_id = pInvhistId 
  WHERE itemlocdist_series = pItemlocSeries 
    AND pInvhistId IS NOT NULL 
    AND itemlocdist_invhist_id IS NULL;

  RAISE NOTICE 'itemlocdist_child_series: %, itemlocdist_qty: %', _parent.itemlocdist_child_series,
    _parent.itemlocdist_qty;
  IF (NOT FOUND OR _parent.itemlocdist_qty IS NULL) THEN
    RAISE EXCEPTION 'No itemlocdist record found for pItemlocSeries % [xtuple: postDistDetail, -1, %]',
      pItemlocSeries, pItemlocSeries;
  END IF;

  FOR _children IN 
    SELECT itemlocdist_id FROM itemlocdist 
    WHERE itemlocdist_series = COALESCE(_parent.itemlocdist_child_series, pItemlocSeries)
  LOOP
    -- Set the invhist_id for children itemlocdist record
    UPDATE itemlocdist SET itemlocdist_invhist_id = COALESCE(pInvhistId, itemlocdist_invhist_id)   
    WHERE itemlocdist_id = _children.itemlocdist_id;
    
    IF (pLocCntrld) THEN
      PERFORM distributetolocations(COALESCE(_children.itemlocdist_id, _parent.itemlocdist_id))
      FROM itemlocdist 
      WHERE itemlocdist_series = _parent.itemlocdist_child_series;

      IF (NOT FOUND) THEN
        RAISE EXCEPTION 'distributeToLocations(%) did not return any results for pItemlocSeries %'
          '[xtuple: postDistDetail, -2, %]', COALESCE(_children.itemlocdist_id, _parent.itemlocdist_id),
          pItemlocSeries, COALESCE(_children.itemlocdist_id, _parent.itemlocdist_id), pItemlocSeries;
      END IF;
    END IF;

  END LOOP;

  IF (pLotSerialCntrld AND pLocCntrld = FALSE) THEN
    PERFORM distributeitemlocseries(itemlocdist_child_series)
    FROM itemlocdist
    WHERE itemlocdist_series = pItemlocSeries;

    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'distributeItemlocSeries did not return any results for pItemlocSeries % '
        '[xtuple: postDistDetail, -3, %]', pItemlocSeries, pItemlocSeries;
    END IF;
  END IF;

  PERFORM postitemlocseries(pItemlocSeries);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'postItemlocSeries did not return any results for pItemlocSeries % '
      '[xtuple: postDistDetail, -4]', pItemlocSeries, pItemlocSeries;
  END IF;
  
  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
