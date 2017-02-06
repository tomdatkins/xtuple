CREATE OR REPLACE FUNCTION reserveAllSoBalance(pCoheadid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN
   FOR _r IN SELECT coitem_id
               FROM coitem
              WHERE((coitem_status NOT IN ('X', 'C'))
                AND (coitem_cohead_id=pCoheadid))
              ORDER BY coitem_scheddate, coitem_created LOOP
    PERFORM reserveSoLineBalance(_r.coitem_id);
  END LOOP;

  RETURN 0;

END;
$$ LANGUAGE plpgsql;
