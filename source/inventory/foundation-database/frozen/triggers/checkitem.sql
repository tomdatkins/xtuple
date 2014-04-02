CREATE OR REPLACE FUNCTION _checkitemAfterTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
  DECLARE _amount NUMERIC;

BEGIN
  IF (TG_OP = 'INSERT' AND NEW.checkitem_aropen_id IS NOT NULL) THEN
    INSERT INTO rahist (rahist_date,rahist_descrip,rahist_curr_id,
                        rahist_source,rahist_source_id,rahist_amount,
                        rahist_rahead_id)
    SELECT checkhead_checkdate,'Check # ' || checkhead_number::text || ' created',
           checkhead_curr_id,'CK',checkhead_id,checkhead_amount,cmhead_rahead_id
    FROM checkhead,aropen,cmhead
    WHERE ((checkhead_id=NEW.checkitem_checkhead_id)
    AND (aropen_id=NEW.checkitem_aropen_id)
    AND (cmhead_number=aropen_docnumber)
    AND (cmhead_rahead_id IS NOT NULL));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'checkitemAfterTrigger');
CREATE TRIGGER checkitemAfterTrigger BEFORE INSERT OR UPDATE ON checkitem FOR EACH ROW EXECUTE PROCEDURE _checkitemAftertrigger();

