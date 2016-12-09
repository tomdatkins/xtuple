CREATE OR REPLACE FUNCTION createItemlocdistSeries( pItemsiteid INTEGER, pQty NUMERIC, pOrderType TEXT, pOrderNumber TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _series  INTEGER;
  _r                  RECORD;
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
    nextval('itemloc_series_seq'),
    NULL, --invhist_id, to be updated through public.postdistdetail function later
    pOrderType,
    CASE WHEN pOrderType='SO' THEN getSalesLineItemId(pOrderNumber)
      ELSE NULL
    END
  WHERE _r.lscntrl OR _r.loccntrl
  RETURNING itemlocdist_series INTO _series;
  
  RETURN _series;

END;
$$ LANGUAGE plpgsql;
