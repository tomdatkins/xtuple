CREATE OR REPLACE FUNCTION createItemlocdistSeries( 
  pItemsiteid INTEGER, 
  pQty NUMERIC, 
  pOrderType TEXT, 
  pOrderNumber TEXT, 
  pItemlocSeries INTEGER DEFAULT NULL,
  pInvhistId INTEGER DEFAULT NULL
) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _series     INTEGER;
  _r          RECORD;
BEGIN
  --  Cache item and itemsite info  
  SELECT itemsite_costmethod,
         itemsite_qtyonhand, 
         itemsite_warehous_id,
         itemsite_controlmethod IN ('L', 'S') AS lscntrl,
         itemsite_loccntrl AS loccntrl,
         itemsite_freeze AS frozen INTO _r
  FROM itemsite 
    JOIN item ON item_id = itemsite_item_id
  WHERE itemsite_id=pItemsiteid;

  IF (_r.lscntrl OR _r.loccntrl) THEN
    --  Distribute this if this itemsite is controlled
    INSERT INTO itemlocdist
    ( itemlocdist_itemsite_id,
      itemlocdist_source_type,
      itemlocdist_reqlotserial,
      itemlocdist_distlotserial,
      itemlocdist_expiration,
      itemlocdist_qty,
      itemlocdist_series,
      itemlocdist_invhist_id,
      itemlocdist_order_type,
      itemlocdist_order_id )
    SELECT pItemsiteid,
      'O',
      ((pQty > 0)  AND _r.lscntrl),
      (pQty < 0),
      endOfTime(),
      pQty,
      COALESCE(pItemlocSeries, nextval('itemloc_series_seq')),
      pInvhistId,
      pOrderType,
      CASE WHEN pOrderType='SO' THEN getSalesLineItemId(pOrderNumber)
        ELSE NULL
      END
    RETURNING itemlocdist_series INTO _series;

    IF ((_series != pItemlocSeries) OR (_series IS NULL)) THEN
      RAISE EXCEPTION 'The Resulting itemlocdist_series (%) Does Not Match the Series Passed (%)'
        '[xtuple: createItemlocdistSeries]', _series, pItemlocSeries;
    END IF;


  END IF;

  SELECT COALESCE(_series, nextval('itemloc_series_seq')) INTO _series;
  RETURN _series;

END;
$$ LANGUAGE plpgsql;
