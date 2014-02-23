create or replace function xt.recv_item_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var recvId = TG_OP === 'DELETE' ? OLD.recv_id : NEW.recv_id;
  
  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  var querySql = "select ordhead.obj_uuid as uuid " +
      "from recv " +
      "inner join xt.orditem on recv_orderitem_id = orditem_id " +
      "inner join xt.ordhead on orditem_ordhead_id = ordhead_id " +
      "where recv_id = $1 " +
      "group by ordhead_id, ordhead.obj_uuid " +
      "having sum(transacted_balance - at_dock) = 0;",
    wfTypeSql = "select ordhead_id " +
      "from recv " +
      "inner join xt.orditem on recv_orderitem_id = orditem_id " +
      "inner join xt.ordhead on orditem_ordhead_id = ordhead_id " +
      "where recv_id = $1 " +
      "and recv_posted " +
      "group by ordhead_id, ordhead.obj_uuid " +
      "having sum(transacted_balance - at_dock) = 0;",
    successorsSql = "select wf_completed_successors " +
        "from xt.wf " +
        "where wf_parent_uuid = $1 " +
        "and wf_type = $2 " + 
        "and wf_status in ('I', 'P');",
    updateSql = "update xt.wf " +
        "set wf_status = 'C' " +
        "where wf_parent_uuid = $1 " +
        "and wf_type = $2 " + 
        "and wf_status in ('I', 'P');",
    notifySql = "select xt.workflow_notify(wf.obj_uuid) " +
        "from xt.wf " +
        "where wf_parent_uuid = $1 " +
        "and wf_type = $2 " + 
        "and wf_status in ('I', 'P');",
    updateSuccessorSql = "update xt.wf " +
        "set wf_status = 'I' " +
        "where obj_uuid = $1;",
    rows = plv8.execute(querySql, [recvId]),
    wfType = plv8.execute(wfTypeSql, [recvId])[0] ? 'T' : 'R';

  rows.map(function (row) {
    var results = plv8.execute(successorsSql, [row.uuid, wfType]);

    /* Notify affected users */
    var res = plv8.execute(notifySql, [row.uuid, wfType]);
    
    /* Update the workflow items */
    plv8.execute(updateSql, [row.uuid, wfType]);

    /* Update all the successors of all the workflow items */
    results.map(function (result) {
      if(result.wf_completed_successors) {
        result.wf_completed_successors.split(",").map(function (successor) {
          plv8.execute(updateSuccessorSql, [successor]);
        });
      }
    });
    
  });

  return TG_OP === 'DELETE' ? OLD : NEW;

}());

$$ language plv8;
