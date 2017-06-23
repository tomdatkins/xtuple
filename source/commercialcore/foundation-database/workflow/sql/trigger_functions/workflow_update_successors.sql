CREATE OR REPLACE FUNCTION xt.workflow_update_successors()
  RETURNS trigger AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  IF (OLD.wf_status = NEW.wf_status) THEN
    RETURN NEW;
  END IF;

  IF (NEW.wf_status = 'C') THEN -- Completed
    -- Workflow completion is generally handled by document status changes
  END IF;
  
  IF (NEW.wf_status = 'D') THEN -- Deferred
     UPDATE xt.wf SET wf_status = 'I'
     WHERE obj_uuid::text IN (select unnest(string_to_array(wf_deferred_successors,','))
                        from xt.wf
                        where obj_uuid = NEW.obj_uuid)
       AND wf_status = 'P';
       
     -- Workflow notifications  
     SELECT xt.workflow_notify(obj_uuid)
     FROM xt.wf
     WHERE obj_uuid::text IN (select unnest(string_to_array(wf_deferred_successors,','))
                        from xt.wf
                        where obj_uuid = NEW.obj_uuid)
       AND wf_status = 'I';     
  END IF;
  
  RETURN NEW;
  
END;
$$ LANGUAGE plpgsql;
