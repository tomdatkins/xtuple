create or replace function xt.ship_item_did_change() returns trigger as $$
/* Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/EULA for the full text of the software license. */

return (function () {

  var shipheadId = TG_OP === 'DELETE' ? OLD.shipitem_shiphead_id : NEW.shipitem_shiphead_id;

  /* replace monolithic query that gave the query optimizer fits with a short
     series of queries that find the obj_uuid of the xt.ordhead record */
  var sqlShipmentQ = "select shiphead_order_id, shiphead_order_type " +
        "from shiphead " +
        "where shiphead_id = $1;",
    sqlOrditemQ = "select orditem_ordhead_id " +
        "from xt.orditem " +
        "where orditem_ordhead_uuid = $1 " + 
        "group by orditem_ordhead_id " +
        "having SUM(transacted_balance - at_dock) = 0 ",
    sqlOrdheadQ = "select obj_uuid " +
        "from xt.ordhead " +
        "where ordhead_id = $1 " +
        "and ordhead_type = $2 ",
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
    shipment, orditem, ordhead
    ;

  shipment = plv8.execute(sqlShipmentQ, [shipheadId]);
  if (shipment.length > 0) {    /* 0 or 1 row */
    ordhead = plv8.execute(sqlOrdheadQ,  [shipment[0].shiphead_order_id, shipment[0].shiphead_order_type]);
    if (ordhead.length > 0) {   /* max = # order types, sqlOrdheadQ limits to 0-1 */
      orditem  = plv8.execute(sqlOrditemQ, [ordhead[0].obj_uuid]);
      if (orditem.length > 0) {
        var results = plv8.execute(sqlSuccessors, [ordhead[0].obj_uuid]);

        /* Notify affected users */
        var res = plv8.execute(sqlNotify, [ordhead[0].obj_uuid]);

        /* Update the workflow items */
        var upd = plv8.execute(sqlUpdate, [ordhead[0].obj_uuid]);

        /* Update all the successors of all the workflow items */
        results.map(function (result) {
          if(result.wf_completed_successors) {
            result.wf_completed_successors.split(",").map(function (successor) {
              var updsucc = plv8.execute(sqlUpdateSuccessor, [successor]);
            });
          }
        });
      }
    }
  }

  return TG_OP === 'DELETE' ? OLD : NEW;

}());

$$ language plv8;