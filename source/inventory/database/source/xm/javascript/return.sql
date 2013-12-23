select xt.install_js('XM','Return','inventory', $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  /**
    Returns a list of UUIDs of any lines in this return that have itemsites under 
    inventory control

    @param {String} Return number
  */
  XM.Return.getControlledLines = function(returnNumber) {
    /* similar to XM.Location.requiresDetail on the client, but accessing that
      would have been torturous */
    var sql = "select cmitem.obj_uuid as uuid " +
      "from cmhead " +
      "inner join cmitem on cmhead_id = cmitem_cmhead_id " +
      "inner join itemsite on cmitem_itemsite_id = itemsite_id " +
      "where (itemsite_loccntrl = true or itemsite_controlmethod in ('S', 'L')) " +
      "and cmitem_updateinv = true " +
      "and cmhead_number = $1";

    /* TODO: probably want to return all updateinv = true, with a flag if it's under control */
    return plv8.execute(sql, [returnNumber]).map(function (row) {
      return row.uuid;
    });
  };

  /**
    

  */
  XM.Return.postWithInventory = function(returnNumber, orderLines) {
    /* step 1: trick out the post function by setting updateInventory to false */
    /* assumption: all the order lines are going to have updateInventory to be true */

    var setUpdateInvSql = "update cmitem set cmitem_updateinv = $2 where obj_uuid = $1";
    orderLines.map(function (orderLine) {
      plv8.execute(setUpdateInvSql, [orderLine.orderLine, false]);
    });

    /* step 2: run the post function */
    XM.Return.post(returnNumber);

    /* step 3: reinstate the updateInventory values */
    orderLines.map(function (orderLine) {
      plv8.execute(setUpdateInvSql, [orderLine.orderLine, true]);
    });

    /* step 4: run the receipt function */
    orderLines.map(function (orderLine) {
      XM.Inventory.receipt(orderLine);
    });
  };
}());
  
$$ );


