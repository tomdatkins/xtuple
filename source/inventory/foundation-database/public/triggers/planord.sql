SELECT dropIfExists('TRIGGER', 'planordTrigger');

CREATE OR REPLACE FUNCTION _planordTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  --- clear the number from the issue cache
  PERFORM clearNumberIssue('PlanNumber', NEW.planord_number);

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER planordTrigger AFTER INSERT ON planord FOR EACH ROW EXECUTE PROCEDURE _planordTrigger();
