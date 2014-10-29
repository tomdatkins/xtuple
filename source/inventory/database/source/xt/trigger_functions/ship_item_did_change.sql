create or replace function xt.ship_item_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var shipitemId = TG_OP === 'DELETE' ? OLD.shipitem_id : NEW.shipitem_id;

  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

  /* replace monolithic query that gave the query optimizer fits with a short
     series of queries that find the obj_uuid of the xt.ordhead record */
  var sqlShipmentQ = "select shipitem_orderitem_id, shiphead_order_type " +
                   "from shiphead " +
                   "join shipitem on shiphead_id=shipitem_shiphead_id " +
                   "where shipitem_id = $1;",
    sqlOrditemQ = "select orditem_ordhead_id " +
                  "from xt.orditem " +
                  "where (transacted_balance - at_dock) = 0 " +
                  "and orditem_id=$1;",
    sqlOrdheadQ = "select obj_uuid " +
                  "from xt.ordhead " +
                  "where ordhead_type = $1 " +
                  "and ordhead_id in ({list});",
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

  shipment = plv8.execute(sqlShipmentQ, [shipitemId]);
  if (shipment.length > 0) {    /* 0 or 1 row */
    orditem = plv8.execute(sqlOrditemQ,  [shipment[0].shipitem_orderitem_id]);
    if (orditem.length > 0) {   /* max = # order types, sqlOrdheadQ limits to 0-1 */
      ordhead  = plv8.execute(sqlOrdheadQ.replace(/{list}/g,
                                                  orditem.map(function (row) {
                                                    return row.orditem_ordhead_id;
                                                  }).join(",")),
                              [shipment[0].shiphead_order_type]);

      ordhead.map(function (row) {
        var results = plv8.execute(sqlSuccessors, [row.obj_uuid]);

        /* Notify affected users */
        var res = plv8.execute(sqlNotify, [row.obj_uuid]);

        /* Update the workflow items */
        var upd = plv8.execute(sqlUpdate, [row.obj_uuid]);

        /* Update all the successors of all the workflow items */
        results.map(function (result) {
          if(result.wf_completed_successors) {
            result.wf_completed_successors.split(",").map(function (successor) {
              var updsucc = plv8.execute(sqlUpdateSuccessor, [successor]);
            });
          }
        });

      });
    }
  }

  return TG_OP === 'DELETE' ? OLD : NEW;

}());

$$ language plv8;
