CREATE OR REPLACE FUNCTION xtmfg.triggerBooitem() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
-- Privilege Checks
  IF (NOT checkPrivilege('MaintainBOOs')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Bills of Operations.';
  END IF;
  
  IF ((TG_OP = 'INSERT') OR (TG_OP = 'UPDATE')) THEN
-- Make sure sequence is unique.  Need to do this going forward here rather than as table
-- constraint because lax enforcement in previous versions could make upgrading a
-- substantial headache for legacy users.
    IF (SELECT (COUNT(*) != 0) 
        FROM xtmfg.booitem(NEW.booitem_item_id,NEW.booitem_rev_id)
        WHERE ((booitem_id != NEW.booitem_id)
        AND (booitem_seqnumber=NEW.booitem_seqnumber))) THEN
      RAISE EXCEPTION 'BOO Item sequence number must be unique.';
    END IF;
  
    IF (NEW.booitem_rnqtyper = 0) THEN
      NEW.booitem_rnqtyper = 1;
    END IF;

    IF (NEW.booitem_invproduomratio = 0) THEN
      NEW.booitem_invproduomratio = 1;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
  

SELECT dropIfExists('TRIGGER', 'booitemTrigger', 'xtmfg');
CREATE TRIGGER booitemTrigger BEFORE INSERT OR UPDATE ON xtmfg.booitem FOR EACH ROW EXECUTE PROCEDURE xtmfg.triggerBooitem();

CREATE OR REPLACE FUNCTION xtmfg.afterTriggerBooitem() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  IF (TG_OP = 'UPDATE') THEN
-- Update the effective and expires date of any associated active bomitems
-- that are used at this operation and are scheduled with booitem
-- when the booitem is changed from active to expired/future
    IF ((OLD.booitem_effective <= CURRENT_DATE) AND (NEW.booitem_effective > CURRENT_DATE)) THEN
      UPDATE bomitem SET bomitem_effective=NEW.booitem_effective
      WHERE ( (bomitem_parent_item_id=NEW.booitem_item_id)
        AND   (bomitem_booitem_seq_id=NEW.booitem_seq_id)
        AND   (bomitem_rev_id=NEW.booitem_rev_id)
        AND   (bomitem_schedatwooper)
        AND   (bomitem_effective <= CURRENT_DATE)
        AND   (bomitem_expires > CURRENT_DATE) );
    END IF;
    IF ((OLD.booitem_expires > CURRENT_DATE) AND (NEW.booitem_expires <= CURRENT_DATE)) THEN
      UPDATE bomitem SET bomitem_expires=NEW.booitem_expires
      WHERE ( (bomitem_parent_item_id=NEW.booitem_item_id)
        AND   (bomitem_booitem_seq_id=NEW.booitem_seq_id)
        AND   (bomitem_rev_id=NEW.booitem_rev_id)
        AND   (bomitem_schedatwooper)
        AND   (bomitem_effective <= CURRENT_DATE)
        AND   (bomitem_expires > CURRENT_DATE) );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
  

SELECT dropIfExists('TRIGGER', 'afterBooitemTrigger', 'xtmfg');
CREATE TRIGGER afterBooitemTrigger AFTER INSERT OR UPDATE ON xtmfg.booitem FOR EACH ROW EXECUTE PROCEDURE xtmfg.afterTriggerBooitem();
