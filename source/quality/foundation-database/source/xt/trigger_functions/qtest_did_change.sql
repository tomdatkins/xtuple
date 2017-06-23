CREATE OR REPLACE FUNCTION xt.qtest_did_change()
  RETURNS trigger AS $$
/* Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/EULA for the full text of the software license. */

return (function () {

  if (OLD.qthead_status === NEW.qthead_status || ['P','F'].indexOf(NEW.qthead_status) < 0) {
    /* no change to status: do nothing */
    return;
  }

  var successorsSql = "select wf_completed_successors AS successors " +
        "from xt.wf " +
        "where wf_parent_uuid = $1 " +
        "and wf_type = $2 " +
        "and wf_status in ('I', 'P');",
    deferredSql = "select wf_deferred_successors AS successors " +
        "from xt.wf " +
        "where wf_parent_uuid = $1 " +
        "and wf_type = $2 " +
        "and wf_status in ('I', 'P');",        
    updateSql = "update xt.wf " +
        "set wf_status = $1 " +
        "where wf_parent_uuid = $2 " +
        "and wf_type = $3 " +
        "and wf_status in ('I', 'P');",
    notifySql = "select xt.workflow_notify($1);",
    updateSuccessorSql = "update xt.wf " +
        "set wf_status = 'I' " +
        "where obj_uuid = $1;",
    wfType = 'I',  /* In-Process */
    newStatus;
    
  if (NEW.qthead_status == 'P') {
    var results = plv8.execute(successorsSql, [NEW.obj_uuid, wfType]);
    newStatus = 'C'; /* Completed */
  }  
  else if (NEW.qthead_status == 'F') {
    var results = plv8.execute(deferredSql, [NEW.obj_uuid, wfType]);
    newStatus = 'D'; /* Deferred*/  
  }  
  
  /* Update the workflow items */
  plv8.execute(updateSql, [newStatus, NEW.obj_uuid, wfType]);
  
  /* Update all the successors of all the workflow items */
  results.map(function (result) {
      if(result.successors) {
        result.successors.split(",").map(function (successor) {
          plv8.execute(updateSuccessorSql, [successor]);

          /* Notify affected users */
          var res = plv8.execute(notifySql, [successor]);

        });
      }
    });

  return NEW;

}());

$$
  LANGUAGE plv8;
  

DROP TRIGGER IF EXISTS qtest_did_change ON xt.qthead;

CREATE TRIGGER qtest_did_change
  AFTER UPDATE
  ON xt.qthead
  FOR EACH ROW
  EXECUTE PROCEDURE xt.qtest_did_change();  

