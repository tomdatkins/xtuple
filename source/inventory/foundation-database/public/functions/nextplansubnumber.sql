
CREATE OR REPLACE FUNCTION nextPlanSubnumber(integer) RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
SELECT COALESCE((MAX(planord_subnumber) + 1), 1)
FROM planord
WHERE (planord_number=($1));
$$ LANGUAGE 'sql';

