CREATE OR REPLACE FUNCTION xwd.convToNum(pInput TEXT) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _result NUMERIC DEFAULT NULL;

BEGIN

    BEGIN
        _result := pInput::NUMERIC;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Invalid numeric value: "%".  Returning NULL.', pInput;
        RETURN NULL;
    END;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

