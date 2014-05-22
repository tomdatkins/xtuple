CREATE OR REPLACE FUNCTION activateRev(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRevid ALIAS FOR $1;
  _r RECORD;
  _activerevid INTEGER;
  _bomWorksetid INTEGER;
  _check BOOLEAN;

BEGIN
  --Check for valid status
  SELECT *, fetchMetricBool('BOOSubstitute') AS boosubstitute
  INTO _r 
  FROM rev WHERE (rev_id=pRevid);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Revision not found';
  END IF;

  IF ((_r.rev_status != 'P') AND (_r.rev_status != 'S')) THEN
    RAISE EXCEPTION 'Only Pending and Substitute Revisions may be activated';
  END IF;

  SELECT checkPrivilege('MaintainRevisions') INTO _check;
  IF NOT (_check) THEN
    RAISE EXCEPTION 'You do not have privileges to activate a revision.';
  END IF;

  --Get rev data
  SELECT getActiveRevId(rev_target_type,rev_target_id) INTO _activerevid
  FROM rev
  WHERE (rev_id=pRevid);

  --If BOM, then archive history
  IF (_r.rev_target_type='BOM') THEN
  --Archive BOM
    SELECT indentedbom(_r.rev_target_id) INTO _bomWorksetid;
    INSERT INTO bomhist (bomhist_seq_id,bomhist_rev_id,bomhist_seqnumber,bomhist_item_id,
           bomhist_item_type,bomhist_qtyfxd,bomhist_qtyper,bomhist_scrap,bomhist_status,bomhist_level,
           bomhist_parent_id,bomhist_effective,bomhist_expires,bomhist_stdunitcost,
           bomhist_actunitcost,bomhist_parent_seqnumber,bomhist_createwo,bomhist_issuemethod,
           bomhist_char_id,bomhist_value,bomhist_notes,bomhist_ref)
    SELECT bomwork_id,_activerevid,bomwork_seqnumber,bomwork_item_id,
           bomwork_item_type,bomwork_qtyfxd,bomwork_qtyper,bomwork_scrap,bomwork_status,bomwork_level,
           bomwork_parent_id,bomwork_effective,bomwork_expires,bomwork_stdunitcost,
           bomwork_actunitcost,bomwork_parent_seqnumber,bomwork_createwo,bomwork_issuemethod,
           bomwork_char_id,bomwork_value,bomwork_notes,bomwork_ref 
    FROM bomwork
    WHERE (bomwork_set_id=_bomWorksetid);
    DELETE FROM bomwork WHERE (bomwork_set_id=_bomworksetid);
  
  --Archive cost element data
    INSERT INTO bomhist(bomhist_rev_id, bomhist_parent_id, bomhist_level, bomhist_seqnumber, bomhist_item_id,
                        bomhist_item_type, bomhist_actunitcost, bomhist_stdunitcost)
    SELECT _activerevid, -1, 1, 99999, costelem_id, 'E',
           currToBase(itemcost_curr_id, itemcost_actcost, CURRENT_DATE), itemcost_stdcost
    FROM itemcost, costelem 
    WHERE ( (itemcost_costelem_id=costelem_id)
    AND (NOT itemcost_lowlevel)
    AND (itemcost_item_id=_r.rev_target_id) );
  END IF;

  IF (_r.boosubstitute) THEN
    --Substitute active revision
    UPDATE rev SET rev_status='S' 
    WHERE (rev_id=_activerevid);
  ELSE
    --Deactivate active revision
    UPDATE rev SET rev_status='I',rev_expires=current_date 
    WHERE (rev_id=_activerevid);
  END IF;

  --Activate this revision
  UPDATE rev SET rev_status='A',rev_effective=current_date 
  WHERE (rev_id=pRevid);

  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';
