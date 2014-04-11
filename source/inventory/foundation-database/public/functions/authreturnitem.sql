CREATE OR REPLACE FUNCTION authReturnItem(integer) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRaitemId ALIAS FOR $1;
  _r RECORD;
  _rows INTEGER;
  _woid INTEGER;

BEGIN
  SELECT raitem_qtyauthorized, raitem_status, raitem_qtyreceived,
    oc.coitem_id AS orig_coitem_id,
    oc.coitem_qtyshipped AS orig_coitem_qtyshipped,
    oc.coitem_qtyord AS orig_coitem_qtyord,
    COALESCE(nc.coitem_order_id,-1) AS wo_id,
    itemsite_id, itemsite_costmethod, itemsite_leadtime, item_type
    INTO _r
  FROM raitem
   JOIN itemsite ON (itemsite_id=raitem_itemsite_id)
   JOIN item ON (item_id=itemsite_item_id)
   JOIN coitem oc ON (oc.coitem_id=raitem_orig_coitem_id)
   LEFT OUTER JOIN coitem nc ON (nc.coitem_id=raitem_new_coitem_id)
  WHERE (raitem_id=pRaitemId);

  GET DIAGNOSTICS _rows = ROW_COUNT;
  IF (_rows = 0) THEN
    RETURN 0;
  END IF;

  -- Validate
  IF (_r.raitem_qtyauthorized >= _r.orig_coitem_qtyshipped AND _r.item_type <> 'K') THEN
    RETURN 0;
  ELSIF (_r.raitem_qtyreceived >= _r.orig_coitem_qtyshipped AND _r.item_type <> 'K') THEN
    RETURN 0;
  ELSIF (_r.raitem_status != 'O') THEN
    -- Can only authorization quantity on open lines
    RETURN 0;
  ELSIF (_r.wo_id != -1) THEN
    -- Can not automatically change line authorization quantity when a linked work order exists
    RETURN 0;
  END IF;

  -- Update the authorization quantity
  UPDATE raitem SET
    raitem_qtyauthorized = CASE WHEN (_r.item_type='K') THEN _r.orig_coitem_qtyord
                                ELSE _r.orig_coitem_qtyshipped
                           END
  WHERE (raitem_id=pRaitemId);

  -- If job costed item site, create work order
  IF (_r.itemsite_costmethod = 'J' AND _r.wo_id = -1) THEN
    SELECT createWo(cohead_number::integer, raitem_itemsite_id, _r.orig_coitem_qtyshipped, 
      _r.itemsite_leadtime, COALESCE(raitem_scheddate,current_date), 
      cust_name || E'\n' || raitem_notes, 'S'::text, coitem_id) INTO _woid
    FROM raitem
     JOIN coitem ON (coitem_id=raitem_new_coitem_id)
     JOIN cohead ON (cohead_id=coitem_cohead_id)
     JOIN custinfo ON (cohead_cust_id=cust_id)
    WHERE (raitem_id=pRaitemId);

    GET DIAGNOSTICS _rows = ROW_COUNT;
    IF (_rows = 0) THEN
      RAISE EXCEPTION 'There was an error creating a work order for the return.';
    ELSIF (_woid < 0) THEN
      RAISE EXCEPTION 'There was an error creating a work order for the return.  Error code %.', _woid;
    END IF;

    UPDATE coitem SET 
      coitem_order_type='W', 
      coitem_order_id=_woid
    FROM raitem
    WHERE ((coitem_id=raitem_new_coitem_id)
     AND (raitem_id=pRaitemId));
     
  END IF;

  -- Return authorized quantity
  RETURN _r.orig_coitem_qtyshipped - _r.raitem_qtyauthorized;
  
END;
$$ LANGUAGE 'plpgsql';
