CREATE OR REPLACE FUNCTION getunassignedaccntid()
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _test INTEGER;
  _returnVal INTEGER;
BEGIN
-- Check Multi-Company scenario.  We cannot post across company GL Accounts
-- so have to raise an error in this scenario (#20982)
  SELECT fetchMetricValue('GLCompanySize') INTO _test;

  IF (_test IS NULL OR _test > 0) THEN
    RAISE EXCEPTION 'You have selected an invalid G/L Account in a multi-company scenario.  Please check your account assignment.';
  END IF;
  
  SELECT fetchMetricValue('UnassignedAccount') INTO _test;

  IF (_test IS NULL) THEN
    RAISE EXCEPTION 'Metric not found for UnassignedAccount';
  END IF;

  SELECT accnt_id INTO _returnVal
  FROM accnt
  WHERE (accnt_id=_test);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Metric UnassignedAccount is an invalid G/L Account';
  END IF;

  RETURN _returnVal;
END;
$BODY$
  LANGUAGE plpgsql;
