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

  SELECT distributeitemlocseries(itemlocdist_child_series) INTO _distCount
  FROM itemlocdist
    JOIN itemsite ON itemlocdist_itemsite_id = itemsite_id
  WHERE itemlocdist_series = pItemlocSeries
    AND itemlocdist_reqlotserial
    AND NOT itemsite_loccntrl;

  _distCountTotal := _distCountTotal + COALESCE(_distCount, 0);

  -- distributeToLocations the flagged itemlocdist records (itemlocdist_id array set in distributeInventory)
  FOR _r IN 
    SELECT itemlocdist_id
    FROM getallitemlocdist(pItemlocSeries)
    WHERE itemlocdist_reqdisttolocations LOOP
    
    _distCountTotal := _distCountTotal + COALESCE(distributeToLocations(_r.itemlocdist_id), 0);

    RAISE NOTICE '_distCountTotal: %', _distCountTotal;
  END LOOP;

  RAISE NOTICE 'postDistDetail _distCountTotal AFTER LOOP: %', _distCountTotal;

  IF _distCountTotal IS NULL THEN 
    RAISE EXCEPTION 'Error posting distribution detail. Should return a count of distributed records.
      [xtuple, postDistDetail, -1]';
  END IF;

  PERFORM postitemlocseries(pItemlocSeries);

  RETURN _distCountTotal;
END;
$$ LANGUAGE plpgsql;
