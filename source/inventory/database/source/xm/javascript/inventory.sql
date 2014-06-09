select xt.install_js('XM','Inventory','inventory', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.PrivateInventory) { XM.PrivateInventory = {}; }

  XM.PrivateInventory.isDispatchable = false; /* No direct access from client */

  /**
    Distribute location and/or trace detail for one or many inventory transactions.
    For good or for ill, this function attempts to exactly replicate the behavior of distributeInventory.cpp in the C++ client.

    Example:

        XM.Inventory.distribute (12345,[
            {
              location: '6dac30d3-aac3-4fc7-953d-465e190ff9cf',
              trace: 'A7891',
              quantity: 6,
              expiration: '2013-07-31T00:00:00.000Z',
              warranty: '2013-08-05T00:00:00.000Z'
            },
            {
              location: 'ea571dab-88fa-46c2-c92f-4a18e0ce7c1d',
              trace: 'A7891',
              quantity: 2,
              expiration: '2013-07-31T00:00:00.000Z',
              warranty: '2013-08-05T00:00:00.000Z'
            },
            {
              location: '6dac30d3-aac3-4fc7-953d-465e190ff9cf',
              quantity: 2,
              trace: 'A7892',
              expiration: '2013-08-05T00:00:00.000Z',
              warranty: '2013-08-05T00:00:00.000Z'
            }
          ]
        })

    @private
    @param {Number} Series number
    @param {Array} Detail

  */
  XM.PrivateInventory.distribute = function (series, detail) {
    detail = detail || [];
    var sql,
      sql2,
      sql3,
      distIds = [],
      distId,
      rec,
      traceSeries,
      locId = -1,
      qty = 0,
      info,
      d,
      i,

      /* Helper funciton to resolve location id */
      getLocId = function (uuid) {
        var locSql = "select location_id " +
          "from location where obj_uuid = $1" +
          " and not location_restrict " +
          " or location_id in (" +
          " select locitemsite_location_id " +
          " from xt.locitemsite " +
          " where locitemsite_itemsite_id = $2);",
          qry = plv8.execute(locSql, [uuid, info.itemsite_id]);
        if (!qry.length) {
          throw new handleError("Location " + uuid + " is not valid.");
        }
        return qry[0].location_id;
      };

    if (detail && detail.length) {
      sql = "select itemlocdist_id, " +
        " invhist_id, " +
        " invhist_invqty, " +
        " invhistsense(invhist_id) as sense, " +
        " itemsite_id, " +
        " itemsite_controlmethod, " +
        " itemsite_loccntrl " +
        "from itemlocdist, invhist" +
        " join itemsite on itemsite_id = invhist_itemsite_id " +
        "where itemlocdist_series = $1 " +
        " and invhist_series = $1";
      info = plv8.execute(sql,[series]);

      /* We shouldn't have detail if there are no detail control settings turned on */
      if (!info.length) {
        throw new handleError("Item Site is not controlled.");
      } else if (info.length > 1) {
        throw new handleError("Only distribution for one transaction at a time is supported.");
      }
      info = info[0];

      /* Validate quantity */
      for (i = 0; i < detail.length; i++) {
        qty += detail[i].quantity;
        detail[i].quantity = detail[i].quantity * info.sense; /* Fix the nonsense */
      }

      if (Math.abs(qty) != Math.abs(info.invhist_invqty)) {
        throw new handleError("Distribution quantity does not match transaction quantity.");
      }

      /* Loop through and handle each trace detail */
      if (info.itemsite_controlmethod === 'L' || info.itemsite_controlmethod === 'S') {
        sql = "select nextval('itemloc_series_seq') AS itemloc_series;";
        traceSeries = plv8.execute(sql)[0].itemloc_series;

        sql = "select createlotserial(itemlocdist_itemsite_id, " +
          "$1, $2,'I', NULL, itemlocdist_id,$3, coalesce($4, endoftime()), $5) as id " +
          "from itemlocdist " +
          "where (itemlocdist_id=$6);";

        sql2 = "update itemlocdist set" +
          "  itemlocdist_source_type = 'L', " +
          "  itemlocdist_source_id = $1" +
          "where itemlocdist_id = $2";

        sql3 = "select ls_id " +
          "from itemloc join ls on itemloc_ls_id=ls_id " +
          "where ls_number=$1 " +
          " and itemloc_itemsite_id=$2 " +
          "union all " +
          "select ls_id " +
          "from itemlocdist join ls on itemlocdist_ls_id=ls_id " +
          "where ls_number = $1 " +
          " and itemlocdist_itemsite_id=$2; ";

        for (i = 0; i < detail.length; i++) {
          d = detail[i];

          if (!d.trace) { throw new handleError("Itemsite requires lot or serial trace detail."); }

          /* Serial numbers can only be one */
          if (info.itemsite_controlmethod === 'S') {
            rec = plv8.execute(sql3, [d.trace, info.itemsite_id]);
            if (d.quantity === 1) {
              if (rec.length) {
                throw new handleError("Serial number " + d.trace + " already exists in inventory.");
              }
            } else if (d.quantity === -1) {
              if (!rec.length) {
                throw new handleError("Serial number " + d.trace + " does not exist in inventory.");
              }
            } else {
              throw new handleError("Serial number quantity must be one.");
            }
          }

          distId = plv8.execute(sql, [
            d.trace, traceSeries, d.quantity, d.expiration, d.warranty, info.itemlocdist_id
          ])[0].id;
          distIds.push(distId);

          /* Determine location id if applicable */
          if (info.itemsite_loccntrl) {
            if (!d.location) { throw new handleError("Itemsite requires location detail."); }

            locId = getLocId(d.location);
          } else {
            if (d.location) { throw new handleError("Itemsite does not support location detail."); }
          }
          plv8.execute(sql2, [locId, distId]);
        }

        sql = "delete from itemlocdist where itemlocdist_id=$1;";
        plv8.execute(sql, [info.itemlocdist_id]);

        sql = "select distributeitemlocseries($1);";
        plv8.execute(sql, [traceSeries]);


      /* Location control w/o trace */
      } else {
        sql =  "insert into itemlocdist " +
          "(itemlocdist_itemlocdist_id, itemlocdist_source_type, itemlocdist_source_id, " +
          " itemlocdist_itemsite_id, itemlocdist_expiration, " +
          " itemlocdist_qty, itemlocdist_series, itemlocdist_invhist_id ) " +
          " values ($1, 'L', $2, $3, endoftime(), $4, $5, $6); ";

        for (i = 0; i < detail.length; i++) {
          d = detail[i];
          if (!d.location) { throw new handleError("Item Site requires location detail."); }
          if (d.trace) { throw new handleError("Item Site does not support lot or serial trace detail."); }
          locId = getLocId(d.location);

          plv8.execute(sql, [
            info.itemlocdist_id, locId, info.itemsite_id, d.quantity, series, info.invhist_id
          ]);
        }

        sql = "select distributeitemlocseries($1);";
        plv8.execute(sql, [series]);
      }

    /* No half done transactions are permitted. */
    } else {
      sql = "select invhist_id " +
        "from invhist join itemsite on itemsite_id = invhist_itemsite_id " +
        "where invhist_series = $1" +
        " and (itemsite_loccntrl or itemsite_controlmethod in ('L','S')); ";
      invHist = plv8.execute(sql,[series]);

      if (invHist.length) { throw new handleError("Transaction requires distribution detail"); }
    }

    /* Wrap up */
    sql = "select postitemlocseries($1);";
    plv8.execute(sql, [series]);
    return;
  };

  if (!XM.Inventory) { XM.Inventory = {options: []}; }

  XM.Inventory.isDispatchable = true;

  /**
    Returns an object indicating whether trace is set on any item sites.

    @returns Boolean
  */
  XM.Inventory.usedTrace = function() {
    var sql = "select count(*) > 0 as used from itemsite where itemsite_controlmethod in ('S','L');",
      data = Object.create(XT.Data);

    /* check privileges */
    if(!data.checkPrivilege('ConfigureIM')) throw new Error('Access Denied');

    return plv8.execute(sql)[0].used;
  };

  /**
    Perform Inventory Adjustments.

      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"adjustment",
          "parameters":[
            "95c30aba-883a-41da-e780-1d844a1dc112",
            1,
            {
              "asOf": "2013-07-03T13:52:55.964Z",
              "value": 10,
              "notes": "This is a test.",
              "docNumber": "12345"
            }
          ]
        }
      }');

    @param {String} Itemsite uuid
    @param {Number} Quantity
    @param {Array} [options.detail] Distribution detail
    @param {Date}   [options.asOf=now()] Transaction Timestamp
    @param {String} [options.docNumber] Document Number
    @param {String} [options.notes] Notes
    @param {String} [options.value] Value
  */
  XM.Inventory.adjustment = function (itemSite, quantity, options) {
    options = options || {};
    var sql = "select invadjustment(itemsite_id, $2, $3, $4, $5::timestamptz, $6) as series " +
      "from itemsite where obj_uuid = $1;",
      asOf = options.asOf || null,
      docNumber = options.docNumber || "",
      notes =  options.notes || "",
      value = options.value || null,
      series;

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("CreateAdjustmentTrans")) { throw new handleError("Access Denied", 401); }

    /* Post the transaction */
    series = plv8.execute(sql, [itemSite, quantity, docNumber, notes, asOf, value])[0].series;

    /* Distribute detail */
    XM.PrivateInventory.distribute(series, options.detail);

    return;
  };
  XM.Inventory.adjustment.description = "Perform Inventory Adjustments.";
  XM.Inventory.adjustment.request = {
    "$ref": "InventoryAdjustment"
  };
  XM.Inventory.adjustment.parameterOrder = ["itemSite", "quantity", "options"];
  XM.Inventory.adjustment.schema = {
    InventoryAdjustment: {
      properties: {
        itemSite: {
          title: "Item Site",
          description: "UUID of itemSite",
          type: "string",
          "$ref": "ItemSite/uuid",
          "required": true
        },
        quantity: {
          title: "Quantity",
          description: "Quantity",
          type: "number",
          "required": true
        },
        options: {
          title: "Options",
          type: "object",
          "$ref": "InventoryAdjustmentOptions"
        }
      }
    },
    InventoryAdjustmentOptions: {
      properties: {
        detail: {
          title: "Detail",
          description: "Distribution Detail",
          type: "object",
          items: {
            "$ref": "InventoryAdjustmentOptionsDetails"
          }
        },
        asOf: {
          title: "As Of",
          description: "Transaction Timestamp, default to now()",
          type: "string",
          format: "date-time"
        },
        docNumber: {
          title: "Document Number",
          description: "Document Number",
          type: "string"
        },
        notes: {
          title: "Notes",
          description: "Notes",
          type: "string"
        },
        value: {
          title: "Value",
          description: "Value",
          type: "string"
        }
      }
    },
    InventoryAdjustmentOptionsDetails: {
      properties: {
        quantity: {
          title: "Quantity",
          description: "Quantity",
          type: "number"
        },
        location: {
          title: "Location",
          description: "UUID of location",
          type: "string"
        },
        trace: {
          title: "Trace",
          description: "Trace (Lot or Serial) Number",
          type: "string"
        },
        expiration: {
          title: "Expiration",
          description: "Perishable expiration date",
          type: "string",
          format: "date"
        },
        warranty: {
          title: "Warranty",
          description: "Warranty expire date",
          type: "string",
          format: "date"
        }
      }
    }
  };


  XM.Inventory.receipt = function (orderLine, quantity, options) {
    var asOf,
      sql1,
      sql2,
      sql3,
      sql4,
      sql5,
      sql6,
      sql7,
      recvext,
      ary,
      item,
      i,
      recvId,
      receiptLine,
      detailString;

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{orderLine: orderLine, quantity: quantity, options: options || {}}];
    } else {
      ary = arguments;
    }

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("EnterReceipts")) { throw new handleError("Access Denied", 401); }

    sql1 = "select tblname as ordtype_tblname, t.ordtype_code as ordtype_code " +
           "from xt.obj_uuid as o " +
           "  join xt.ordtype as t on o.tblname = t.ordtype_tblname " +
           "where obj_uuid = $1;";

    sql2 = "select public.enterreceipt($1, {table}_id::integer, $3::numeric, $4::numeric, $5::text, $6::integer, $7::date, $8::numeric) as recv_id " +
           "from {table} where obj_uuid = $2;";

    sql3 = "select current_date != $1 as invalid;";

    sql4 = "select obj_uuid as uuid " +
           "from recv where recv_id = $1;";

    sql5 = "select recvext_orderLine_uuid from xt.recvext where recvext_orderLine_uuid = $1;";

    sql6 = "insert into xt.recvext values ($1, $2, $3);";

    sql7 = "update xt.recvext set recvext_recv_id = $1, recvext_detail = $2 where recvext_orderLine_uuid = $3;";

    for (i = 0; i < ary.length; i++) {
      item = ary[i];
      asOf = item.options ? item.options.asOf : null;
      orderType = plv8.execute(sql1, [item.orderLine])[0];
      if (!orderType) {
        throw new handleError("UUID not found", 400);
      }
      if (item.options.detail) {
        detailString = JSON.stringify(item.options.detail);
      }

      if (asOf && plv8.execute(sql3, [asOf])[0].invalid &&
          !XT.Data.checkPrivilege("AlterTransactionDates")) {
        throw new handleError("Insufficient privileges to alter transaction date", 401);
      }
      /* Enter receipt function. Returns recv_id. */
      recvId = plv8.execute(sql2.replace(/{table}/g, orderType.ordtype_tblname),
        [orderType.ordtype_code, item.orderLine, item.quantity, item.options.freight, '', 1, asOf, 0.00])[0].recv_id;
      if (!recvId) {
        throw new handleError("There was an error posting the receipt.", 400);
      }
      
      /* Special handling to deal with details, recv_id and orderLine.uuid */
      recvext = plv8.execute(sql5, [item.orderLine])[0];
      /* If the record already exists in xt.recvext handling table, update it. */
      if (recvext) {
        plv8.execute(sql7, [recvId, detailString, item.orderLine])[0];
        plv8.elog(NOTICE, "If the record already exists in xt.recvext handling table, update it");
      } else { /* Otherwise, insert our record into xt.recvext handling table */
        plv8.elog(NOTICE, "Otherwise, insert our record into xt.recvext handling table");
        plv8.execute(sql6, [recvId, detailString, item.orderLine])[0];
      }

      /* If flagged for post, Post receipt */
      if (item.options.post) {
        /* Get the receipt line's obj_uuid to pass to postReceipt */
        receiptLine = plv8.execute(sql4, [recvId])[0].uuid;
        XM.Inventory.postReceipt(receiptLine);
      }
    }

    return recvId;
  };
  XM.Inventory.receipt.description = "Receive Purchase Order Item.";
  XM.Inventory.receipt.request = {
    "$ref": "InventoryReceipt"
  };
  XM.Inventory.receipt.parameterOrder = ["orderLines"];
  XM.Inventory.receipt.schema = {
    InventoryReceipt: {
      properties: {
        orderLines: {
          title: "OrderLines",
          type: "object",
          "$ref": "InventoryReceiptOrderLine"
        }
      }
    },
    InventoryReceiptOrderLine: {
      properties: {
        orderLine: {
          title: "Order Line",
          description: "UUID of order document line item",
          type: "string",
          "$ref": "OrderLine/uuid",
          "required": true
        },
        quantity: {
          title: "Quantity",
          description: "Quantity",
          type: "number",
          "required": true
        },
        options: {
          title: "Options",
          type: "object",
          "$ref": "InventoryReceiptOptions"
        }
      }
    },
    InventoryReceiptOptions: {
      properties: {
        detail: {
          title: "Detail",
          description: "Distribution Detail",
          type: "object",
          items: {
            "$ref": "InventoryReceiptOptionsDetails"
          }
        },
        asOf: {
          title: "As Of",
          description: "Transaction Timestamp, default to now()",
          type: "string",
          format: "date-time"
        },
        post: {
          title: "Post",
          description: "Post transaction immediatley",
          type: "boolean"
        }
      }
    },
    InventoryReceiptOptionsDetails: {
      properties: {
        quantity: {
          title: "Quantity",
          description: "Quantity",
          type: "number"
        },
        location: {
          title: "Location",
          description: "UUID of location",
          type: "string"
        },
        trace: {
          title: "Trace",
          description: "Trace (Lot or Serial) Number",
          type: "string"
        },
        expiration: {
          title: "Expiration",
          description: "Perishable expiration date",
          type: "string",
          format: "date"
        },
        warranty: {
          title: "Warranty",
          description: "Warranty expire date",
          type: "string",
          format: "date"
        }
      }
    }
  };

  XM.Inventory.postReceipt = function (receiptLine) {
    var asOf,
      sql1,
      sql2,
      sql3,
      sql4,
      ary,
      item,
      recv,
      series,
      detail
      i;

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{receiptLine: receiptLine}];
    } else {
      ary = arguments;
    }

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("CreateReceiptTrans")) { throw new handleError("Access Denied", 401); }

    sql1 = "select postreceipt(recv_id::integer, $2::integer) as series " +
           "from recv where obj_uuid = $1;";

    sql2 = "select current_date != $1 as invalid";

    sql3 = "select recvext_recv_id as id, recvext_detail as detail " +
           "from xt.recvext join recv on recv_id = recvext_recv_id " +
           "where recv.obj_uuid = $1;";

    sql4 = "delete from xt.recvext " +
           "where recvext_recv_id = $1;";

    /* Post the transaction */
    for (i = 0; i < ary.length; i++) {
      item = ary[i];
      asOf = item.options ? item.options.asOf : null;
      if (asOf && plv8.execute(sql2, [asOf])[0].invalid &&
          !XT.Data.checkPrivilege("AlterTransactionDates")) {
        throw new handleError("Insufficient privileges to alter transaction date", 401);
      }
      /* Call the postreceipt function. */
      series = plv8.execute(sql1, [item.receiptLine, 0])[0].series;
      if (!series) {
        throw new handleError("There was an error with function: select postreceipt(recv_id, " +
          item.receiptLine + ", 0);", 400);
      }
      /* Get the record from xt.recvext handling table for processing and then delete it.*/
      recv = plv8.execute(sql3, [item.receiptLine])[0];
      detail = JSON.parse(recv.detail);
      plv8.execute(sql4, [recv.id])[0];

      if (DEBUG) {
        XT.debug("detail = " + JSON.stringify(recv));
        XT.debug("detail = " + JSON.stringify(detail));
        XT.debug("series = " + series);
      }

      if (detail && series) {
        /* Distribute detail */
        XM.PrivateInventory.distribute(series, detail);
      } else if (detail && !series) {
        throw new handleError("postReceipt(" + item.receiptLine + ", " + 0 + ") did not return a series id.", 400)
      }
    }
    return;
  };
  XM.Inventory.postReceipt.description = "Post Receipt";
  XM.Inventory.postReceipt.request = {
    "$ref": "InventoryPostReceipt"
  };
  XM.Inventory.postReceipt.parameterOrder = ["receiptLines"];
  XM.Inventory.postReceipt.schema = {
    InventoryPostReceipt: {
      properties: {
        receiptLines: {
          title: "ReceiptLines",
          type: "object",
          "$ref": "InventoryPostReceiptLine"
        }
      }
    },
    InventoryPostReceiptLine: {
      properties: {
        receiptLine: {
          title: "Receipt Line",
          description: "UUID of receipt line",
          type: "string",
          "$ref": "OrderLine/uuid",
          "required": true
        }
      }
    }
  };

  /**
    Issue to shipping.

      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"issueToShipping",
          "parameters":[
            "95c30aba-883a-41da-e780-1d844a1dc112",
            1,
            {
              "asOf": "2013-07-03T13:52:55.964Z",
              "detail": [
                {
                  "location": "84cf43d5-8a44-4a2b-f709-4f415ca51a52",
                  "quantity": 8
                },
                {
                  "location": "d756682c-eda3-445d-eaef-4dce793b0dcf",
                  "quantity": 2
                }
              ]
            }
          ]
        }
      }');

    @param {String|Array} Order line uuid or array of objects
    @param {Number|Object} Quantity or options
    @param {Date}   [options.asOf=now()] Transaction Timestamp
    @param {Array} [options.detail] Distribution detail
  */
  XM.Inventory.issueToShipping = function (orderLine, quantity, options) {
    var orderType,
      asOf,
      series,
      sql1,
      sql2,
      sql3,
      ary,
      item,
      id,
      i,
      shipment,
      shipShipment;

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{orderLine: orderLine, quantity: quantity, options: options || {}}];
    } else {
      ary = arguments;
    }

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("IssueStockToShipping")) { throw new handleError("Access Denied", 401); }

    sql1 = "select tblname as ordtype_tblname, t.ordtype_code as ordtype_code " +
           "from xt.obj_uuid as o " +
           "  join xt.ordtype as t on o.tblname = t.ordtype_tblname " +
           "where obj_uuid = $1;";

    sql2 = "select {table}_id as id " +
           "from {table} where obj_uuid = $1;";

    sql3 = "select current_date != $1 as invalid";

    sql4 = "select shiphead_number as shipment " +
           "from public.shiphead " +
           "   join xt.shipmentline on xt.shipmentline.shiphead_id = shiphead.shiphead_id " +
           "where obj_uuid = $1;";

    /* Post the transaction */
    for (i = 0; i < ary.length; i++) {
      item = ary[i];
      asOf = item.options ? item.options.asOf : null;
      if (DEBUG) {
        XT.debug("xt.obj_uuid sql = " + sql1);
        XT.debug("xt.obj_uuid uuid = " + item.orderLine);
      }
      orderType = plv8.execute(sql1, [item.orderLine])[0];
      if (!orderType) {
        throw new handleError("UUID not found", 400);
      }
      id = plv8.execute(sql2.replace(/{table}/g, orderType.ordtype_tblname),
        [item.orderLine])[0].id;
      if (options.issue)
      series = XT.executeFunction("issuetoshipping",
        [orderType.ordtype_code, id, item.quantity, 0, asOf],
        [null, null, null, null, "timestamptz"]);
      if (asOf && plv8.execute(sql3, [asOf])[0].invalid &&
          !XT.Data.checkPrivilege("AlterTransactionDates")) {
        throw new handleError("Insufficient privileges to alter transaction date", 401);
      }
      
      /* Distribute detail */
      XM.PrivateInventory.distribute(series, item.options.detail);

    }
    
    if (ary[0].options.expressCheckout) {
      shipment = plv8.execute(sql4, [ary[0].orderLine])[0].shipment;
      if (shipment) {
        /* Ship shipment, Select for Billing, Create Invoice */
        shipShipment = XM.Inventory.shipShipment(shipment, asOf, true, true);
      } else {
        throw new handleError('No shipment was generated', 400);
      }
      return shipShipment;
    } else {
      return;
    }

  };
  XM.Inventory.issueToShipping.description = "Issue to Shipping for Sales Order or Transfer Order.";
  XM.Inventory.issueToShipping.request = {
    "$ref": "InventoryIssueToShipping"
  };
  XM.Inventory.issueToShipping.parameterOrder = ["orderLines"];
  XM.Inventory.issueToShipping.schema = {
    InventoryIssueToShipping: {
      properties: {
        orderLines: {
          title: "OrderLines",
          type: "object",
          "$ref": "InventoryIssueToShippingOrderLine"
        }
      }
    },
    InventoryIssueToShippingOrderLine: {
      properties: {
        orderLine: {
          title: "Order Line",
          description: "UUID of order document line item",
          type: "string",
          "$ref": "OrderLine/uuid",
          "required": true
        },
        quantity: {
          title: "Quantity",
          description: "Quantity",
          type: "number",
          "required": true
        },
        options: {
          title: "Options",
          type: "object",
          "$ref": "InventoryIssueToShippingOptions"
        }
      }
    },
    InventoryIssueToShippingOptions: {
      properties: {
        detail: {
          title: "Detail",
          description: "Distribution Detail",
          type: "object",
          items: {
            "$ref": "InventoryIssueToShippingOptionsDetails"
          }
        },
        asOf: {
          title: "As Of",
          description: "Transaction Timestamp, default to now()",
          type: "string",
          format: "date-time"
        },
        expressCheckout: {
          title: "Express Checkout",
          description: "Ship, Select for Billing, Invoice",
          type: "Boolean"
        }
      }
    },
    InventoryIssueToShippingOptionsDetails: {
      properties: {
        quantity: {
          title: "Quantity",
          description: "Quantity",
          type: "number"
        },
        location: {
          title: "Location",
          description: "UUID of location",
          type: "string"
        },
        trace: {
          title: "Trace",
          description: "Trace (Lot or Serial) Number",
          type: "string"
        }
      }
    }
  };

  /**
   * Approve a Shipment for Billing.
   *
   * Note: the selectUninvoicedShipment function does all the work here. It
   * inserts a row into cobill and returns a cobmiscid. Here 'select' means
   * 'approve'.
   */
  XM.Inventory.approveForBilling = function (shipmentId) {
    var query = 'select selectUninvoicedShipment($1) as result',
      result = plv8.execute(query, [shipmentId])[0].result;

    if (!result) {
      throw new handleError('Shipment [id='+ shipmentId +'] already invoiced', 400);
    }
    if (result < 0) {
      throw new handleError('Error in XM.Inventory.approveForBilling. Shipment [id='+ shipmentId +']', 500);
    }

    return result;
  };

  XM.Inventory.createInvoice = function (billingId) {
    var query = "select createinvoice($1) as id",
      result = plv8.execute(query, [billingId])[0].id;

    if (!result || result < 0) {
      throw new handleError('Unknown error in createInvoice', 500);
    }

    return result;
  };

  /**
    Ship shipment.

      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"shipShipment",
          "parameters":["203"]
        }
      }');

    @param {Number} Shipment number
    @param {Date} Ship date, default = current date
  */
  XM.Inventory.shipShipment = function (shipmentNumber, shipDate, approveForBilling, createInvoice) {
    if (!XT.Data.checkPrivilege("ShipOrders")) {
      throw new handleError("Access Denied", 401);
    }
    if (createInvoice && !approveForBilling) {
      throw new handleError('Cannot create invoice if it is not also approved for billing', 400);
    }
    if (approveForBilling && !XT.Data.checkPrivilege("SelectBilling")) {
      throw new handleError("Access Denied", 401);
    }
    if (createInvoice && !(XT.Data.checkPrivilege("MaintainMiscInvoices") &&
        XT.Data.checkPrivilege("PrintInvoices"))) {
      throw new handleError("Access Denied", 401);
    }

    var idQuery = 'select shiphead_id from shiphead where shiphead_number = $1',
      shipQuery = 'select shipShipment($1, $2) as result',
      shipmentId = plv8.execute(idQuery, [shipmentNumber])[0].shiphead_id,
      shipped, billingId, invoiceId;

    if (!shipmentId) {
      throw new handleError('XM.Inventory.ShipShipment [number='+ shipmentNumber + '] encountered an error', 500);
    }

    shipped = plv8.execute(shipQuery, [shipmentId, shipDate])[0].result,
    billingId = approveForBilling && XM.Inventory.approveForBilling(shipmentId);
    invoiceId = createInvoice && billingId && XM.Inventory.createInvoice(billingId);

    return {
      result: shipped,
      billingId: billingId,
      shipmentId: shipmentId,
      invoiceNumber: invoiceId && plv8.execute('select invchead_invcnumber as result from invchead where invchead_id = $1', [invoiceId])[0].result
    };
  };
  XM.Inventory.shipShipment.description = "Ship Sales or Transfer Order shipment";
  XM.Inventory.shipShipment.request = {
    "$ref": "InventoryShipShipment"
  };
  XM.Inventory.shipShipment.parameterOrder = ["shipment", "shipDate", "approveForBilling", "createInvoice"];
  XM.Inventory.shipShipment.schema = {
    InventoryShipShipment: {
      properties: {
        shipment: {
          title: "Shipment",
          description: "Number of shipment",
          type: "string",
          "$ref": "Shipment/number",
          "required": true
        },
        shipDate: {
          title: "Ship Date",
          description: "Ship Date",
          type: "date"
        },
        approveForBilling: {
          title: "Approve for Billing",
          type: "boolean"
        },
        createInvoice: {
          title: "Create Invoice for Shipment",
          type: "boolean"
        }
      }
    }
  };

  /**
    Return shipment transactions.

      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"returnFromShipping",
          "parameters":["95c30aba-883a-41da-e780-1d844a1dc112"]
        }
      }');

    @param {String|Array} Order line uuid, or array of uuids
  */
  XM.Inventory.returnFromShipping = function (orderLine) {
    var sql1 = "select tblname as ordtype_tblname, t.ordtype_code as ordtype_code " +
           "from xt.obj_uuid as o " +
           "  join xt.ordtype as t on o.tblname = t.ordtype_tblname " +
           "where obj_uuid = $1;",
      sql2 = "select returnitemshipments($1, {table}_id, 0, current_timestamp) " +
           "from {table} where obj_uuid = $2;",
      ret,
      i;

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("ReturnStockFromShipping")) { throw new handleError("Access Denied", 401); }

    /* Post the transaction */
    for (i = 0; i < arguments.length; i++) {
      /* Resolve the table */
      orderType = plv8.execute(sql1, [arguments[i]])[0];
      ret = plv8.execute(sql2.replace(/{table}/g, orderType.ordtype_tblname),
        [orderType.ordtype_code, arguments[i]])[0];
    }

    return ret;
  };
  XM.Inventory.returnFromShipping.description = "Return issued materials from shipping to inventory.";
  XM.Inventory.returnFromShipping.request = {
    "$ref": "InventoryReturnFromShipping"
  };
  XM.Inventory.returnFromShipping.parameterOrder = ["orderLine"];
  XM.Inventory.returnFromShipping.schema = {
    InventoryReturnFromShipping: {
      properties: {
        orderLine: {
          title: "OrderLine",
          description: "UUID of order document line item",
          type: "string",
          "$ref": "OrderLine/uuid",
          "required": true
        }
      }
    }
  };

  /**
    Return complete shipment (only available for orders that have not been shipped) - used in maintain shipping contents screen.

      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"recallShipment",
          "parameters":["203"]
        }
      }');

    @param {Number} shipment id
  */
  XM.Inventory.recallShipment = function (shipment) {
    var sql = "select recallshipment(shiphead_id) as series " +
      "from shiphead where shiphead_number = $1;";

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("RecallOrders")) { throw new handleError("Access Denied", 401); }

    /* Post the transaction */
    var ret = plv8.execute(sql, [shipment])[0].series;

    return ret ? ret : true;
  };
  XM.Inventory.recallShipment.description = "Return shipped shipment";
  XM.Inventory.recallShipment.request = {
    "$ref": "InventoryRecallShipment"
  };
  XM.Inventory.recallShipment.parameterOrder = ["shipment"];
  XM.Inventory.recallShipment.schema = {
    InventoryRecallShipment: {
      properties: {
        orderLine: {
          title: "Shipment",
          description: "Number of shipment",
          type: "string",
          "$ref": "Shipment/number",
          "required": true
        }
      }
    }
  };

  XM.Inventory.options = [
    "DefaultTransitWarehouse",
    "ItemSiteChangeLog",
    "WarehouseChangeLog",
    "AllowAvgCostMethod",
    "AllowStdCostMethod",
    "AllowJobCostMethod",
    "BarcodeScannerPrefix",
    "BarcodeScannerSuffix",
    "ShipmentNumberGeneration",
    "NextShipmentNumber",
    "NextToNumber",
    "KitComponentInheritCOS",
    "LotSerialControl",
    "MultiWhs",
    "TONumberGeneration"
  ];

  /*
  Return Inventory configuration settings.

  @returns {Object}
  */
  XM.Inventory.settings = function() {
    var keys = XM.Inventory.options,
        data = Object.create(XT.Data),
        sql1 = "select last_value + 1 as value from shipment_number_seq",
        sql2 = "select orderseq_number as value "
             + "from orderseq"
             + " where (orderseq_name=$1)",
        ret = {},
        qry,
        orm;

    ret.NextShipmentNumber = plv8.execute(sql1)[0].value;
    ret.NextToNumber = plv8.execute(sql2, ['ToNumber'])[0].value;

    ret = XT.extend(data.retrieveMetrics(keys), ret);

    /* Special processing for primary key based values */
    orm = XT.Orm.fetch("XM", "SiteRelation");
    ret.DefaultTransitWarehouse = ret.DefaultTransitWarehouse && ret.DefaultTransitWarehouse !== -1 ? 
      data.getNaturalId(orm, ret.DefaultTransitWarehouse) :
      null;

    /* Defaults */
    if (!ret.BarcodeScannerPrefix) {
      ret.BarcodeScannerPrefix = "*";
    }
    if (!ret.BarcodeScannerSuffix) {
      ret.BarcodeScannerSuffix = "13";
    }

    return ret;
  };

  /*
  Update Inventory configuration settings. Only valid options as defined in the array
  XM.Inventory.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Inventory.commitSettings = function(patches) {
    var sql, settings,
      options = XM.Inventory.options,
      data = Object.create(XT.Data),
      metrics = {},
      orm;

    /* check privileges */
    if(!data.checkPrivilege('ConfigureIM')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    settings = XM.Inventory.settings();
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }

    /* update numbers */
    if(settings.NextShipmentNumber) {
      plv8.execute("select setval('shipment_number_seq', $1)", [settings.NextShipmentNumber - 1]);
    }
    options.remove('NextShipmentNumber');

    if(settings['NextToNumber']) {
      plv8.execute("select setNextNumber('ToNumber', $1)", [settings['NextToNumber'] - 0]);
    }
    options.remove('NextToNumber');

    /* update remaining options as metrics
      first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }

    /* Special processing for primary key based values */
    if (metrics.DefaultTransitWarehouse) {
      orm = XT.Orm.fetch("XM", "SiteRelation");
      metrics.DefaultTransitWarehouse = data.getId(orm, metrics.DefaultTransitWarehouse);
    }

    return data.commitMetrics(metrics);
  };

  /**
    Returns an object indicating which cost methods are used.

    @returns Object
  */
  XM.Inventory.usedCostMethods = function() {
    var sql = "select count(*) > 0 as used from itemsite where itemsite_costmethod = $1",
      data = Object.create(XT.Data),
      used = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigureIM')) throw new Error('Access Denied');

    used.average = plv8.execute(sql, ['A'])[0].used;
    used.standard = plv8.execute(sql, ['S'])[0].used;
    used.job = plv8.execute(sql, ['J'])[0].used;

    return used;
  }

  var salesSettings = [
    "MultiWhs"
  ],
  userPreferences = [
    "PreferredWarehouse"
  ];

  salesSettings.map(function (setting) {
    if(XM.Sales && !XM.Sales.options.contains(setting)) {
      XM.Sales.options.push(setting);
    }
  });

  userPreferences.map(function (pref) {
    if(!XM.UserPreference.options.contains(pref)) {
      XM.UserPreference.options.push(pref);
    }
  });

}());

$$ );
