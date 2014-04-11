CREATE OR REPLACE FUNCTION deactivateRev(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRevid ALIAS FOR $1;
  _r RECORD;
  _check BOOLEAN;

BEGIN
  --Check for valid status
  SELECT *, fetchMetricBool('BOOSubstitute') AS boosubstitute
  INTO _r 
  FROM rev WHERE (rev_id=pRevid);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Revision not found';
  END IF;

  IF (_r.rev_status != 'S') THEN
    RAISE EXCEPTION 'Only Substitute Revisions may be deactivated';
  END IF;

  SELECT checkPrivilege('MaintainRevisions') INTO _check;
  IF NOT (_check) THEN
    RAISE EXCEPTION 'You do not have privileges to deactivate a revision.';
  END IF;

  --Deactivate this revision
  UPDATE rev SET rev_status='I',rev_expires=current_date 
  WHERE (rev_id=pRevid);

  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';
