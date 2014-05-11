CREATE OR REPLACE FUNCTION clearReturnItem(integer) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRaitemId ALIAS FOR $1;
  _r RECORD;
  _rows INTEGER;
  _result INTEGER;
  _authQty NUMERIC;

BEGIN
  SELECT raitem_qtyreceived, raitem_qtycredited, raitem_status, 
    COALESCE(wo_id,-1) AS wo_id, COALESCE(wo_status,'') AS wo_status
    INTO _r
  FROM raitem
   LEFT OUTER JOIN coitem ON (coitem_id=raitem_new_coitem_id)
   LEFT OUTER JOIN wo ON ((wo_ordid=coitem_id)
                      AND (wo_ordtype='S'))
  WHERE (raitem_id=pRaitemId);

  GET DIAGNOSTICS _rows = ROW_COUNT;
  IF (_rows = 0) THEN
    RETURN 0;
  END IF;

  -- Validate
  IF (_r.raitem_status != 'O') THEN
    -- Can only authorization quantity on open lines
    RETURN 0;
  END IF;

  _authQty := greatest(_r.raitem_qtyreceived,_r.raitem_qtycredited);

  -- Delete work order if no longer needed
  IF ((_authQty = 0)
    AND (_r.wo_status IN ('O','E'))) THEN
 
    SELECT deleteWo(_r.wo_id, true, true) INTO _result;

    GET DIAGNOSTICS _rows = ROW_COUNT;
    IF (_rows = 0) THEN
      RAISE EXCEPTION 'There was an error deleting a work order for the return.';
    ELSIF (_result < 0) THEN
      RAISE EXCEPTION 'There was an error deleting a work order for the return.  Error code %.', _result;
    END IF;

    UPDATE coitem SET 
      coitem_order_type=NULL, 
      coitem_order_id=NULL
    FROM raitem
    WHERE ((coitem_id=raitem_new_coitem_id)
     AND (raitem_id=pRaitemId));
     
  END IF;

  -- Update the authorization quantity
  UPDATE raitem SET
    raitem_qtyauthorized = _authQty
  WHERE (raitem_id=pRaitemId);


  -- Return authorized quantity
  RETURN _authQty;
  
END;
$$ LANGUAGE 'plpgsql';
