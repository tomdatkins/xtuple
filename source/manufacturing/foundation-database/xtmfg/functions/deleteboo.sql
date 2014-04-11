
CREATE OR REPLACE FUNCTION xtmfg.deleteboo(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  _result INTEGER;

BEGIN

  IF (fetchmetricbool('RevControl')) THEN
    SELECT rev_id INTO _result
    FROM rev
    WHERE ((rev_target_id=pItemid)
    AND (rev_target_type = 'BOO'))
    LIMIT 1;
    IF (FOUND) THEN
      RAISE EXCEPTION 'Bill of Operations has revision control records and may not be deleted.';
    END IF;
  END IF;

  DELETE FROM xtmfg.boohead
  WHERE (boohead_item_id=pItemid);
  DELETE FROM xtmfg.booitem
  WHERE (booitem_item_id=pItemid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
