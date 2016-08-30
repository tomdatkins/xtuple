CREATE OR REPLACE FUNCTION isCreditCardFundsType(pFundsTypeCode text) RETURNS BOOLEAN IMMUTABLE AS $$
-- Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal BOOLEAN;
BEGIN
  IF (pFundsTypeCode IS NULL) THEN
    RAISE EXCEPTION 'A fundstype_code is required to check if the fundstype is a credit card.';
  END IF;

  SELECT
    fundstype_creditcard INTO _returnVal
  FROM fundstype
  WHERE fundstype_code = pFundsTypeCode;

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'fundstype_code code % not found.', pFundsTypeName;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
