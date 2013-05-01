CREATE OR REPLACE FUNCTION te.triggerteprj() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _update BOOLEAN := false;
BEGIN

  IF (TG_OP = 'INSERT') THEN
    _update = true;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (COALESCE(OLD.teprj_cust_id,-1) != COALESCE(NEW.teprj_cust_id,-1)) THEN
      _update = true;
    END IF;
  END IF;

  IF (_update) THEN
      UPDATE te.teprjtask SET teprjtask_cust_id=NEW.teprj_cust_id
      FROM prjtask
      WHERE ((teprjtask_prjtask_id=prjtask_id)
      AND (prjtask_prj_id=NEW.teprj_prj_id));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';