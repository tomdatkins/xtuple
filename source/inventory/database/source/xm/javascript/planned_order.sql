select xt.install_js('XM','PlannedOrder','inventory', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  XM.PlannedOrder = XM.PlannedOrder || {};

  XM.PlannedOrder.isDispatchable = true;

  /**
    Firm a planned order.

    @param {String} Uuid
  */
  XM.PlannedOrder.firm = function(id) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "PlannedOrder"),
      sql = "update planord set planord_firm=true where planord_id=$1;";

    /* Resolve to internal id */
    id = data.getId(orm, id);

    /* Do the work */
    plv8.execute(sql, [id]);
    XT.executeFunction("explodeplannedorder", [id, true]);

    return true;
  };

  /**
    Soften a planned order.

    @param {String} Uuid
  */
  XM.PlannedOrder.soften = function(id) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "PlannedOrder"),
      sql = "update planord set planord_firm=false where planord_id=$1;";

    /* Resolve to internal id */
    id = data.getId(orm, id);

    /* Do the work */
    plv8.execute(sql, [id]);

    return true;
  };

}());
  
$$ );

