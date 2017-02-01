CREATE OR REPLACE FUNCTION createItemlocdistParent( 
  pItemsiteid INTEGER, 
  pQty NUMERIC, 
  pOrderType TEXT, 
  pOrderNumber TEXT, 
  pItemlocSeries INTEGER,
  pInvhistId INTEGER DEFAULT NULL
) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _itemlocdistId  INTEGER := NULL;
  _r              RECORD;
BEGIN
  --  Cache item and itemsite info  
  SELECT itemsite_controlmethod IN ('L', 'S') AS lscntrl,
         itemsite_loccntrl AS loccntrl INTO _r
  FROM itemsite 
    JOIN item ON item_id = itemsite_item_id
  WHERE itemsite_id=pItemsiteid;

  IF (NOT _r.lscntrl AND NOT _r.loccntrl) THEN
    RAISE EXCEPTION 'Itemsite Must be Lot/Serial or Location Controlled. 
      [xtuple: createItemlocdistParent, -1, %]', pItemsiteid;
  END IF;

  IF (pOrderType IS NULL OR pOrderNumber IS NULL) THEN 
    RAISE EXCEPTION 'Cant be NULL: %, %', pOrderType, pOrderNumber;
  END IF;

  IF (pItemlocSeries IS NULL) THEN
    RAISE EXCEPTION 'Series is required. 
      [xtuple: createItemlocdistParent, -1, %]', pItemlocSeries;
  END IF;

  -- Create the parent itemlocdist record using the series passed
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
    itemlocdist_order_id,
    itemlocdist_child_series )
  SELECT pItemsiteid,
    'O',
    ((pQty > 0) AND _r.lscntrl),
    (pQty < 0),
    endOfTime(),
    pQty,
    pItemlocSeries,
    pInvhistId,
    pOrderType,
    CASE WHEN pOrderType='SO' THEN getSalesLineItemId(pOrderNumber)
      ELSE NULL
    END,
    pItemlocSeries
  RETURNING itemlocdist_id INTO _itemlocdistId;
  
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Failed to Create Parent Itemlocdist Record. 
      [xtuple: createItemlocdistParent, -2]';
  END IF;

  RETURN _itemlocdistId;
END;
$$ LANGUAGE plpgsql;
