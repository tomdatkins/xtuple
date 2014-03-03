select xt.install_js('XM','Manufacturing','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Manufacturing) { XM.Manufacturing = {options: []}; }

  XM.Manufacturing.isDispatchable = true;

  XM.Manufacturing.options = [
    "AutoExplodeWO",
    "ExplodeWOEffective",
    "JobItemCosDefault",
    "DefaultWomatlIssueMethod",
    "NextWorkOrderNumber",
    "PostMaterialVariances",
    "Routings",
    "UseSiteCalendar",
    "WorkOrderChangeLog",
    "WOExplosionLevel",
    "WONumberGeneration"
  ];

  /** 
  Return Manufacturing configuration settings.

  @returns {Object}
  */
  XM.Manufacturing.settings = function() {
    var keys = XM.Manufacturing.options.slice(0),
        data = Object.create(XT.Data),
        sql = "select fetchwonumber() as value;",
        ret = {},
        qry;

    ret.NextWorkOrderNumber = plv8.execute(sql)[0].value;  
      
    ret = XT.extend(data.retrieveMetrics(keys), ret);

    return ret;
  };
  
  /** 
  Update Manufacturing configuration settings. Only valid options as defined in the array
  XM.Manufacturing.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Manufacturing.commitSettings = function(patches) {
    var sql, settings,
      options = XM.Manufacturing.options.slice(0),
      data = Object.create(XT.Data), 
      metrics = {};
        
    /* check privileges */
    if(!data.checkPrivilege('ConfigureWO')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    settings = JSON.parse(XM.Manufacturing.settings());
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }
    
    /* update numbers */
    if(settings['NextWorkOrderNumber']) {
      plv8.execute("select setnextwonumber($1)", [settings['NextWorkOrderNumber'] - 0]);
    }
    options.remove('NextWorkOrderNumber'); 

    /* update remaining options as metrics
      first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  };

  /**
    Issue Material.
    
      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"issueMaterial",
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
  XM.Manufacturing.issueMaterial = function (orderLine, quantity, options) {
    var asOf,
      series,
      sql,
      sql2,
      ary,
      item,
      i;

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{orderLine: orderLine, quantity: quantity, options: options || {}}];
    } else {
      ary = arguments;
    }

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("IssueWoMaterials")) { throw new handleError("Access Denied", 401); }

    sql = "select issuewomaterial(womatl_id, $2::numeric, $3::integer, coalesce($4, now())::timestamptz) as series " +
           "from womatl where obj_uuid = $1;";  

    sql2 = "select current_date != $1 as invalid";         

    /* Post the transaction */
    for (i = 0; i < ary.length; i++) {
      item = ary[i];
      asOf = item.options ? item.options.asOf : null;
      series = plv8.execute(sql, [item.orderLine, item.quantity, 0, asOf])[0].series;

      if (asOf && plv8.execute(sql2, [asOf])[0].invalid &&
          !XT.Data.checkPrivilege("AlterTransactionDates")) {
        throw new handleError("Insufficient privileges to alter transaction date", 401);
      }

      /* Distribute detail */
      XM.PrivateInventory.distribute(series, item.options.detail);
    }

    return;
  };
  XM.Manufacturing.issueMaterial.description = "Issue Materials.";
  XM.Manufacturing.issueMaterial.request = {
      "$ref": "ManufacturingIssueMaterial"
    };
  XM.Manufacturing.issueMaterial.parameterOrder = ["orderLines"];
  XM.Manufacturing.issueMaterial.schema = {
    ManufacturingIssueMaterial: {
      properties: {
        orderLines: {
          title: "OrderLines",
          type: "object",
          "$ref": "ManufacturingIssueMaterialOrderLine"
        }
      }
    },
    ManufacturingIssueMaterialOrderLine: {
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
          "$ref": "ManufacturingIssueMaterialOptions"
        }
      }
    },
    ManufacturingIssueMaterialOptions: {
      properties: {
        detail: {
          title: "Detail",
          description: "Distribution Detail",
          type: "object",
          items: {
            "$ref": "ManufacturingIssueMaterialOptionsDetails"
          }
        },
        asOf: {
          title: "As Of",
          description: "Transaction Timestamp, default to now()",
          type: "string",
          format: "date-time"
        }
      }
    },
    ManufacturingIssueMaterialOptions: {
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
    Post production against a Work Order
    
    @param {String} Work Order uuid
    @param {Number} Quantity
    @param {Object} Options
    @param {Date} [options.asOf] As of date
  */
  XM.Manufacturing.postProduction = function (workOrderId, quantity, options) {
    options = options || {};
    var data = Object.create(XT.Data), 
      orm = data.fetchOrm("XM", "WorkOrderRelation"),
      id = data.getId(orm, workOrderId),
      params,
      casts = ["integer", "numeric", "boolean", "integer", "timestamptz"],
      asOf,
      sql,
      series,
      invalid;
  
    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("PostProduction")) {
      throw new handleError("Access Denied", 401);
    }

    /* Handle transaction date */
    if (options.asOf && !XT.Data.checkPrivilege("AlterTransactionDates")) {
      /* If the user passed a date but doesn't have privs, it needs to be the current date */
      sql = "select current_date != $1 as invalid";
      invalid = plv8.execute(sql, [options.asOf])[0].invalid;
      if (invalid) {
        throw new handleError("Insufficient privileges to alter transaction date", 401);
      }
    } else {
      sql = "select current_date as asof";
      asOf = options.asOf || plv8.execute(sql)[0].asof;
    }

    /* Backflush first */
    if (options.backflushDetails) {
      for (i = 0; i < options.backflushDetails.length; i++) {
        var bfItem = options.backflushDetails[i];
        if (DEBUG) {
          XT.debug("backFlush orderLine = " + bfItem.orderLine);
          XT.debug("backFlush quantity = " + bfItem.quantity);
          XT.debug("backFlush options = " + bfItem.options);
        }
        XM.Manufacturing.issueMaterial(bfItem.orderLine, bfItem.quantity, bfItem.options);
      }
    }

    /* Post the transaction */
    params = [id, quantity, false, 0, asOf];
    series = XT.executeFunction("postproduction", params, casts);

    if (DEBUG) {
      XT.debug("postProduction seriesId = " + series);
    }
    /* Distribute detail */
    XM.PrivateInventory.distribute(series, options.detail);

    /* Close the Work Order if options.isCloseOnPost */
    if (options.closeWorkOrder) {
      var options = {};
      options.asOf = asOf;
      
      XM.WorkOrder.close(workOrderId, options);    
    }

    return true;
  };
  XM.Manufacturing.postProduction.description = "Post production";
  XM.Manufacturing.postProduction.request = {
    "$ref": "ManufacturingPostProduction"
  };
  XM.Manufacturing.postProduction.parameterOrder = ["workOrder"];
  XM.Manufacturing.postProduction.schema = {
    ManufacturingPostProduction: {
      properties: {
        order: {
          title: "Work Order",
          description: "Work Order Id",
          type: "String",
          "$ref": "Order/uuid",
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
          "$ref": "ManufacturingPostProductionOptions"
        }
      }
    },
    ManufacturingPostProductionOptions: {
      properties: {
        detail: {
          title: "Detail",
          description: "Distribution Detail",
          type: "object",
          items: {
            "$ref": "ManufacturingPostProductionOptionsDetails"
          }
        },
        asOf: {
          title: "As Of",
          description: "Transaction Timestamp, default to now()",
          type: "string",
          format: "date-time"
        },
        backflush: {
          title: "Backflush Materials",
          description: "Backflush Materials checkbox",
          type: "Boolean"
        },
        close: {
          title: "Close Work Order",
          description: "Close Work Order checkbox",
          type: "Boolean"
        }
      }
    },
    ManufacturingPostProductionOptionsDetails: {
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
    Return material transactions.
    
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
  XM.Manufacturing.returnMaterial = function (orderLine, quantity, options) {
    var asOf,
      item,
      ary,
      sql,
      invalid,
      series,
      id,
      i;

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{orderLine: orderLine, quantity: quantity, options: options || {}}];
    } else {
      ary = arguments;
    }

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("ReturnWoMaterials")) { throw new handleError("Access Denied", 401); }

    for (i = 0; i < ary.length; i++) {

      item = ary[i];
      id = XT.Data.getId(XT.Orm.fetch('XM', 'WorkOrderMaterial'), item.orderLine);
      asOf = item.options ? item.options.asOf : new Date();
      
      if (!id) {
        plv8.elog(ERROR, "uuid: " + item.orderLine + " did not return an id from XM.WorkOrderMaterial orm."); 
      } else if (!item.quantity) {
        plv8.elog(ERROR, "quantity is required.");
      } 

      /* Handle transaction date:
         If the user passed a date but doesn't have privs, it needs to be the current date */
      if (asOf && !XT.Data.checkPrivilege("AlterTransactionDates")) {
        sql = "select current_date != $1::date as invalid ;";
        invalid = plv8.execute(sql, [asOf])[0].invalid;
        if (invalid) {
          throw new handleError("Insufficient privileges to alter transaction date", 401);
        }
      }
  
      series = XT.executeFunction("returnwomaterial", [id, item.quantity, asOf], ["integer", "numeric", "timestamptz"]); 

      /* Distribute detail */
      if (item.options.detail && series) {
        XM.PrivateInventory.distribute(series, item.options.detail);
      } else if (item.options.detail && !series) {
        throw new handleError("returnMaterial(" + item.orderLine + ", " + 0 + ") did not return a series id.", 400)
      }
    }

    return;

  };
  XM.Manufacturing.returnMaterial.description = "Return issued materials from manufacturing to inventory.";
  XM.Manufacturing.returnMaterial.request = {
   "$ref": "ManufacturingReturnMaterial"
  };
  XM.Manufacturing.returnMaterial.parameterOrder = ["orderLines"];
  XM.Manufacturing.returnMaterial.schema = {
    ManufacturingReturnMaterial: {
      properties: {
        orderLines: {
          title: "OrderLines",
          type: "object",
          "$ref": "ManufacturingReturnMaterialOrderLine"
        }
      }
    },
    ManufacturingReturnMaterialOrderLine: {
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
          type: "Number"
        },
        options: {
          title: "Options",
          type: "object",
          "$ref": "ManufacturingReturnMaterialOptions"
        }
      }
    },
    ManufacturingReturnMaterialOptions: {
      properties: {
        asOf: {
          title: "As Of",
          description: "Transaction Timestamp, default to now()",
          type: "string",
          format: "date-time"
        }
      }
    }
  };

}());
  
$$ );
