SELECT dropIfExists('TRIGGER', 'toitemTrigger');
SELECT dropIfExists('TRIGGER', 'toitemAfterTrigger');

CREATE OR REPLACE FUNCTION _toitemTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  
BEGIN
  IF (NOT checkPrivilege('MaintainTransferOrders')) THEN
    RAISE EXCEPTION 'You do not have privileges to alter a Transfer Order.';
  END IF;

  IF (fetchMetricBool('TransferOrderChangeLog') ) THEN
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
  ELSE
    _cmnttypeid := -1;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO evntlog ( evntlog_evnttime, evntlog_username,
			  evntlog_evnttype_id, evntlog_ordtype,
			  evntlog_ord_id, evntlog_warehous_id,
			  evntlog_number )
    SELECT CURRENT_TIMESTAMP, evntnot_username, evnttype_id,
           'TO', NEW.toitem_id, itemsite_warehous_id,
	   (tohead_number || '-' || NEW.toitem_linenumber)
    FROM evntnot, evnttype, itemsite, tohead
    WHERE ( (evntnot_evnttype_id=evnttype_id)
     AND (evntnot_warehous_id=itemsite_warehous_id)
     AND (itemsite_item_id=NEW.toitem_item_id)
     AND (itemsite_warehous_id=tohead_src_warehous_id)
     AND (NEW.toitem_tohead_id=tohead_id)
     AND (NEW.toitem_schedshipdate <= (CURRENT_DATE + itemsite_eventfence))
     AND (evnttype_name='ToitemCreated') );

    IF (_cmnttypeid <> -1) THEN
      PERFORM postComment(_cmnttypeid, 'TI', NEW.toitem_id, 'Created');
    END IF;

    IF (NOT EXISTS(SELECT itemsite_id
		    FROM itemsite, tohead
		    WHERE ((itemsite_item_id=NEW.toitem_item_id)
		      AND  (itemsite_warehous_id=tohead_trns_warehous_id)
		      AND  (tohead_id=NEW.toitem_tohead_id)))
       ) THEN
      INSERT INTO evntlog (evntlog_evnttime, evntlog_username, evntlog_evnttype_id,
                           evntlog_ordtype, evntlog_ord_id, evntlog_warehous_id, evntlog_number )
      SELECT CURRENT_TIMESTAMP, evntnot_username, evnttype_id,
	     'TO', NEW.toitem_id, tohead_src_warehous_id,
	     (tohead_number || '-' || NEW.toitem_linenumber)
      FROM evntnot, evnttype, tohead
      WHERE ((evntnot_evnttype_id=evnttype_id)
        AND  (evntnot_warehous_id=tohead_src_warehous_id)
	And  (tohead_id=NEW.toitem_tohead_id)
	AND  (evnttype_name='ToitemNoTransitItemSite'));
    END IF;

    IF (NOT EXISTS(SELECT itemsite_id
		    FROM itemsite, tohead
		    WHERE ((itemsite_item_id=NEW.toitem_item_id)
		      AND  (itemsite_warehous_id=tohead_dest_warehous_id)
		      AND  (tohead_id=NEW.toitem_tohead_id)))
       ) THEN
      INSERT INTO evntlog (evntlog_evnttime, evntlog_username, evntlog_evnttype_id,
                           evntlog_ordtype, evntlog_ord_id, evntlog_warehous_id, evntlog_number )
      SELECT CURRENT_TIMESTAMP, evntnot_username, evnttype_id,
	     'TO', NEW.toitem_id, tohead_src_warehous_id,
	     (tohead_number || '-' || NEW.toitem_linenumber)
      FROM evntnot, evnttype, tohead
      WHERE ((evntnot_evnttype_id=evnttype_id)
        AND  (evntnot_warehous_id=tohead_src_warehous_id)
	And  (tohead_id=NEW.toitem_tohead_id)
	AND  (evnttype_name='ToitemNoDestItemSite'));
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    DELETE FROM comment
    WHERE ( (comment_source='TI')
     AND (comment_source_id=OLD.toitem_id) );

    DELETE FROM charass
     WHERE ((charass_target_type='TI')
       AND  (charass_target_id=OLD.toitem_id));

    IF (OLD.toitem_status = 'O') THEN
      IF (SELECT (count(*) < 1)
	    FROM toitem
	    WHERE ((toitem_tohead_id=OLD.toitem_tohead_id)
	     AND   (toitem_id != OLD.toitem_id)
	     AND   (toitem_status NOT IN ('C', 'X'))) ) THEN
	UPDATE tohead SET tohead_status='C'
	WHERE ((tohead_id=OLD.toitem_tohead_id)
	  AND  (tohead_status='O'));
      END IF;
    END IF;

    INSERT INTO evntlog (evntlog_evnttime, evntlog_username,
			 evntlog_evnttype_id, evntlog_ordtype,
			 evntlog_ord_id, evntlog_warehous_id, evntlog_number )
    SELECT CURRENT_TIMESTAMP, evntnot_username, evnttype_id,
	   'TO', OLD.toitem_id, itemsite_warehous_id, (tohead_number || '-' || OLD.toitem_linenumber)
    FROM evntnot, evnttype, itemsite, tohead
    WHERE ( (evntnot_evnttype_id=evnttype_id)
     AND (evntnot_warehous_id=itemsite_warehous_id)
     AND (itemsite_item_id=OLD.toitem_item_id)
     AND (itemsite_warehous_id=tohead_src_warehous_id)
     AND (OLD.toitem_tohead_id=tohead_id)
     AND (OLD.toitem_schedshipdate <= (CURRENT_DATE + itemsite_eventfence))
     AND (evnttype_name='ToitemCancelled') );


  ELSIF (TG_OP = 'UPDATE') THEN

    IF (((OLD.toitem_status <> 'C') AND (NEW.toitem_status = 'C'))
	AND (qtyAtShipping('TO', NEW.toitem_id) > 0)) THEN
      RAISE EXCEPTION 'Line % cannot be Closed at this time as there is inventory at shipping.',NEW.toitem_linenumber;
    END IF;

    IF ( (NEW.toitem_qty_shipped >= NEW.toitem_qty_ordered) AND
         (NEW.toitem_qty_received >= NEW.toitem_qty_ordered) ) THEN
      NEW.toitem_status = 'C';
    END IF;

    IF (NEW.toitem_qty_ordered <> OLD.toitem_qty_ordered) THEN
      INSERT INTO evntlog ( evntlog_evnttime, evntlog_username, evntlog_evnttype_id,
			    evntlog_ordtype, evntlog_ord_id, evntlog_warehous_id, evntlog_number,
			    evntlog_oldvalue, evntlog_newvalue )
      SELECT CURRENT_TIMESTAMP, evntnot_username, evnttype_id,
	     'TO', NEW.toitem_id, itemsite_warehous_id, (tohead_number || '-' || NEW.toitem_linenumber),
	     OLD.toitem_qty_ordered, NEW.toitem_qty_ordered
      FROM evntnot, evnttype, itemsite, tohead
      WHERE ( (evntnot_evnttype_id=evnttype_id)
       AND (evntnot_warehous_id=itemsite_warehous_id)
       AND (itemsite_item_id=NEW.toitem_item_id)
       AND (itemsite_warehous_id=tohead_src_warehous_id)
       AND (NEW.toitem_tohead_id=tohead_id)
       AND ( (NEW.toitem_schedshipdate <= (CURRENT_DATE + itemsite_eventfence))
	OR   (OLD.toitem_schedshipdate <= (CURRENT_DATE + itemsite_eventfence)) )
       AND (evnttype_name='ToitemQtyChanged') );

      IF (_cmnttypeid <> -1) THEN
	PERFORM postComment( _cmnttypeid, 'TI', NEW.toitem_id,
			     ( 'Changed Qty. Ordered from ' || formatQty(OLD.toitem_qty_ordered) ||
			       ' to ' || formatQty(NEW.toitem_qty_ordered) ) );
      END IF;

    END IF;

    IF (NEW.toitem_schedshipdate <> OLD.toitem_schedshipdate) THEN
      INSERT INTO evntlog ( evntlog_evnttime, evntlog_username, evntlog_evnttype_id,
			    evntlog_ordtype, evntlog_ord_id, evntlog_warehous_id, evntlog_number,
			    evntlog_olddate, evntlog_newdate )
      SELECT CURRENT_TIMESTAMP, evntnot_username, evnttype_id,
	     'TO', NEW.toitem_id, itemsite_warehous_id, (tohead_number || '-' || NEW.toitem_linenumber),
	     OLD.toitem_schedshipdate, NEW.toitem_schedshipdate
      FROM evntnot, evnttype, itemsite, tohead
      WHERE ( (evntnot_evnttype_id=evnttype_id)
       AND (evntnot_warehous_id=itemsite_warehous_id)
       AND (itemsite_item_id=NEW.toitem_item_id)
       AND (itemsite_warehous_id=tohead_src_warehous_id)
       AND (NEW.toitem_tohead_id=tohead_id)
       AND ( (NEW.toitem_schedshipdate <= (CURRENT_DATE + itemsite_eventfence))
	OR   (OLD.toitem_schedshipdate <= (CURRENT_DATE + itemsite_eventfence)) )
       AND (evnttype_name='ToitemSchedDateChanged') );

      IF (_cmnttypeid <> -1) THEN
	PERFORM postComment( _cmnttypeid, 'TI', NEW.toitem_id,
			     ( 'Changed Sched. Date from ' || formatDate(OLD.toitem_schedshipdate) ||
			       ' to ' || formatDate(NEW.toitem_schedshipdate)) );
      END IF;
    END IF;

    IF ((NEW.toitem_status = 'C') AND (OLD.toitem_status <> 'C')) THEN
      NEW.toitem_closedate = CURRENT_TIMESTAMP;
      NEW.toitem_close_username = getEffectiveXtUser();

      IF (_cmnttypeid <> -1) THEN
	PERFORM postComment(_cmnttypeid, 'TI', NEW.toitem_id, 'Closed');
      END IF;
    END IF;

    IF ((NEW.toitem_status = 'X') AND (OLD.toitem_status <> 'X')) THEN
      IF (_cmnttypeid <> -1) THEN
	PERFORM postComment(_cmnttypeid, 'TI', NEW.toitem_id, 'Canceled');
	PERFORM postComment(_cmnttypeid, 'TO', NEW.toitem_tohead_id, 'Line # '|| NEW.toitem_linenumber ||' Canceled');

	INSERT INTO evntlog (evntlog_evnttime, evntlog_username,
			     evntlog_evnttype_id, evntlog_ordtype,
			     evntlog_ord_id, evntlog_warehous_id, evntlog_number )
	SELECT CURRENT_TIMESTAMP, evntnot_username, evnttype_id,
	       'TO', OLD.toitem_id, itemsite_warehous_id, (tohead_number || '-' || OLD.toitem_linenumber)
	FROM evntnot, evnttype, itemsite, tohead
	WHERE ( (evntnot_evnttype_id=evnttype_id)
	 AND (evntnot_warehous_id=itemsite_warehous_id)
	 AND (itemsite_item_id=OLD.toitem_item_id)
	 AND (itemsite_warehous_id=tohead_src_warehous_id)
	 AND (OLD.toitem_tohead_id=tohead_id)
	 AND (OLD.toitem_schedshipdate <= (CURRENT_DATE + itemsite_eventfence))
	 AND (evnttype_name='ToitemCancelled') );
      END IF;
    END IF;

    IF (OLD.toitem_status <> NEW.toitem_status) THEN
      IF ( (SELECT (count(*) < 1)
	    FROM toitem
	    WHERE ((toitem_tohead_id=NEW.toitem_tohead_id)
	     AND   (toitem_id != NEW.toitem_id)
	     AND   (toitem_status NOT IN ('C', 'X'))) )  AND (NEW.toitem_status IN ('C', 'X')) ) THEN
	UPDATE tohead SET tohead_status='C'
	WHERE ((tohead_id=NEW.toitem_tohead_id)
	  AND  (tohead_status='O'));
      ELSE
	UPDATE tohead SET tohead_status = 'O'
	WHERE ((tohead_id=NEW.toitem_tohead_id)
	  AND  (tohead_status='C'));
      END IF;
    END IF;
  END IF; 
    

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  NEW.toitem_lastupdated = CURRENT_TIMESTAMP;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER toitemTrigger BEFORE INSERT OR UPDATE OR DELETE ON toitem FOR EACH ROW EXECUTE PROCEDURE _toitemTrigger();

