drop function if exists xt.enterreceiptdetail(text, integer, integer, numeric, integer, text, date);
drop function if exists xt.enterreceiptdetail(text, integer, integer, numeric, integer, text, date, date);
drop function if exists xt.enterreceiptdetail(text, integer, integer, numeric, integer, text, date, date, integer);

create or replace function xt.distributedetail(pOrderType	text, pOrderId integer, pOrderItemId integer,
  pQty	numeric, pLocId integer, pLot text, pExpDate	date, pWarrDate date, pItemsiteId integer) 
RETURNS integer AS $$

declare

  _detRecCount integer;
  _existingQtyRecvd numeric;
  _calcQtyToRecv numeric;
  _qtyToRecv numeric;
  _result integer;

begin
  _result := 0;
	/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */
  _qtyToRecv := pQty;

  SELECT sum(distdetail_qty) AS sumqty, count(*) AS count INTO _existingQtyRecvd, _detRecCount
  FROM xt.distdetail 
  WHERE distdetail_order_type = pOrderType
    AND distdetail_orderhead_id = pOrderId
    AND distdetail_orderitem_id = pOrderItemId
    AND distdetail_lot = pLot
    AND COALESCE(distdetail_location_id, -1) = COALESCE(pLocId, -1)
    AND distdetail_itemsite_id = pItemsiteId
  GROUP BY distdetail_orderhead_id, distdetail_orderitem_id;

  IF FOUND THEN
    IF (_detRecCount > 1) THEN 
    	RAISE EXCEPTION 'Duplicate distdetail records found! Can not Enter Receipt.
    		[xtuple: xt.distributedetail, -1]';
    ELSE
      _qtyToRecv := _existingQtyRecvd + pQty;
      RAISE NOTICE '_qtyToRecv: %', _qtyToRecv;
      IF (_qtyToRecv < 0) THEN 
        RAISE EXCEPTION 'Can not receive negative qty! [xtuple: xt.distributedetail, -2]'; 
      ELSEIF (_qtyToRecv = 0) THEN 
        DELETE 
        FROM xt.distdetail 
        WHERE distdetail_order_type = pOrderType
          AND distdetail_orderhead_id = pOrderId
          AND distdetail_orderitem_id = pOrderItemId
          AND distdetail_lot = pLot
          AND COALESCE(distdetail_location_id, -1) = COALESCE(pLocId, -1);
      ELSE
        UPDATE xt.distdetail
        SET distdetail_qty = _qtyToRecv
        WHERE distdetail_order_type = pOrderType
          AND distdetail_orderhead_id = pOrderId
          AND distdetail_orderitem_id = pOrderItemId
          AND distdetail_lot = pLot
          AND COALESCE(distdetail_location_id, -1) = COALESCE(pLocId, -1);
      END IF;
    END IF;
  ELSEIF NOT FOUND THEN 
    INSERT INTO xt.distdetail (distdetail_order_type, distdetail_orderhead_id,
      distdetail_orderitem_id, distdetail_qty, distdetail_location_id, distdetail_lot,
      distdetail_expiration, distdetail_warranty, distdetail_itemsite_id)
    VALUES (pOrderType, pOrderId, pOrderItemId, _qtyToRecv, pLocId, pLot, pExpDate::DATE,
      pWarrDate::DATE, pItemsiteId);
  END IF;

  IF (pOrderType = 'PO') THEN
    -- Enter Receipt overrides prev. receipts with new qty so get the sum qty from the detail
    SELECT sum(distdetail_qty) INTO _qtyToRecv
    FROM xt.distdetail 
    WHERE distdetail_orderhead_id = pOrderId
      AND distdetail_orderitem_id = pOrderItemId
    GROUP BY distdetail_orderhead_id;

    -- enterreceipt(orderType, orderItemId, qty, freight, notes, currId, recvDate, recvCost)
    SELECT enterreceipt(pOrderType, pOrderItemId, _qtyToRecv, 0, NULL::TEXT, NULL::INTEGER,
      current_date, NULL::NUMERIC) INTO _result;
  END IF;

  RETURN _result;
end
$$ language 'plpgsql' volatile;
