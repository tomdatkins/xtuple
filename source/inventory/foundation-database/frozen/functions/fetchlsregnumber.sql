CREATE OR REPLACE FUNCTION fetchlsregnumber() RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _number TEXT;

BEGIN

  SELECT CAST(nextval('lsreg_number_seq') AS text) INTO _number;

  RETURN _number;
  
END;
$$ LANGUAGE 'plpgsql';

