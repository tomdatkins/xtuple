drop function if exists xt.enterreceiptdetail(text, integer, integer, numeric, integer, text, date);
drop function if exists xt.enterreceiptdetail(text, integer, integer, numeric, integer, text, date, date);
drop function if exists xt.enterreceiptdetail(text, integer, integer, numeric, integer, text, date, date, integer);

create or replace function xt.distributedetail(pOrderType	text, pOrderId integer, pOrderItemId integer,
  pQty	numeric, pLocId integer, pLot text, pExpDate	date, pWarrDate date, pItemsiteId integer) 
RETURNS integer AS $$

declare
  _qtyToRecv numeric;
begin
	/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

  UPDATE xt.distdetail
  SET distdetail_qty = distdetail_qty + pQty
  WHERE distdetail_order_type = pOrderType
    AND distdetail_orderhead_id = pOrderId
    AND distdetail_orderitem_id = pOrderItemId
    AND distdetail_lot = pLot
    AND distdetail_itemsite_id = pItemsiteId
    AND COALESCE(distdetail_location_id, -1) = COALESCE(pLocId, -1)
  RETURNING distdetail_qty INTO STRICT _qtyToRecv;

  IF _qtyToRecv < 0 THEN 
    RAISE EXCEPTION 'Can not receive negative qty! [xtuple: xt.distributedetail, -1]';
  ELSEIF _qtyToRecv = 0 THEN
    DELETE 
      FROM xt.distdetail 
      WHERE distdetail_order_type = pOrderType
        AND distdetail_orderhead_id = pOrderId
        AND distdetail_orderitem_id = pOrderItemId
        AND distdetail_lot = pLot
        AND distdetail_itemsite_id = pItemsiteId
        AND COALESCE(distdetail_location_id, -1) = COALESCE(pLocId, -1);
  END IF;

  RETURN 0;

  EXCEPTION
    WHEN TOO_MANY_ROWS THEN -- If >1 rows, throw error
      RAISE EXCEPTION 'Duplicate distdetail records found! Can not Enter Receipt.
        [xtuple: xt.distributedetail, -2]';
    WHEN NO_DATA_FOUND THEN
      INSERT INTO xt.distdetail (distdetail_order_type, distdetail_orderhead_id,
        distdetail_orderitem_id, distdetail_qty, distdetail_location_id, distdetail_lot,
        distdetail_expiration, distdetail_warranty, distdetail_itemsite_id)
      VALUES (pOrderType, pOrderId, pOrderItemId, pQty, pLocId, pLot, pExpDate::DATE,
        pWarrDate::DATE, pItemsiteId);
      RETURN 1; 
end
$$ language 'plpgsql' volatile;
