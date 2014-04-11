CREATE OR REPLACE FUNCTION _raitemlsTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _p           	RECORD;
  _oldQty	NUMERIC;
  _check       	INTEGER;
  _lsdetailid	INTEGER;

BEGIN

-- Return if updating qtyreceived
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.raitemls_qtyreceived <> NEW.raitemls_qtyreceived) THEN
      RETURN NEW;
    END IF;
  END IF;

  IF (TG_OP IN ('INSERT','UPDATE')) THEN 
    IF (NEW.raitemls_qtyauthorized < 0) THEN
      RAISE EXCEPTION 'You may not authorize a negative quantity.';
    END IF;

    _oldQty := 0;
  
    -- Get data to do some work
    SELECT rahead_id,rahead_number,raitem_itemsite_id,
      raitem_id, raitem_qty_invuomratio, itemsite_item_id,
      raitem_linenumber INTO _p
    FROM rahead,raitem,itemsite
    WHERE ((rahead_id=raitem_rahead_id)
    AND (raitem_id=NEW.raitemls_raitem_id)
    AND (raitem_itemsite_id=itemsite_id));

    -- Validation
    SELECT ls_item_id INTO _check
    FROM ls
    WHERE ((ls_id=NEW.raitemls_ls_id)
    AND (ls_item_id=_p.itemsite_item_id));
  
    IF (NOT FOUND) THEN
        RAISE EXCEPTION 'Lot Serial Item Id does not match Return Authorization Item Id.';
    END IF;

    -- Set up data
    IF (TG_OP = 'UPDATE') THEN
      _oldQty := OLD.raitemls_qtyauthorized;
    END IF;

    -- Update parent return authorization line
    UPDATE raitem SET 
      raitem_qtyauthorized = (SELECT SUM(raitemls_qtyauthorized)
				FROM raitemls
				WHERE (raitemls_raitem_id = NEW.raitemls_raitem_id))
    WHERE (raitem_id = NEW.raitemls_raitem_id);

    -- Pre assign lot/serial number for receiving
    SELECT lsdetail_id INTO _lsdetailid
    FROM lsdetail
    WHERE ((lsdetail_source_type='RR')
    AND (lsdetail_source_id=NEW.raitemls_raitem_id)
    AND (lsdetail_ls_id=NEW.raitemls_ls_id));

    IF (FOUND) THEN
      UPDATE lsdetail SET
        lsdetail_qtytoassign = lsdetail_qtytoassign + (NEW.raitemls_qtyauthorized - _oldQty) *
				_p.raitem_qty_invuomratio
      WHERE (lsdetail_id=_lsdetailid);
    ELSE
      INSERT INTO lsdetail (lsdetail_itemsite_id,lsdetail_created,lsdetail_source_type,
        lsdetail_source_id,lsdetail_source_number,lsdetail_qtytoassign,lsdetail_ls_id)
      VALUES ( _p.raitem_itemsite_id, now(), 'RR', NEW.raitemls_raitem_id, 
        _p.rahead_number || '-' || _p.raitem_linenumber,
        NEW.raitemls_qtyauthorized * _p.raitem_qty_invuomratio,NEW.raitemls_ls_id);
    END IF;
  END IF;

  IF (TG_OP = 'DELETE') THEN
     -- Get data to do some work
    SELECT raitem_rahead_id, raitem_qty_invuomratio INTO _p
    FROM raitem
    WHERE (raitem_id=OLD.raitemls_raitem_id);
    
    -- Validate
    IF OLD.raitemls_qtyreceived > 0 THEN
      RAISE EXCEPTION 'Can not delete line with quantity received.';
    END IF;
    
    -- Update parent return auth line
    UPDATE raitem SET 
      raitem_qtyauthorized = raitem_qtyauthorized - OLD.raitemls_qtyauthorized
    WHERE (raitem_id = OLD.raitemls_raitem_id);

    -- Reduce pre assign number
    UPDATE lsdetail SET
      lsdetail_qtytoassign = lsdetail_qtytoassign - OLD.raitemls_qtyauthorized * _p.raitem_qty_invuomratio
    WHERE ((lsdetail_source_type='RR')
    AND (lsdetail_source_id=OLD.raitemls_raitem_id)
    AND (lsdetail_ls_id=OLD.raitemls_ls_id));

  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'raitemlsTrigger');
CREATE TRIGGER raitemlsTrigger AFTER INSERT OR UPDATE OR DELETE ON raitemls FOR EACH ROW EXECUTE PROCEDURE _raitemlsTrigger();
