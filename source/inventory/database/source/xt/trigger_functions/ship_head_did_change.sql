create or replace function xt.ship_head_did_change() returns trigger as $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  if (OLD.shiphead_shipped === NEW.shiphead_shipped) {
    /* no change to the ship status: do nothing */
    return;
  }

  /* ship workflows are completed if the item is shipped, in-process otherwise */
  var workflowStatus = NEW.shiphead_shipped ? 'C' : 'I';
  var selectSql = "select wf.obj_uuid, orditem_ordhead_id, next_sched_date " +
    "from shiphead " +
    "inner join xt.ordhead on shiphead_order_id = ordhead_id " +
    "inner join ( " +
    "select orditem_ordhead_id, min(orditem_scheddate) as next_sched_date " +
    "  from xt.orditem " +
    "  where ship_balance - at_shipping <> 0 " +
    "  group by orditem_ordhead_id " +
    ") itemsummary on ordhead_id = orditem_ordhead_id " +
    "inner join xt.wf on ordhead.obj_uuid = wf_parent_uuid " +
    "where shiphead.shiphead_id = $1 " +
    "and wf_type = 'S' ";
  var results = plv8.execute(selectSql, [NEW.shiphead_id]);

  results.map(function (result) {
    if(NEW.shiphead_shipped && result.orditem_ordhead_id) {
      /* the item is shipped but outstanding line items exist */
      /* TODO */      
    } else {
      /* no outstanding line items exist. Take the appropriate action. */
      /* TODO */
    }

  });


$$ language plv8;
