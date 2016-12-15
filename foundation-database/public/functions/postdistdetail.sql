CREATE OR REPLACE FUNCTION postDistDetail(pItemlocSeries   INTEGER, 
                                        pInvhistId        INTEGER,
                                        pLotSerialCntrld  BOOLEAN,
                                        pLocCntrld        BOOLEAN)
  RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
-- pInvhistid is the original transaction to be returned, reversed, etc.
DECLARE
  _r      RECORD;
  _result INTEGER;

BEGIN 

  IF (pLotSerialCntrld = FALSE AND pLocCntrld = FALSE) THEN 
    RAISE NOTICE '!pLotSerialCntrld AND !pLocCntrld';
    IF (SELECT postitemlocseries(pItemlocSeries)) THEN
      RETURN 1;
    ELSE 
      RETURN 0;
    END IF;
  END IF;

  -- Set the invhist_id for parent itemlocdist record
  UPDATE itemlocdist SET itemlocdist_invhist_id = COALESCE(pInvhistId, itemlocdist_invhist_id)
  WHERE itemlocdist_series = pItemlocSeries
  RETURNING itemlocdist_child_series, itemlocdist_qty INTO _r;
  
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'No itemlocdist record found for pItemlocSeries % [xtuple: postDistDetail]', pItemlocSeries;
  ELSEIF ((SELECT count(_r.*)) > 1) THEN
    RAISE EXCEPTION 'Multiple itemlocdist records found for pItemlocSeries % [xtuple: postDistDetail]', pItemlocSeries;
  END IF;

  -- Set the invhist_id for children itemlocdist record
  UPDATE itemlocdist SET itemlocdist_invhist_id = COALESCE(pInvhistId, itemlocdist_invhist_id)   
  WHERE itemlocdist_series = _r.itemlocdist_child_series;
  IF (NOT FOUND) THEN 
    RAISE EXCEPTION 'No itemlocdist record found for pItemlocSeries % [xtuple: postDistDetail]', pItemlocSeries;
  END IF;

  IF (pLotSerialCntrld AND pLocCntrld = FALSE) THEN
    PERFORM distributeitemlocseries(itemlocdist_child_series)
    FROM itemlocdist
    WHERE itemlocdist_series = pItemlocSeries;

    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'distributeItemlocSeries did not return any results for pItemlocSeries % [xtuple: postDistDetail]', pItemlocSeries;
    END IF;
  END IF;

  IF (pLocCntrld OR _r.itemlocdist_qty < 0) THEN
    PERFORM distributetolocations(itemlocdist_id)
    FROM itemlocdist 
    WHERE itemlocdist_series = _r.itemlocdist_child_series;

    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'distributeToLocations did not return any results for pItemlocSeries % [xtuple: postDistDetail]', pItemlocSeries;
    END IF;
  END IF;

  PERFORM postitemlocseries(pItemlocSeries);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'postItemlocSeries did not return any results for pItemlocSeries % [xtuple: postDistDetail]', pItemlocSeries;
  END IF;
  
  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
