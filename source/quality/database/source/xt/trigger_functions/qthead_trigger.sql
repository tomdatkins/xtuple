CREATE OR REPLACE FUNCTION xt._qtheadtrigger()
  RETURNS trigger AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid 	INTEGER;
  _comment	TEXT;
  _status	TEXT;
BEGIN

--  Cache the cmnttype_id for ChangeLog
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');

    SELECT CASE (NEW.qthead_status) WHEN 'P' THEN 'Pass'
	 WHEN 'F' THEN 'Fail'
	 ELSE 'Open'
    END INTO _status;

    IF (FOUND) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'QTEST', NEW.qthead_id, ('Created Quality Test #' || NEW.qthead_number::TEXT));
      ELSIF (TG_OP = 'UPDATE') THEN
        IF (NEW.qthead_status <> OLD.qthead_status) THEN
	  _comment = 'Test Status set to ' || _status;
          PERFORM postComment( _cmnttypeid, 'QTEST', NEW.qthead_id, _comment);
        ELSIF ( NEW.qthead_completed_date <> OLD.qthead_completed_date) THEN
          _comment = 'Test was marked completed ' || formatDate(NEW.qthead_completed_date);
          PERFORM postComment( _cmnttypeid, 'QTEST', NEW.qthead_id, _comment);
        END IF;
      END IF;
    END IF;

RETURN NEW;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xt._qtheadtrigger()
  OWNER TO admin;

DROP TRIGGER IF EXISTS qtheadtrigger ON xt.qthead;

CREATE TRIGGER qtheadtrigger
  AFTER INSERT OR UPDATE
  ON xt.qthead
  FOR EACH ROW
  EXECUTE PROCEDURE xt._qtheadtrigger();

-- BEFORE Trigger - Record User making the change
CREATE OR REPLACE FUNCTION xt.qtheadbeforetrigger()
  RETURNS trigger AS
$BODY$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  NEW.qthead_lastchanged_user = getEffectiveXtUser();
  NEW.qthead_lastchanged_time = current_timestamp;

  RETURN NEW;

END;
$BODY$
  LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS qtheadbeforetrigger ON xt.qthead;

CREATE TRIGGER qtheadbeforetrigger
  BEFORE INSERT OR UPDATE
  ON xt.qthead
  FOR EACH ROW
  EXECUTE PROCEDURE xt.qtheadbeforetrigger();


