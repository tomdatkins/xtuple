select xt.install_js('XM','Invoice','inventory', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

 /**
    Returns a list of UUIDs of any lines in this invoice that have itemsites under 
    inventory control

    @param {String} Return number
  */  
  XM.Invoice.getControlledLines = function(invoiceNumber) {
    /* similar to XM.Location.requiresDetail on the client, but accessing that
      would have been torturous */
    var sql = "select invcitem.obj_uuid as uuid, invcitem_billed as billed, " +
      "case when itemsite_loccntrl = true or itemsite_controlmethod in ('S', 'L') " + 
      "then true else false end as invctrl " + 
      "from invchead " + 
      "inner join invcitem on invchead_id = invcitem_invchead_id " + 
      "inner join itemsite on invcitem_item_id = itemsite_item_id AND invcitem_warehous_id = itemsite_warehous_id " +
      "where invcitem_updateinv = true " + 
      "and invchead_invcnumber = $1";

    return plv8.execute(sql, [invoiceNumber]).map(function (row) {
      return {uuid: row.uuid, billed: row.billed, invControl: row.invctrl};
    });
  };

  /**
    

  */
  XM.Invoice.postWithInventory = function(invoiceNumber, orderLines) {
    /* step 1: trick out the post function by setting updateInventory to false */
    /* only necessary for orderlines with inventory control detail */
    var setUpdateInvSql = "update invcitem set invcitem_updateinv = $2 where obj_uuid = $1",
      controlledLines = orderLines.filter(function (line) {
        return line.options.detail;
      });

    controlledLines.map(function (orderLine) {
      plv8.execute(setUpdateInvSql, [orderLine.orderLine, false]);
    });

    /* step 2: run the post function */
    var itemLocSeries = XM.Invoice.post(invoiceNumber); 
    /* Post the inventory  */
    XM.PrivateInventory.distribute(itemLocSeries); 

    /* Make the invchead not posted because of*/
    plv8.execute("update invchead set invchead_posted = false where invchead_invcnumber = $1", [invoiceNumber]);

    /* step 3: reinstate the updateInventory values */
    controlledLines.map(function (orderLine) {
      plv8.execute(setUpdateInvSql, [orderLine.orderLine, true]);
    });

    /* step 4: run the distribution function */
    controlledLines.map(function (orderLine) {
      var series = plv8.execute("select nextval('itemloc_series_seq') as series")[0].series,
        detailSql = "select itemsite_id, costcat_asset_accnt_id, item_number, " +
          "invcitem_billed, item_number, stdcost(item_id) as stdcost " +
          "from invcitem " +
          "inner join itemsite on invcitem_item_id = itemsite_item_id AND invcitem_warehous_id = itemsite_warehous_id " +
          "inner join item on itemsite_item_id = item_id " +
          "inner join costcat on itemsite_costcat_id = costcat_id " +
          "where invcitem.obj_uuid = $1;",
        detail = plv8.execute(detailSql, [orderLine.orderLine])[0];

      XT.executeFunction("postInvTrans", [
        detail.itemsite_id, 
        'SH', 
        detail.invcitem_billed, 
        'S/O', 
        'IN', 
        invoiceNumber, 
        '',
        'Invoice Billed ' + detail.item_number,
        detail.costcat_asset_accnt_id,
        null, /* getPrjAccntId */
        series, 
        null, /* glDate, */
        detail.stdcost
      ]);
      XM.PrivateInventory.distribute(series, orderLine.options && orderLine.options.detail);
    });

    /* Switch it back to Posted */
    plv8.execute("update invchead set invchead_posted = true where invchead_invcnumber = $1", [invoiceNumber]);
    
  };
}());
  
$$ );
