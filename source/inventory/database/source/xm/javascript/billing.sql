select xt.install_js('XM','Billing','billing', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.PrivateBilling) { XM.PrivateBilling = {}; }

  XM.PrivateBilling.isDispatchable = false; /* No direct access from client */

  /**
    Returns a list of UUIDs of any lines in this invoice/return that have itemsites under 
    inventory control
 
    @param {String} Invoice/Return UUID
  */  
  XM.PrivateBilling.getControlledLines = function (docNumber, docType) {
    /* similar to XM.Location.requiresDetail on the client, but accessing that
      would have been torturous */
    var qtyColName,
      itemSiteJoin,
      sql1,
      mapObj,
      docNumberName,
      tblNameStem;

    /* Set column name and itemsite join (column names) vars */
    if (docType === 'IN') {
      docNumberName = "invchead_invcnumber";
      qtyColName = "invcitem_billed";
      itemSiteJoin = "invcitem_item_id = itemsite_item_id AND " + 
        "invcitem_warehous_id = itemsite_warehous_id ";
      tblNameStem = 'invc';
    } else if (docType === 'CM') {
      docNumberName = "cmhead_number";
      qtyColName = "cmitem_qtyreturned";
      itemSiteJoin = "cmitem_itemsite_id = itemsite_id ";
      tblNameStem = 'cm';
    }
    /* Sql to prepare for return object of: 
      line UUIDs, quantity and inventory control (requires dist. detail) 
    */
    sql1 ="select {tableNameStem}item.obj_uuid as uuid, {qtyColName} as quantity, " +
              " case when itemsite_loccntrl = true or itemsite_controlmethod in ('S', 'L') " + 
              "   then true else false end as invctrl " + 
              "from {tableNameStem}head " + 
              " inner join {tableNameStem}item on " + 
              "   {tableNameStem}head_id = {tableNameStem}item_{tableNameStem}head_id " + 
              " inner join itemsite on {itemSiteJoin} " +
              "where {tableNameStem}item_updateinv = true " + 
              " and {docNumberName} = $1";

    /* Replace (differences) with vars */
    mapObj = {
      "{tableNameStem}": tblNameStem,
      "{qtyColName}": qtyColName,
      "{itemSiteJoin}": itemSiteJoin,
      "{docNumberName}": docNumberName
    };
    sql1 = sql1.replace(/{tableNameStem}|{qtyColName}|{itemSiteJoin}|{docNumberName}/gi, function (matched) {
      return mapObj[matched];
    });

    /* Execute and return results */
    return plv8.execute(sql1, [docNumber]).map(function (row) {
      return {uuid: row.uuid, quantity: row.quantity, invControl: row.invctrl};
    });
  };

  /**
    Perform inventory transactions for Return/Invoice line items that are flagged update inventory
 
    @param {String} Invoice/Return UUID
    @param {Object} Invoice/Return Lines UUIDs
  */ 
  XM.PrivateBilling.postWithInventory = function (docNumber, lineItems, docType) {
    var qtyColName,
      itemSiteJoin,
      itemLocSeries,
      docNumber, 
      docUuid,
      sql1,
      controlledLines = lineItems.filter(function (line) {
        return line.options.detail;
      }),
      setUpdateInvSql,
      docNumberName,
      docHeadPostedSql,
      invTransType,
      invTransComment,
      tblNameStem;

    /*  Step 1: trick out the public post function by temporarily changing the updateInventory from
        true to false on the line items.
    */
    /*  Step 2: Get invoice or return number, post the doc.

        * For Invoice, update posted column of the doc to false because we're changing the order of things so
        we need to trick the public post function.
    */
    if (docType === 'IN') {
      docUuid = plv8.execute("select obj_uuid as uuid from invchead where invchead_invcnumber = $1", [docNumber])[0].uuid;
      setUpdateInvSql = "update invcitem set invcitem_updateinv = $2 where obj_uuid = $1; ";
      controlledLines.map(function (lineItem) {
        plv8.execute(setUpdateInvSql, [lineItem.lineItem, false]);
      });
      docNumberName = "invchead_invcnumber";
      itemLocSeries = XM.Invoice.post(docNumber);
      docHeadPostedSql = "update invchead set invchead_posted = false where invchead_invcnumber = $1";
      plv8.execute(docHeadPostedSql, [docNumber]);
      invTransType = 'SH';
      invTransComment = 'Invoice Billed ';
      itemSiteJoin = "invcitem_item_id = itemsite_item_id AND " + 
        "invcitem_warehous_id = itemsite_warehous_id ";
      qtyColName = "invcitem_billed";
      tblNameStem = "invc";
    } else if (docType === 'CM') {
      docUuid = plv8.execute("select obj_uuid as uuid from cmhead where cmhead_number = $1", [docNumber])[0].uuid;
      setUpdateInvSql = "update cmitem set cmitem_updateinv = $2 where obj_uuid = $1; ";
      controlledLines.map(function (lineItem) {
        plv8.execute(setUpdateInvSql, [lineItem.lineItem, false]);
      });
      docNumberName = "cmhead_number";
      itemLocSeries = XM.Return.post(docNumber);
      invTransType = 'RS';
      invTransComment = 'Credit Return ';
      itemSiteJoin = "cmitem_itemsite_id = itemsite_id ";
      qtyColName = "cmitem_qtyreturned";
      tblNameStem = "cm";
    }

    /* Distribute the detailed (lot/location controlled) inventory transactions */
    XM.PrivateInventory.distribute(itemLocSeries);
    /* step 3: reinstate the updateInventory values on the line items */
    controlledLines.map(function (lineItem) {
      plv8.execute(setUpdateInvSql, [lineItem.lineItem, true]);
    });

    /* step 4: Post the inventory transactions */
    controlledLines.map(function (lineItem) {
      var series = plv8.execute("select nextval('itemloc_series_seq') as series")[0].series,
        detailSql = "select itemsite_id, costcat_asset_accnt_id, item_number, " +
          "{qtyColName} as qty_billed, item_number, stdcost(item_id) as stdcost " +
          "from {tableNameStem}item " +
          " inner join itemsite on {itemSiteJoin} " +
          " inner join item on itemsite_item_id = item_id " +
          " inner join costcat on itemsite_costcat_id = costcat_id " +
          "where {tableNameStem}item.obj_uuid = $1;",
          /* Replace (differences) with vars */
        mapObj = {
          "{tableNameStem}": tblNameStem,
          "{qtyColName}": qtyColName,
          "{itemSiteJoin}": itemSiteJoin
        };


        detailSql = detailSql.replace(/{tableNameStem}|{qtyColName}|{itemSiteJoin}/gi, function (matched) {
          return mapObj[matched];
        });
        plv8.elog(NOTICE, "detailSql: " + detailSql);
        detail = plv8.execute(detailSql, [lineItem.lineItem])[0];
        plv8.elog(NOTICE, "detail: " + detail);
      XT.executeFunction("postInvTrans", [
        detail.itemsite_id, 
        'SH', 
        detail.qty_billed, 
        'S/O', 
        docType,
        docNumber, 
        '',
        invTransComment + detail.item_number,
        detail.costcat_asset_accnt_id,
        null, /* getPrjAccntId */
        series, 
        null, /* glDate, */
        detail.stdcost
      ]);

      plv8.elog(NOTICE, "lineItem.options.detail: " + lineItem.options.detail);
      /* TODO - If no options.detail, return error, right? AND/OR If there is none, why post?! */
      XM.PrivateInventory.distribute(series, lineItem.options.detail);
    });

    if (docType === 'IN') {
      /* Switch it back to Posted */
      plv8.execute("update invchead set invchead_posted = true where invchead_invcnumber = $1", [docNumber]);
    }
  };

}());

$$ );
