--DROP FUNCTION IF EXISTS xt.itemlocdist_save_distribution_detail();

CREATE OR REPLACE FUNCTION xt.itemlocdist_save_distribution_detail()
  RETURNS trigger AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _child RECORD;
  _parent RECORD;
  _i RECORD;
  _locationId INTEGER;
  _orderheadId INTEGER;
  _qty NUMERIC;
BEGIN
  -- parent record
  SELECT itemlocdist_id, itemlocdist_itemsite_id, itemlocdist_order_type, itemlocdist_order_id INTO _parent
  FROM itemlocdist 
  WHERE itemlocdist_source_type = 'O'
    AND CASE WHEN OLD.itemlocdist_source_type = 'O' THEN OLD.itemlocdist_id = itemlocdist_id
      WHEN OLD.itemlocdist_source_type != 'O' THEN OLD.itemlocdist_itemlocdist_id = itemlocdist_id END;

  IF (_parent.itemlocdist_order_type::text NOT IN ('SO', 'RP')) THEN
    RETURN OLD;
  END IF;
  -- Resolve the order head id
  IF (_parent.itemlocdist_order_type::text = 'SO') THEN
    SELECT coitem_cohead_id INTO _orderheadId
    FROM coitem
    WHERE coitem_id = _parent.itemlocdist_order_id
      AND coitem_itemsite_id = _parent.itemlocdist_itemsite_id;
  END IF;

  FOR _child IN SELECT * 
    FROM itemlocdist
      --LEFT JOIN xt.recvdetail ON itemlocdist_id = recvdetail_itemlocdist_id
    WHERE itemlocdist_source_type != 'O'
      AND itemlocdist_itemlocdist_id = _parent.itemlocdist_id
      --AND recvdetail_id IS NULL 
      AND OLD.itemlocdist_id = itemlocdist_id
  LOOP
    --resolve qty
    _qty := _child.itemlocdist_qty * -1;
    RAISE NOTICE 'QTY: %', _qty;
    -- resolve location id
    IF (_child.itemlocdist_source_id IS NOT NULL) THEN
      SELECT 
        CASE WHEN itemloc_location_id = -1 THEN NULL 
        ELSE itemloc_location_id END AS loc INTO _locationId
      FROM  itemloc
      WHERE itemloc_id = _child.itemlocdist_source_id;
    END IF;

    PERFORM xt.enterreceiptdetail(_parent.itemlocdist_order_type, _orderheadId, 
      _parent.itemlocdist_order_id, _qty, _locationId, 
      formatlotserialnumber(_child.itemlocdist_ls_id), 
      _child.itemlocdist_expiration, endoftime(), _parent.itemlocdist_itemsite_id);

    /*
    INSERT INTO xt.recvdetail (recvdetail_order_type, recvdetail_orderhead_id, recvdetail_orderitem_id,
      recvdetail_qty, recvdetail_location_id, recvdetail_lot, recvdetail_expiration,
      recvdetail_warranty, recvdetail_posted, recvdetail_itemsite_id, recvdetail_itemlocdist_id)
    VALUES (_parent.itemlocdist_order_type, _orderheadId, _parent.itemlocdist_order_id, --todo: remove recvdetail_orderitem_id column
      ABS(_child.itemlocdist_qty), _locationId, formatlotserialnumber(_child.itemlocdist_ls_id), 
      _child.itemlocdist_expiration, endoftime(), false, _parent.itemlocdist_itemsite_id, _child.itemlocdist_id);
    */

  END LOOP;

  RETURN NULL;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xt.itemlocdist_save_distribution_detail()
  OWNER TO admin;
