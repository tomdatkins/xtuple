select xt.install_js('XM','Return','inventory', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  /**
    

  */
  XM.Return.postWithInventory = function(returnNumber, orderLines) {
    /* step 1: trick out the post function by setting updateInventory to false */
    /* only necessary for orderlines with inventory control detail */
    var setUpdateInvSql = "update cmitem set cmitem_updateinv = $2 where obj_uuid = $1",
      controlledLines = orderLines.filter(function (line) {
        return line.options.detail;
      });

    controlledLines.map(function (orderLine) {
      plv8.execute(setUpdateInvSql, [orderLine.orderLine, false]);
    });

    /* step 2: run the post function and post the inventory */
    var itemLocSeries = XM.Return.post(returnNumber);
    /* Post the inventory  */
    XM.PrivateInventory.distribute(itemLocSeries);

    /* Make the invchead not posted because of*/
    plv8.execute("update cmhead set cmhead_posted = false where cmhead_number = $1", [returnNumber]);

    /* step 3: reinstate the updateInventory values */
    controlledLines.map(function (orderLine) {
      plv8.execute(setUpdateInvSql, [orderLine.orderLine, true]);
    });

    /* step 4: run the distribution function */
    controlledLines.map(function (orderLine) {
      var series = plv8.execute("select nextval('itemloc_series_seq') as series")[0].series,
        detailSql = "select itemsite_id, costcat_asset_accnt_id, item_number, " +
          "cmitem_qtyreturned, item_number, stdcost(item_id) as stdcost " +
          "from cmitem " +
          "inner join itemsite on cmitem_itemsite_id = itemsite_id " +
          "inner join item on itemsite_item_id = item_id " +
          "inner join costcat on itemsite_costcat_id = costcat_id " +
          "where cmitem.obj_uuid = $1;",
        detail = plv8.execute(detailSql, [orderLine.orderLine])[0];

      XT.executeFunction("postInvTrans", [
        detail.itemsite_id, 
        'RS', 
        detail.cmitem_qtyreturned,
        'S/O', 
        'CM', 
        returnNumber, 
        '',
        'Credit Return ' + detail.item_number,
        detail.costcat_asset_accnt_id,
        null, /* getPrjAccntId */
        series, 
        null, /* glDate, */
        detail.stdcost
      ]);
      XM.PrivateInventory.distribute(series, orderLine.options.detail);
    });

    /* Switch it back to Posted */
    plv8.execute("update cmhead set cmhead_posted = true where cmhead_number = $1", [returnNumber]);

  };
}());
  
$$ );