CREATE OR REPLACE FUNCTION _toitemAfterTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

-- Cache Transfer Order Head
  SELECT * INTO _r
  FROM tohead
  WHERE (tohead_id=NEW.toitem_tohead_id);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Transfer Order head not found';
  END IF;

-- Insert new row
  IF (TG_OP = 'INSERT') THEN

  -- Calculate Tax
      PERFORM calculateTaxHist( 'toitemtax',
                                NEW.toitem_id,
                                COALESCE(_r.tohead_taxzone_id, -1),
                                getFreightTaxTypeId(),
                                COALESCE(_r.tohead_orderdate, CURRENT_DATE),
                                baseCurrId(),
                                NEW.toitem_freight );
  END IF;

-- Update row
  IF (TG_OP = 'UPDATE') THEN

  -- Calculate Tax
    IF ( (NEW.toitem_qty_ordered <> OLD.toitem_qty_ordered) OR
         (NEW.toitem_freight <> OLD.toitem_freight) ) THEN
      PERFORM calculateTaxHist( 'toitemtax',
                                NEW.toitem_id,
                                COALESCE(_r.tohead_taxzone_id, -1),
                                getFreightTaxTypeId(),
                                COALESCE(_r.tohead_orderdate, CURRENT_DATE),
                                baseCurrId(),
                                NEW.toitem_freight );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER toitemAfterTrigger
  AFTER INSERT OR UPDATE OR DELETE
  ON toitem
  FOR EACH ROW
  EXECUTE PROCEDURE _toitemAfterTrigger();
