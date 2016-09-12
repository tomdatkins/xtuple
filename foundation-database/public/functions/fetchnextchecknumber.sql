
CREATE OR REPLACE FUNCTION fetchNextCheckNumber(pBankaccntid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankaccntid ALIAS FOR $1;
  _nextChkNumber INTEGER;
  _checkheadid INTEGER;

BEGIN

  SELECT bankaccnt_nextchknum INTO _nextChkNumber
  FROM bankaccnt
  WHERE (bankaccnt_id=pBankaccntid);

  IF NOT fetchmetricbool('ReprintPaymentNumbers') THEN
    SELECT MIN(generate_series) INTO _nextChkNumber
    FROM generate_series(_nextChkNumber, (SELECT MAX(checkhead_number)+1
                             FROM checkhead
                             WHERE checkhead_bankaccnt_id=pBankaccntid))
    LEFT OUTER JOIN checkhead ON checkhead_number=generate_series
    AND checkhead_bankaccnt_id=pBankaccntid
    WHERE checkhead_number IS NULL;
  END IF;

  UPDATE bankaccnt
  SET bankaccnt_nextchknum = (_nextChkNumber + 1)
  WHERE (bankaccnt_id=pBankaccntid);

  RETURN _nextChkNumber;

END;
$$ LANGUAGE plpgsql;

