
CREATE OR REPLACE FUNCTION fetchPlanNumber() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
  select fetchNextNumber('PlanNumber')::INTEGER;
$$ LANGUAGE 'sql';

