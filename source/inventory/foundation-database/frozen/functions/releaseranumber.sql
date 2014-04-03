CREATE OR REPLACE FUNCTION releaseRANumber(TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
  select releaseNumber('RaNumber', $1::INTEGER) > 0;
$$ LANGUAGE sql;
