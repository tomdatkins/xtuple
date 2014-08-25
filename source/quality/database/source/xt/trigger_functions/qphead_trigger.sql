CREATE OR REPLACE FUNCTION xt._qpheadtrigger()
  RETURNS trigger AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid 	INTEGER;
BEGIN

--  Cache the cmnttype_id for ChangeLog
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
    IF (FOUND) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'QPLAN', NEW.qphead_id, ('Created Quality Plan #' || NEW.qphead_code::TEXT));
      ELSIF (TG_OP = 'UPDATE') THEN
        IF (NEW.qphead_rev_number <> OLD.qphead_rev_number OR NEW.qphead_rev_status <> OLD.qphead_rev_status) THEN
          PERFORM postComment( _cmnttypeid, 'QPLAN', NEW.qphead_id, ( 'Revision Status Changed'));
        END IF;
      END IF;
    END IF;

RETURN NEW;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xt._qpheadtrigger()
  OWNER TO admin;

DROP TRIGGER IF EXISTS qpheadtrigger ON xt.qphead;

CREATE TRIGGER qpheadtrigger
  AFTER INSERT OR UPDATE
  ON xt.qphead
  FOR EACH ROW
  EXECUTE PROCEDURE xt._qpheadtrigger();

