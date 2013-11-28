create or replace function xt.ship_head_did_change() returns trigger as $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

  var workflowStatus,
    selectSql,
    updateDateSql,
    results;

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  plv8.elog(NOTICE, "here");
  if (OLD.shiphead_shipped === NEW.shiphead_shipped) {
    /* no change to the ship status: do nothing */
    plv8.elog(NOTICE, "no change");
    return;
  }

  /* ship workflows are completed if the item is shipped, in-process otherwise */
  workflowStatus = NEW.shiphead_shipped ? 'C' : 'I';
  selectSql = "select wf.obj_uuid, orditem_ordhead_id, next_sched_date " +
    "from shiphead " +
    "inner join xt.ordhead on shiphead_order_id = ordhead_id " +
    "left join ( " +
    "select orditem_ordhead_id, min(orditem_scheddate) as next_sched_date " +
    "  from xt.orditem " +
    "  where ship_balance - at_shipping <> 0 " +
    "  group by orditem_ordhead_id " +
    ") itemsummary on ordhead_id = orditem_ordhead_id " +
    "inner join xt.wf on ordhead.obj_uuid = wf_parent_uuid " +
    "where shiphead.shiphead_id = $1 " +
    "and wf_type = 'S' ";
  updateDateSql = "update xt.wf set wf_due_date = $1 where obj_uuid = $2";
  updateStatusSql = "update xt.wf set wf_status = $1 where obj_uuid = $2";
  results = plv8.execute(selectSql, [NEW.shiphead_id]);

  plv8.elog(NOTICE, "sql", selectSql, NEW.shiphead_id);
  plv8.elog(NOTICE, "res", JSON.stringify(results));
  results.map(function (result) {
    plv8.elog(NOTICE, "act on", result.obj_uuid, workflowStatus, result.orditem_ordhead_id);
    if(NEW.shiphead_shipped && result.orditem_ordhead_id) {
      /* the item is shipped but outstanding line items exist */
      plv8.execute(updateDateSql, [result.next_sched_date, result.obj_uuid]);
    } else {
      /* no outstanding line items exist. Take the appropriate action. */
      plv8.execute(updateStatusSql, [workflowStatus, result.obj_uuid]);
    }

  });


$$ language plv8;
