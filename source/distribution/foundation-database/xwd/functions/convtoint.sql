CREATE OR REPLACE FUNCTION xwd.convToInt(pInput TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result INTEGER DEFAULT NULL;

BEGIN

    BEGIN
        _result := pInput::INTEGER;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Invalid integer value: "%".  Returning NULL.', pInput;
        RETURN NULL;
    END;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

