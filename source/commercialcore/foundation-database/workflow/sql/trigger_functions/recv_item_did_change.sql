create or replace function xt.recv_item_did_change() returns trigger as $$
/* Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/EULA for the full text of the software license. */

return (function () {

  var recvOrderNumber = TG_OP === 'DELETE' ? OLD.recv_order_number : NEW.recv_order_number;
  var recvOrderType = TG_OP === 'DELETE' ? OLD.recv_order_type : NEW.recv_order_type;
  var recvPosted = TG_OP === 'DELETE' ? OLD.recv_posted : NEW.recv_posted;
  var orderUuidSql = "SELECT ordhead.obj_uuid AS uuid " +
  "FROM xt.ordhead " +
  "WHERE ordhead_number = $1 " + 
  "  AND ordhead_type = $2; ",
    unfulfilledItemsSql = "SELECT orditem.obj_uuid as uuid " +
      "FROM xt.orditem " +
      "WHERE orditem_ordhead_uuid = $1 " +
      "  AND (CASE WHEN $2 THEN (orditem_qtyord > orditem_qtytransacted) " +
      "  ELSE (orditem_qtyord > at_dock) END); ",
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
    orderUuid = plv8.execute(orderUuidSql, [recvOrderNumber, recvOrderType])[0].uuid,
    rows = plv8.execute(unfulfilledItemsSql, [orderUuid, recvPosted]);

  if (!rows.length) {
    wfType = (TG_OP === 'DELETE' ? OLD.recv_posted : NEW.recv_posted) ? 'T' : 'R';
    var results = plv8.execute(successorsSql, [orderUuid, wfType]);

    /* Notify affected users */
    var res = plv8.execute(notifySql, [orderUuid, wfType]);

    /* Update the workflow items */
    plv8.execute(updateSql, [orderUuid, wfType]);

    /* Update all the successors of all the workflow items */
    results.map(function (result) {
      if(result.wf_completed_successors) {
        result.wf_completed_successors.split(",").map(function (successor) {
          plv8.execute(updateSuccessorSql, [successor]);
        });
      }
    });
  }

  return TG_OP === 'DELETE' ? OLD : NEW;

}());

$$ language plv8;
