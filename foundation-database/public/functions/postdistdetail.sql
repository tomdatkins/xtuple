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
  RETURNING itemlocdist_child_series, itemlocdist_id, itemlocdist_qty INTO _parent;

  RAISE NOTICE 'itemlocdist_child_series: %, itemlocdist_qty: %', _parent.itemlocdist_child_series,
    _parent.itemlocdist_qty;
  IF (NOT FOUND OR _parent.itemlocdist_qty IS NULL) THEN
    RAISE EXCEPTION 'No itemlocdist record found for pItemlocSeries % [xtuple: postDistDetail]',
      pItemlocSeries;
  END IF;
  
  -- Set the invhist_id for children itemlocdist record
  UPDATE itemlocdist SET itemlocdist_invhist_id = COALESCE(pInvhistId, itemlocdist_invhist_id)   
  WHERE itemlocdist_series = COALESCE(_parent.itemlocdist_child_series, pItemlocSeries)
  RETURNING itemlocdist_itemlocdist_id, itemlocdist_id INTO _children;
  RAISE NOTICE '_children %', _children;
  RAISE NOTICE '_children %', _children.itemlocdist_itemlocdist_id;
  RAISE NOTICE '_children %', _children.itemlocdist_id;

  IF (NOT FOUND) THEN 
    RAISE EXCEPTION 'No itemlocdist record found for pItemlocSeries %, '
      '_children % [xtuple: postDistDetail]', pItemlocSeries, _children;
  END IF;

  IF (pLocCntrld) THEN -- OR _parent.itemlocdist_qty < 0
    RAISE NOTICE 'pLocCntrld = true, distributetolocations';
    RAISE NOTICE 'distributetolocations(%) where itemlocdist_series = %',
      COALESCE(_children.itemlocdist_id, _parent.itemlocdist_id),
      _parent.itemlocdist_child_series;
    PERFORM distributetolocations(COALESCE(_children.itemlocdist_id, _parent.itemlocdist_id))
    FROM itemlocdist 
    WHERE itemlocdist_series = _parent.itemlocdist_child_series;

    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'distributeToLocations(%) did not return any results for pItemlocSeries %'
        '[xtuple: postDistDetail]', COALESCE(_children.itemlocdist_id, _parent.itemlocdist_id),
        pItemlocSeries;
    END IF;
  END IF;

  IF (pLotSerialCntrld AND pLocCntrld = FALSE) THEN
    RAISE NOTICE 'pLotSerialCntrld AND pLocCntrld = FALSE. distributeitemlocseries()';
    PERFORM distributeitemlocseries(itemlocdist_child_series)
    FROM itemlocdist
    WHERE itemlocdist_series = pItemlocSeries;

    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'distributeItemlocSeries did not return any results for pItemlocSeries % '
        '[xtuple: postDistDetail]', pItemlocSeries;
    END IF;
  END IF;

  PERFORM postitemlocseries(pItemlocSeries);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'postItemlocSeries did not return any results for pItemlocSeries % '
      '[xtuple: postDistDetail]', pItemlocSeries;
  END IF;
  
  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
