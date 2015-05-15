CREATE OR REPLACE FUNCTION _coitemReservationsTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _result INTEGER;
BEGIN
  IF (fetchMetricBool('EnableSOReservations')) THEN
    IF (TG_OP = 'UPDATE' AND NEW.coitem_status IN ('C', 'X') AND NEW.coitem_qtyreserved > 0) THEN
      SELECT unreserveSoLineQty(NEW.coitem_id) INTO _result;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

SELECT dropIfExists('TRIGGER', 'coitemReservationsTrigger');
CREATE TRIGGER coitemReservationsTrigger AFTER UPDATE ON coitem FOR EACH ROW EXECUTE PROCEDURE _coitemReservationsTrigger();

