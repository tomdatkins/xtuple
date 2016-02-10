
CREATE OR REPLACE FUNCTION qtyReservedLocation(pItemlocid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _qty         NUMERIC;

BEGIN

  RETURN qtyReservedLocation(pItemlocid, NULL, NULL);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION qtyReservedLocation(pItemlocid INTEGER,
                                               pOrdertype TEXT,
                                               pOrderid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _qty         NUMERIC;

BEGIN
  SELECT COALESCE(SUM(reserve_qty), 0) INTO _qty
    FROM reserve JOIN itemloc ON (itemloc_id=reserve_supply_id AND reserve_supply_type='I')
   WHERE ( (itemloc_id=pItemlocid)
     AND   (reserve_status='R')
     AND   ((pOrdertype IS NULL) OR (pOrdertype=reserve_demand_type))
     AND   ((pOrderid IS NULL) OR (pOrderid=reserve_demand_id)) );

  RETURN _qty;

END;
$$ LANGUAGE plpgsql;
