CREATE OR REPLACE FUNCTION _revaftertrigger()
  RETURNS trigger AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _bomid   INTEGER;
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.rev_target_type = 'BOM') THEN
    _bomid := (select bomhead_id from bomhead left outer join rev on bomhead_rev_id=rev_id
             WHERE bomhead_item_id=NEW.rev_target_id
              AND bomhead_revision = NEW.rev_number
              ORDER BY rev_status LIMIT 1);

    -- Changelog
    IF (OLD.rev_status <> NEW.rev_status) THEN
      PERFORM postComment('ChangeLog', 'BMH', _bomid, format('Revision status updated from %s to %s',
                          OLD.rev_status, NEW.rev_status));
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS revaftertrigger ON rev;

CREATE TRIGGER revaftertrigger
  AFTER UPDATE
  ON rev
  FOR EACH ROW
  EXECUTE PROCEDURE _revaftertrigger();

