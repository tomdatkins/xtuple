drop function if exists xt.enterreceiptdetail(text, integer, integer, numeric, integer, text, date);
drop function if exists xt.enterreceiptdetail(text, integer, integer, numeric, integer, text, date, date);

create or replace function xt.enterreceiptdetail(pOrderType	text, pOrderId integer, pOrderItemId integer,
  pQty	numeric, pLocId integer, pLot text, pExpDate	date, pWarrDate date, pItemsiteId integer) 
RETURNS integer AS $$

declare

  _detRecCount integer;
  _existingQtyRecvd numeric;
  _calcQtyToRecv numeric;
  _qtyToRecv numeric;
  _result integer;

begin
	/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */
  _qtyToRecv := pQty;

  SELECT sum(recvdetail_qty) AS sumqty, count(*) AS count INTO _existingQtyRecvd, _detRecCount
  FROM xt.recvdetail 
  WHERE recvdetail_order_type = pOrderType
    AND recvdetail_orderhead_id = pOrderId
    AND recvdetail_orderitem_id = pOrderItemId
    AND recvdetail_lot = pLot
    AND COALESCE(recvdetail_location_id, -1) = COALESCE(pLocId, -1)
    AND recvdetail_itemsite_id = pItemsiteId
    AND NOT recvdetail_posted
  GROUP BY recvdetail_orderhead_id, recvdetail_orderitem_id;

  IF FOUND THEN
    IF (_detRecCount > 1) THEN 
    	RAISE EXCEPTION 'Duplicate recvdetail records found! Can not Enter Receipt.
    		[xtuple: xt.enterreceiptdetail, -1]';
    ELSE
      _qtyToRecv := _existingQtyRecvd + pQty;
      IF (_qtyToRecv < 0) THEN 
        RAISE EXCEPTION 'Can not receive negative qty! [xtuple: xt.enterreceiptdetail, -2]'; 
      ELSEIF (_qtyToRecv = 0) THEN 
        DELETE 
        FROM xt.recvdetail 
        WHERE recvdetail_order_type = pOrderType
          AND recvdetail_orderhead_id = pOrderId
          AND recvdetail_orderitem_id = pOrderItemId
          AND recvdetail_lot = pLot
          AND COALESCE(recvdetail_location_id, -1) = COALESCE(pLocId, -1)
          AND NOT recvdetail_posted;
      ELSE
        UPDATE xt.recvdetail
        SET recvdetail_qty = _qtyToRecv
        WHERE recvdetail_order_type = pOrderType
          AND recvdetail_orderhead_id = pOrderId
          AND recvdetail_orderitem_id = pOrderItemId
          AND recvdetail_lot = pLot
          AND COALESCE(recvdetail_location_id, -1) = COALESCE(pLocId, -1)
          AND NOT recvdetail_posted;
      END IF;
    END IF;
  ELSEIF NOT FOUND THEN 
    INSERT INTO xt.recvdetail (recvdetail_order_type, recvdetail_orderhead_id,
      recvdetail_orderitem_id, recvdetail_qty, recvdetail_location_id, recvdetail_lot,
      recvdetail_expiration, recvdetail_warranty, recvdetail_posted, recvdetail_itemsite_id)
    VALUES ('PO', pOrderId, pOrderItemId, _qtyToRecv, pLocId, pLot, pExpDate::DATE,
      pWarrDate::DATE, false, pItemsiteId);
  END IF;

  -- enterreceipt(orderType, orderItemId, qty, freight, notes, currId, recvDate, recvCost)
  SELECT enterreceipt(pOrderType, pOrderItemId, _qtyToRecv, 0, NULL::TEXT, NULL::INTEGER,
    current_date, NULL::NUMERIC) INTO _result;

  RETURN _result;
end
$$ language 'plpgsql' volatile;
