-- Function: workflow.send_printparam_to_batch()

-- DROP FUNCTION workflow.send_printparam_to_batch();

CREATE OR REPLACE FUNCTION workflow.send_printparam_to_batch()
  RETURNS trigger AS
$BODY$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */
plv8.elog(WARNING, "send_printparam_to_batch: NEW.wf_id is " + NEW.wf_id + ", NEW.wf_status is " + NEW.wf_status);

return (function () { 

/* check for wf_printparam */
  var printparamSQL = "SELECT true FROM workflow.wf_printparam "
      + " WHERE wf_printparam_parent_uuid = $1 limit 1" ; 
  var printparam = plv8.execute(printparamSQL, [NEW.obj_uuid]);

  if (printparam) {
  /* create new batch job
   * and copy printparam to batchparam */
   
     var insertbatchSQL = "INSERT INTO xtbatch.batch "
        + " (batch_action, batch_parameter, "
        + "  batch_user, batch_submitted, batch_scheduled) "
        + " VALUES "
        + " ('RunReport', 'Send workflow report to designated printer', "
        + "  current_user, localtimestamp, localtimestamp) "
        + " RETURNING batch_id" ;
  
     var insertbatch = plv8.execute(insertbatchSQL);
      
     insertbatch.map(function (items) {
     
        plv8.elog(WARNING, "batch_id is " + items.batch_id + ", wf_printparam_parent_uuid is " + NEW.obj_uuid);

        var insertbatchparamSQL = "INSERT INTO xtbatch.batchparam "
        + " (batchparam_batch_id, batchparam_order, "
        + "  batchparam_name, batchparam_value, batchparam_type) "
        + " (SELECT $1 AS batch_id, wf_printparam_order, "
        + "  wf_printparam_name, wf_printparam_value, wf_printparam_type "
        + " FROM workflow.wf_printparam "
        + " WHERE wf_printparam_parent_uuid = $2) "; 
        
        plv8.execute(insertbatchparamSQL, [items.batch_id, NEW.obj_uuid]);
     });
     return NEW;
  } 

 }()); 

$BODY$
  LANGUAGE plv8;
ALTER FUNCTION workflow.send_printparam_to_batch()
  OWNER TO admin;
GRANT ALL ON FUNCTION workflow.send_printparam_to_batch() TO xtrole;
