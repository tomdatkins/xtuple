CREATE OR REPLACE FUNCTION xtmfg.deleteItem(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  _result INTEGER;
  _routings BOOLEAN;
  _bbom BOOLEAN;

BEGIN
  _bbom     := fetchMetricBool('BBOM');
  _routings := fetchMetricBool('Routings');

  IF(_bbom) THEN
    SELECT bbomitem_id INTO _result
    FROM xtmfg.bbomitem
    WHERE (bbomitem_item_id=pItemid)
    LIMIT 1;
    IF (FOUND) THEN
      RETURN -4;
    END IF;
  END IF;

  IF (fetchmetricbool('RevControl')) THEN
    SELECT rev_id INTO _result
    FROM rev
    WHERE ((rev_target_id=pItemid)
    AND (rev_target_type = 'BOO'))
    LIMIT 1;
    IF (FOUND) THEN
      RETURN -6;
    END IF;
  END IF;

  IF (_routings) THEN
    DELETE FROM xtmfg.boohead
    WHERE (boohead_item_id=pItemid);
  END IF;

  IF (_bbom) THEN
    DELETE FROM xtmfg.bbomitem
    WHERE (bbomitem_parent_item_id=pItemid);
    DELETE FROM xtmfg.bbomitem
    WHERE (bbomitem_item_id=pItemid);
  END IF;

  RETURN public.deleteitem(pItemid);

END;
$$ LANGUAGE 'plpgsql';
