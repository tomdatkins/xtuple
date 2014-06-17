CREATE OR REPLACE FUNCTION xwd._recvTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _costelemid INTEGER := 0;
  _pickqty    NUMERIC := 0.0;
  _coitem     RECORD;
  _toitem     RECORD;

BEGIN
  IF (OLD.recv_posted = FALSE AND NEW.recv_posted = TRUE) THEN

    -- update actual cost at time of receipt
    SELECT costelem_id INTO _costelemid
    FROM costelem WHERE costelem_type='Material';
    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'xwd._recvTrigger, Material cost element not found';
    END IF;

    PERFORM updateCost( itemsite_item_id, _costelemid,
                        FALSE, NEW.recv_recvcost,
                        NEW.recv_recvcost_curr_id )
    FROM itemsite
    WHERE (itemsite_id=NEW.recv_itemsite_id);

    -- add any demand for this material to packing list batch
    -- look for parent sales order associated with this PO
    SELECT coitem.* INTO _coitem
    FROM poitem JOIN coitem ON (coitem_id=poitem_order_id AND poitem_order_type='S')
    WHERE (poitem_id=NEW.recv_orderitem_id)
      AND (NEW.recv_order_type='PO');
    IF (FOUND) THEN
      IF (_coitem.coitem_qtyord >
          (_coitem.coitem_qtyshipped - _coitem.coitem_qtyreturned + qtyAtShipping(_coitem.coitem_id))) THEN
        PERFORM addToPackingListBatch('SO', _coitem.coitem_cohead_id);
        _pickqty := _pickqty + _coitem.coitem_qtyord - _coitem.coitem_qtyshipped +
                    _coitem.coitem_qtyreturned - qtyAtShipping(_coitem.coitem_id);
      END IF;
    END IF;
    IF (_pickqty < NEW.recv_qty) THEN
      -- look for sales orders not associated with any PO
      FOR _coitem IN
        SELECT coitem.*
        FROM coitem
        WHERE (coitem_itemsite_id=NEW.recv_itemsite_id)
          AND (coitem_status='O')
          AND (COALESCE(coitem_order_id, -1) = -1)
        ORDER BY coitem_scheddate
      LOOP
        IF (_coitem.coitem_qtyord >
            (_coitem.coitem_qtyshipped - _coitem.coitem_qtyreturned + qtyAtShipping(_coitem.coitem_id))) THEN
          PERFORM addToPackingListBatch('SO', _coitem.coitem_cohead_id);
          _pickqty := _pickqty + _coitem.coitem_qtyord - _coitem.coitem_qtyshipped +
                      _coitem.coitem_qtyreturned - qtyAtShipping(_coitem.coitem_id);
        END IF;
        IF (_pickqty >= NEW.recv_qty) THEN
          EXIT;
        END IF;
      END LOOP;
    END IF;

    IF (_pickqty < NEW.recv_qty) THEN
      -- look for transfer orders
      FOR _toitem IN
        SELECT toitem.*
        FROM toitem JOIN tohead ON (tohead_id=toitem_tohead_id)
                    JOIN itemsite ON (itemsite_item_id=toitem_item_id AND
                                      itemsite_warehous_id=tohead_src_warehous_id)
        WHERE (itemsite_id=NEW.recv_itemsite_id)
          AND (toitem_status='O')
        ORDER BY toitem_schedshipdate
      LOOP
        IF (_toitem.toitem_qty_ordered >
            (_toitem.toitem_qty_shipped + qtyAtShipping('TO', _toitem.toitem_id))) THEN
          PERFORM addToPackingListBatch('TO', _toitem.toitem_tohead_id);
          _pickqty := _pickqty + _toitem.toitem_qty_ordered - _toitem.toitem_qty_shipped -
                      qtyAtShipping('TO', _toitem.toitem_id);
        END IF;
        IF (_pickqty >= NEW.recv_qty) THEN
          EXIT;
        END IF;
      END LOOP;
    END IF;

  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'recvXWDTrigger', 'public');
CREATE TRIGGER recvXWDTrigger AFTER UPDATE ON public.recv FOR EACH ROW EXECUTE PROCEDURE xwd._recvTrigger();
