CREATE OR REPLACE FUNCTION fetchRaNumber() RETURNS TEXT AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
  select fetchNextNumber('RaNumber');
$$ LANGUAGE 'sql';
