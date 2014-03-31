SELECT dropIfExists('TRIGGER', 'toheadTrigger');
SELECT dropIfExists('TRIGGER', 'toheadAfterTrigger');

CREATE OR REPLACE FUNCTION _toheadTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _numGen CHAR(1);

BEGIN
  IF (NOT checkPrivilege('MaintainTransferOrders')) THEN
    RAISE EXCEPTION 'You do not have privileges to create or change a Transfer Order.';
  END IF;

  IF (fetchMetricBool('TransferOrderChangeLog') ) THEN
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
    IF NOT FOUND THEN
      _cmnttypeid := -1;
    END IF;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    _numGen := fetchMetricText('TONumberGeneration');
    IF ((NEW.tohead_number IS NULL) AND (_numGen='M')) THEN
      RAISE EXCEPTION 'You must supply an Order Number.';
    ELSIF (NEW.tohead_number IS NULL AND (_numGen='A')) THEN
      SELECT fetchtonumber() INTO NEW.tohead_number;
    END IF;

    IF (_cmnttypeid <> -1) THEN
      PERFORM postComment(_cmnttypeid, 'TO', NEW.tohead_id, 'Created');
    END IF;

    IF (fetchMetricText('TONumberGeneration') IN ('A','O')) THEN
      --- clear the number from the issue cache
      PERFORM clearNumberIssue('ToNumber', NEW.tohead_number::INTEGER);
    END IF;

  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.tohead_ordercomments <> NEW.tohead_ordercomments) THEN
      INSERT INTO evntlog ( evntlog_evnttime, evntlog_username, evntlog_evnttype_id,
                            evntlog_ordtype, evntlog_ord_id, evntlog_warehous_id, evntlog_number )
      SELECT CURRENT_TIMESTAMP, evntnot_username, evnttype_id,
             'TO', NEW.tohead_id, NEW.tohead_src_warehous_id, NEW.tohead_number::TEXT
      FROM evntnot, evnttype
      WHERE ( (evntnot_evnttype_id=evnttype_id)
       AND (evntnot_warehous_id=NEW.tohead_src_warehous_id)
       AND (evnttype_name='ToNotesChanged') );
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    DELETE FROM comment
    WHERE ( (comment_source='TO')
     AND (comment_source_id=OLD.tohead_id) );

    RETURN OLD;
  END IF;

  NEW.tohead_lastupdated = CURRENT_TIMESTAMP;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER toheadTrigger BEFORE INSERT OR UPDATE OR DELETE ON tohead FOR EACH ROW EXECUTE PROCEDURE _toheadTrigger();

CREATE OR REPLACE FUNCTION _toheadAfterTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    -- Something can go here
    RETURN OLD;
  END IF;

-- Insert new row
  IF (TG_OP = 'INSERT') THEN

  -- Calculate Freight Tax
    IF (NEW.tohead_freight <> 0) THEN
      PERFORM calculateTaxHist( 'toheadtax',
                                NEW.tohead_id,
                                NEW.tohead_taxzone_id,
                                getFreightTaxtypeId(),
                                NEW.tohead_orderdate,
                                baseCurrId(),
                                NEW.tohead_freight );
    END IF;
  END IF;

-- Update row
  IF (TG_OP = 'UPDATE') THEN

  -- Calculate Freight Tax
    IF ( (NEW.tohead_freight <> OLD.tohead_freight) OR
         (NEW.tohead_taxzone_id <> OLD.tohead_taxzone_id) OR
         (NEW.tohead_orderdate <> OLD.tohead_orderdate) ) THEN
      PERFORM calculateTaxHist( 'toheadtax',
                                NEW.tohead_id,
                                NEW.tohead_taxzone_id,
                                getFreightTaxtypeId(),
                                NEW.tohead_orderdate,
                                baseCurrId(),
                                NEW.tohead_freight );
      PERFORM calculateTaxHist( 'toitemtax',
                                toitem_id,
                                NEW.tohead_taxzone_id,
                                getFreightTaxTypeId(),
                                NEW.tohead_orderdate,
                                baseCurrId(),
                                (toitem_qty_ordered * toitem_stdcost) )
      FROM toitem
      WHERE (toitem_tohead_id = NEW.tohead_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER toheadAfterTrigger
  AFTER INSERT OR UPDATE OR DELETE
  ON tohead
  FOR EACH ROW
  EXECUTE PROCEDURE _toheadAfterTrigger();

