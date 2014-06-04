CREATE OR REPLACE FUNCTION xwd.convToNum(pInput TEXT) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result NUMERIC DEFAULT NULL;

BEGIN

    BEGIN
        _result := pInput::NUMERIC;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Invalid numeric value: "%".  Returning NULL.', pInput;
        RETURN NULL;
    END;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

