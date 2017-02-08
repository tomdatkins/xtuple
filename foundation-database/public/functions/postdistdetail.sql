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

  -- Positive qty, lot/serial controlled:
  FOR _r IN 
    SELECT DISTINCT itemlocdist_child_series, itemsite_loccntrl
    FROM itemlocdist 
      JOIN itemsite ON itemlocdist_itemsite_id = itemsite_id
    WHERE itemlocdist_series = pItemlocSeries
      AND itemlocdist_child_series IS NOT NULL 
      AND itemsite_controlmethod IN ('L', 'S') 
      AND itemlocdist_qty > 0 LOOP

    IF (_r.itemsite_loccntrl) THEN 
      SELECT distributeToLocations(itemlocdist_id) INTO _distCount
      FROM itemlocdist
      WHERE itemlocdist_series = _r.itemlocdist_child_series;

      IF COALESCE(_distCount, 0) = 0 THEN
        RAISE EXCEPTION 'Expected a Count of the Distribution Detail Records Posted but 
          distributeToLocations returned % for ls and location controlled item with qty > 0 
          [xtuple: postDistDetail, -1, %]', _distCount, _distCount;
      END IF;

    ELSE
      _distCount := distributeItemlocSeries(_r.itemlocdist_child_series);

      IF COALESCE(_distCount, 0) = 0 THEN
        RAISE EXCEPTION 'Expected a Count of the Distribution Detail Records Posted but 
          distributeItemlocSeries(%) returned: % [xtuple: postDistDetail, -2, %, %]', 
          _r.itemlocdist_child_series, _distCount, _r.itemlocdist_child_series, _distCount;
      END IF;
    END IF;

    _distCountTotal := _distCountTotal + COALESCE(_distCount, 0);
  END LOOP;

  -- Negative qty OR ONLY location controlled:
  FOR _r IN 
    SELECT itemlocdist_id
    FROM itemlocdist 
      JOIN itemsite ON itemlocdist_itemsite_id = itemsite_id
    WHERE itemlocdist_series = pItemlocSeries
      AND (itemlocdist_qty < 0 OR (itemsite_loccntrl AND NOT itemsite_controlmethod IN ('L', 'S'))) LOOP

    _distCount := distributeToLocations(_r.itemlocdist_id);
    
    IF COALESCE(_distCount, 0) = 0 THEN
      RAISE EXCEPTION 'Expected a Count of the Distribution Detail Records Posted but 
          distributeToLocations(%) returned: % [xtuple: postDistDetail, -3, %, %]', 
          _r.itemlocdist_id, _distCount, _r.itemlocdist_id, _distCount;
    END IF;

    _distCountTotal := _distCountTotal + COALESCE(_distCount, 0);
  END LOOP;

  IF COALESCE(_distCountTotal,0) = 0 AND (SELECT true FROM itemlocdist WHERE itemlocdist_series = pItemlocSeries LIMIT 1) THEN 
    RAISE EXCEPTION 'Expected a Total Count of Distributed Detail. [xtuple: postDistDetail, -4]';
  END IF;
 
  PERFORM postitemlocseries(pItemlocSeries);

  RETURN _distCountTotal;
END;
$$ LANGUAGE plpgsql;
