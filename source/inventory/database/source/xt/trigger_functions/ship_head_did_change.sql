create or replace function xt.ship_head_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var workflowStatus,
    selectSql,
    updateDateSql,
    notifySql,
    successorsSql,
    updateSuccessorsSql,
    results;

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  if (OLD.shiphead_shipped === NEW.shiphead_shipped) {
    /* no change to the ship status: do nothing */
    return;
  }

  /* ship workflows are completed if the item is shipped, in-process otherwise */
  workflowStatus = NEW.shiphead_shipped ? 'C' : 'I';
  selectSql = "select wf.obj_uuid, orditem_ordhead_id, next_sched_date, ordhead.obj_uuid as ordhead_obj_uuid " +
    "from shiphead " +
    "inner join xt.ordhead on shiphead_order_id = ordhead_id " +
    "left join ( " +
    "select orditem_ordhead_id, min(orditem_scheddate) as next_sched_date " +
    "  from xt.orditem " +
    "  where transacted_balance - at_dock <> 0 " +
    "  group by orditem_ordhead_id " +
    ") itemsummary on ordhead_id = orditem_ordhead_id " +
    "inner join xt.wf on ordhead.obj_uuid = wf_parent_uuid " +
    "where shiphead.shiphead_id = $1 " +
    "and wf_type = 'S';";
  updateDateSql = "update xt.wf set wf_due_date = $1 where obj_uuid = $2;";
  updateStatusSql = "update xt.wf set wf_status = $1 where obj_uuid = $2;";
  notifySql = "select xt.workflow_notify($1);";
  successorsSql = "select wf_completed_successors " +
    "from xt.wf " +
    "where wf_parent_uuid = $1 " +
    "and wf_type = 'S' " + 
    "and wf_status in ('I', 'P'); ";
  updateSuccessorSql = "update xt.wf " +
    "set wf_status = 'I' " +
    "where obj_uuid = $1; ";
  results = plv8.execute(selectSql, [NEW.shiphead_id]);

  results.map(function (result) {
    /* Before updating, get the successors (if there are any) */
    successorsResults = plv8.execute(successorsSql, [result.ordhead_obj_uuid]);

    if(NEW.shiphead_shipped && result.orditem_ordhead_id) {
      /* the item is shipped but outstanding line items exist */
      plv8.execute(updateDateSql, [result.next_sched_date, result.obj_uuid]);
    } else {
      /* no outstanding line items exist. Take the appropriate action. */
      plv8.execute(updateStatusSql, [workflowStatus, result.obj_uuid]);
    }
    /* in either case we notify the affected parties */
    plv8.execute(notifySql, [result.obj_uuid]);
    
    /* Update all the successors of all the workflow items */
    successorsResults.map(function (result) {
      if(result.wf_completed_successors) {
        result.wf_completed_successors.split(",").map(function (successor) {
          plv8.execute(updateSuccessorSql, [successor]);
        });
      }
    });
  });

  return NEW;

}());

$$ language plv8;