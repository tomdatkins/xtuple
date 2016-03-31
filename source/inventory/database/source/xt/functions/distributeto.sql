create or replace function xt.distributeto(pItemlocSeries	integer, pOrderId integer, pOrderType text) 
RETURNS boolean AS $$

declare

  _info RECORD;
  _detail RECORD;
  _distId INTEGER;
  _traceSeries INTEGER;
  _result BOOLEAN;
  _distCounter INTEGER;
  _qty NUMERIC;
  _lsId INTEGER;
  _i RECORD;
  _controlledItems BOOLEAN;

begin
	_controlledItems := FALSE;
  _result := FALSE;
  IF (pItemlocSeries < 0) THEN 
    RAISE EXCEPTION 'pItemlocSeries must be >= 0';
  END IF;

  IF (pOrderType = 'PO') THEN  
    RAISE NOTICE 'pOrderType = PO';
    SELECT TRUE INTO _controlledItems
    FROM  pohead
      JOIN poitem ON pohead_id = poitem_pohead_id
      JOIN itemsite ON poitem_itemsite_id = itemsite_id
      JOIN xt.recvdetail ON recvdetail_orderitem_id = poitem_id
    WHERE pohead_id = pOrderId
      and recvdetail_posted = false
      AND ((itemsite_controlmethod IN ('L', 'S')) OR (itemsite_loccntrl = true))
    LIMIT 1;
  ELSEIF (pOrderType = 'TO') THEN
    SELECT TRUE INTO _controlledItems
    FROM  tohead
      JOIN toitem ON tohead_id = toitem_tohead_id
      JOIN item ON toitem_item_id = item_id
      JOIN itemsite ON item_id = itemsite_item_id AND itemsite_warehous_id = tohead_dest_warehous_id
      JOIN xt.recvdetail ON recvdetail_orderitem_id = toitem_id
    WHERE tohead_id = pOrderId
      and recvdetail_posted = false
      AND ((itemsite_controlmethod IN ('L', 'S')) OR (itemsite_loccntrl = true))
    LIMIT 1;
  END IF;

  IF (_controlledItems = FALSE) THEN
    RAISE NOTICE 'items to be posted contain no controlled items';
    SELECT postitemlocseries(pItemLocSeries) INTO _result;
    RETURN _result;
  END IF;
  
  /* Check if itemlocdist record(s) already exist */
  SELECT itemlocdist_id,
    invhist_id,
    invhist_invqty,
    invhistsense(invhist_id) as sense, 
    itemsite_id,
    itemsite_controlmethod,
    itemsite_loccntrl, 
    count(*) AS rows INTO _info
  FROM itemlocdist, 
    invhist
    JOIN itemsite on itemsite_id = invhist_itemsite_id
  WHERE itemlocdist_series = pItemlocSeries
    AND invhist_series = pItemlocSeries
  GROUP BY itemlocdist_id,
    invhist_id,
    invhist_invqty,
    itemsite_id,
    itemsite_controlmethod,
    itemsite_loccntrl;

  RAISE NOTICE '_info.rows: %', _info.rows;

  /* We shouldn't have detail if there are no detail control settings turned on */
  IF (_info.rows IS NULL OR _info.rows = 0) THEN
    RAISE EXCEPTION 'No records found that are able to be distributed [xtuple: xt.distribute, -1]';
  ELSEIF (_info.rows > 1) THEN
    RAISE EXCEPTION 'Only distribute for one transaction at a time is supported [xtuple: xt.distribute, -2].';
  END IF;

  -- Cycle through detail records
  FOR _i IN  
    SELECT recvdetail_id,
      recvdetail_qty AS qty,
      recvdetail_location_id AS locId,
      recvdetail_lot AS lot,
      recvdetail_expiration AS expiration,
      recvdetail_warranty AS warranty
    FROM xt.recvdetail
    WHERE recvdetail_order_type = pOrderType
      AND recvdetail_orderhead_id = pOrderId
      AND NOT recvdetail_posted
      AND (recvdetail_lot != NULL::TEXT OR recvdetail_location_id IS NOT NULL)
  LOOP
    /* Validate quantity */
    RAISE NOTICE 'in _detail loop. _detail.qty: %', _i.qty;
    _qty := _qty + (_i.qty * _info.sense);
  END LOOP;

  -- End cycle through detail records
  IF (abs(_qty) != abs(_info.invhist_invqty)) THEN
    RAISE NOTICE 'abs(_qty) %: ', abs(_qty);
    RAISE NOTICE 'abs(_info.invhist_invqty) %: ', abs(_info.invhist_invqty);
    RAISE EXCEPTION 'Distribution quantity does not match transaction quantity. [xtuple: xt.distribute, -3]';
  END IF;

  /* Handle Lot/Serial controlled item */
  IF ((_info.itemsite_controlmethod = 'L') OR (_info.itemsite_controlmethod = 'S')) THEN
    SELECT nextval('itemloc_series_seq') INTO _traceSeries;

    -- Loop through detail records
    FOR _i IN 
      SELECT recvdetail_id,
        recvdetail_qty AS qty,
        recvdetail_location_id AS locId,
        recvdetail_lot AS lot,
        recvdetail_expiration AS expiration,
        recvdetail_warranty AS warranty
      FROM xt.recvdetail
      WHERE recvdetail_order_type = pOrderType
        AND recvdetail_orderhead_id = pOrderId
        AND NOT recvdetail_posted
    LOOP

      /* Serial controlled */
      IF (_info.itemsite_controlmethod = 'S') THEN
        SELECT ls_id INTO _lsId FROM (
          SELECT ls_id
          FROM itemloc join ls on itemloc_ls_id = ls_id
          WHERE ls_number = _i.lot
            AND itemloc_itemsite_id = _info.itemsite_id
          UNION ALL
          SELECT ls_id
          FROM itemlocdist JOIN ls on itemlocdist_ls_id = ls_id
          WHERE ls_number = _i.lot
            AND itemlocdist_itemsite_id = _info.itemsite_id
        ) AS query;
        
        IF (FOUND AND _i.qty = 1) THEN
          RAISE EXCEPTION 'Serial number % already exists in inventory. [xtuple: xt.distribute, -4]', pLot;
        ELSEIF (NOT FOUND AND (_i.qty = -1)) THEN
          RAISE EXCEPTION 'Serial number does not exist in inventory. [xtuple: xt.distribute, -5]';
        ELSEIF (pQty != -1 AND (_i.qty != 1)) THEN
          RAISE EXCEPTION 'Serial number quantity must be one. [xtuple: xt.distribute, -6]';
        END IF; 
      END IF; --serial item

      /* createlotserial(pItemsiteId integer, pLotSerial text, pItemlocSeries integer, 
          pSourceType text, pSourceId integer, pItemlocdistid integer, pQty numeric,
          pExpiration date, pWarranty date) */
      SELECT createlotserial(itemlocdist_itemsite_id, _i.lot::TEXT, _traceSeries::INTEGER, 'I'::TEXT, NULL::INTEGER, 
        itemlocdist_id::INTEGER, _i.qty::NUMERIC, COALESCE(_i.expiration, endoftime())::DATE, _i.warranty::DATE) INTO _distId
      FROM itemlocdist
      WHERE (itemlocdist_id=_info.itemlocdist_id);

      UPDATE itemlocdist
      SET itemlocdist_source_type = 'L',
        itemlocdist_source_id = _i.locId
      WHERE itemlocdist_id = _distId;
    END LOOP; -- End cycle through of detail records

    DELETE FROM itemlocdist WHERE itemlocdist_id = _info.itemlocdist_id;
  
    SELECT distributeitemlocseries(_traceSeries) INTO _distCounter;

  ELSEIF (_info.itemsite_loccntrl) THEN -- Location control without lot/serial
    FOR _i IN -- Cycle through detail records. Insert each into itemlocdist.
      SELECT recvdetail_id,
        recvdetail_qty AS qty,
        recvdetail_location_id AS locId,
        recvdetail_lot AS lot,
        recvdetail_expiration AS expiration,
        recvdetail_warranty AS warranty
      FROM xt.recvdetail
      WHERE recvdetail_order_type = pOrderType
        AND recvdetail_orderhead_id = pOrderId
        AND NOT recvdetail_posted
    LOOP
      INSERT INTO itemlocdist (itemlocdist_itemlocdist_id, itemlocdist_source_type, 
        itemlocdist_source_id, itemlocdist_qty, itemlocdist_expiration, itemlocdist_itemsite_id, 
        itemlocdist_series, itemlocdist_invhist_id )
      VALUES (_info.itemlocdist_id, 'L', _i.locId, _i.qty, COALESCE(_i.expiration, endoftime()), _info.itemsite_id, pItemlocSeries, _info.invhist_id);
    END LOOP; -- End cycle through detail records

    PERFORM distributeitemlocseries(pItemlocSeries);
  END IF;

  -- Wrap up
  SELECT postitemlocseries(pItemLocSeries) INTO _result;
  RETURN _result;
end
$$ language 'plpgsql' volatile;
