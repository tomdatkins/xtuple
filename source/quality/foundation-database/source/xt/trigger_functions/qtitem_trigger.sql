CREATE OR REPLACE FUNCTION xt._qtitemtrigger()
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

    SELECT CASE (NEW.qtitem_status) WHEN 'P' THEN 'Pass'
	 WHEN 'F' THEN 'Fail'
	 ELSE 'Open'
    END INTO _status;

    IF (FOUND) THEN
        IF (TG_OP = 'UPDATE') THEN
          IF (NEW.qtitem_status <> OLD.qtitem_status) THEN
	    _comment = 'Test Item # ' || NEW.qtitem_linenumber || ' Result Status set to ' || _status;
            PERFORM postComment( _cmnttypeid, 'QTEST', NEW.qtitem_qthead_id, _comment);
          END IF;
        END IF;
    END IF;

RETURN NEW;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xt._qtitemtrigger()
  OWNER TO admin;

DROP TRIGGER IF EXISTS qtitemtrigger ON xt.qtitem;

CREATE TRIGGER qtitemtrigger
  AFTER UPDATE
  ON xt.qtitem
  FOR EACH ROW
  EXECUTE PROCEDURE xt._qtitemtrigger();

-- BEFORE Trigger - Record User making the change
CREATE OR REPLACE FUNCTION xt.qtitembeforetrigger()
  RETURNS trigger AS
$BODY$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  NEW.qtitem_lastchanged_user = getEffectiveXtUser();
  NEW.qtitem_lastchanged_time = current_timestamp;

  RETURN NEW;

END;
$BODY$
  LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS qtitembeforetrigger ON xt.qtitem;

CREATE TRIGGER qtitembeforetrigger
  BEFORE INSERT OR UPDATE
  ON xt.qtitem
  FOR EACH ROW
  EXECUTE PROCEDURE xt.qtitembeforetrigger();


