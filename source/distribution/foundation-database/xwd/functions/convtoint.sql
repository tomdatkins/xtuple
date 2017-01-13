CREATE OR REPLACE FUNCTION xwd.convToInt(pInput TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _result INTEGER DEFAULT NULL;

BEGIN

    BEGIN
        _result := pInput::INTEGER;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Invalid integer value: "%".  Returning NULL.', pInput;
        RETURN NULL;
    END;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

