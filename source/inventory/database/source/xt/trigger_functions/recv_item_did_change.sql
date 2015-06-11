create or replace function xt.recv_item_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var recvId = TG_OP === 'DELETE' ? OLD.recv_id : NEW.recv_id;

  /* Use a WITH CTE query to fix performance issues. This allows us to pass the */
  /* `AND orditem_ordhead_id = (SELECT ordhead_id FROM ordhead)` clause directly */
  /* down to the unions in xt.orditem and use index scans instead of seq scans. */
  var querySql = "WITH " +
      "recv_order AS ( " +
      "  SELECT " +
      "    recv_order_number, " +
      "    recv_order_type, " +
      "    recv_posted " +
      "  FROM recv " +
      "  WHERE true " +
      "    AND recv_id = $1 " +
      "), " +
      "ordhead AS ( " +
      "  SELECT " +
      "    ordhead_id, " +
      "    ordhead.obj_uuid as uuid, " +
      "    recv_posted AS posted " +
      "  FROM xt.ordhead " +
      "  INNER JOIN recv_order ON recv_order_number = ordhead_number AND recv_order_type = ordhead_type " +
      "  WHERE true " +
      "    AND ordhead_number = (SELECT recv_order_number FROM recv_order) " +
      "    AND ordhead_type = (SELECT recv_order_type FROM recv_order) " +
      ") " +
      "SELECT " +
      "  ordhead.uuid as uuid, " +
      "  ordhead.posted " +
      "FROM ordhead " +
      "INNER JOIN xt.orditem ON ordhead.ordhead_id = orditem_ordhead_id " +
      "WHERE true " +
      "  AND orditem_ordhead_id = (SELECT ordhead_id FROM ordhead) " +
      "GROUP BY uuid, posted " +
      "HAVING SUM(transacted_balance - at_dock) = 0;",
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
    wfType = (rows[0] && rows[0].recv_posted) ? 'T' : 'R';

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
