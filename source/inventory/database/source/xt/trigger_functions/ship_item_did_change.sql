create or replace function xt.ship_item_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var shipitemId = TG_OP === 'DELETE' ? OLD.shipitem_id : NEW.shipitem_id;
  
  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  var sqlQuery = "select ordhead.obj_uuid as uuid " +
      "from shipitem " +
      "inner join xt.orditem on shipitem_orderitem_id = orditem_id " +
      "inner join xt.ordhead on orditem_ordhead_id = ordhead_id " +
      "where shipitem_id = $1 " +
      "group by ordhead_id, ordhead.obj_uuid " +
      "having sum(transacted_balance - at_dock) = 0;",
    sqlSuccessors = "select wf_completed_successors " +
        "from xt.wf " +
        "where wf_parent_uuid = $1 " +
        "and wf_type = 'P' " + 
        "and wf_status in ('I', 'P');",
    sqlUpdate = "update xt.wf " +
        "set wf_status = 'C' " +
        "where wf_parent_uuid = $1 " +
        "and wf_type = 'P' " + 
        "and wf_status in ('I', 'P');",
    sqlNotify = "select xt.workflow_notify(wf.obj_uuid) " +
        "from xt.wf " +
        "where wf_parent_uuid = $1 " +
        "and wf_type = 'P' " + 
        "and wf_status in ('I', 'P');",
    sqlUpdateSuccessor = "update xt.wf " +
        "set wf_status = 'I' " +
        "where obj_uuid = $1;",
    rows = plv8.execute(sqlQuery, [shipitemId]);

  rows.map(function (row) {
    var results = plv8.execute(sqlSuccessors, [row.uuid]);

    /* Notify affected users */
    var res = plv8.execute(sqlNotify, [row.uuid]);
    
    /* Update the workflow items */
    plv8.execute(sqlUpdate, [row.uuid]);

    /* Update all the successors of all the workflow items */
    results.map(function (result) {
      if(result.wf_completed_successors) {
        result.wf_completed_successors.split(",").map(function (successor) {
          plv8.execute(sqlUpdateSuccessor, [successor]);
        });
      }
    });
    
  });

  return TG_OP === 'DELETE' ? OLD : NEW;

}());

$$ language plv8;
