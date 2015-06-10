CREATE OR REPLACE FUNCTION _cashrcptitemaftertrigger()
  RETURNS trigger AS
$BODY$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _total      NUMERIC;

BEGIN

  -- Checks
  -- Total Over Application Warning
  SELECT (cashrcpt_amount - SUM(COALESCE(cashrcptitem_amount, 0))) INTO _total
  FROM cashrcptitem JOIN cashrcpt ON (cashrcpt_id=cashrcptitem_cashrcpt_id)
  WHERE (cashrcptitem_cashrcpt_id=NEW.cashrcptitem_cashrcpt_id)
  GROUP BY cashrcpt_amount;
  IF (_total < 0.0) THEN
    RAISE WARNING 'Warning -- the Cash Receipt has been over applied.';
  END IF;
  
  RETURN NEW;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
