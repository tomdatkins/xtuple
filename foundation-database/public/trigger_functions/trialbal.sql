CREATE OR REPLACE FUNCTION _trialbalaltertrigger()
  RETURNS trigger AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _accntid INTEGER[];
BEGIN
  IF(TG_OP='DELETE') THEN
    RAISE EXCEPTION 'You may not delete Trial Balance Transactions.';
  END IF;

  IF (coalesce(fetchMetricValue('GLCompanySize'),0) = 0) THEN
  --  Retained Earnings account
      _accntid := fetchmetricvalue('YearEndEquityAccount');
  ELSE
  --  Multi-company Retained Earnings setup
      _accntid := (SELECT array_agg(company_yearend_accnt_id)
                  FROM company);
  END IF;    

  If (NEW.trialbal_accnt_id = ANY(_accntid) OR (NEW.trialbal_beginning = 0.00 AND NEW.trialbal_ending = 0.00)) THEN 
    --  Dont check new accounts or Retained Earnings account 
  ELSE
    IF (SELECT period_closed FROM period WHERE period_id=NEW.trialbal_period_id) THEN
      RAISE EXCEPTION 'You may not alter Trial Balance records in a closed Period.';
    END IF;
  END IF;  
  
  RETURN NEW;
END;
$$   LANGUAGE plpgsql;

SELECT dropIfExists('TRIGGER', 'trialbalaltertrigger');
CREATE TRIGGER trialbalaltertrigger BEFORE INSERT OR UPDATE OR DELETE
  ON trialbal FOR EACH ROW EXECUTE PROCEDURE _trialbalaltertrigger();
