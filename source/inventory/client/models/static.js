/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  XT.extensions.inventory.initStaticModels = function () {
    // These are hard coded collections that may be turned into tables at a later date
    var i,
      K,
      callback = function () {
        // Only add trace options if they are turned on
        if (XT.session.settings.get("LotSerialControl")) {
          XM.controlMethods.add({ id: XM.ItemSite.LOT_CONTROL, name: "_lot".loc() })
                           .add({ id: XM.ItemSite.SERIAL_CONTROL, name: "_serial".loc() });
        }
      };

    // Planning System
    K = XM.ItemSite;
    var planningSystemJson = [
      { id: K.NO_PLANNING, name: "_none".loc() },
      { id: K.MRP_PLANNING, name: "_mrp".loc() }
    ];
    XM.PlanningSystem = Backbone.Model.extend({});
    XM.PlanningSystemCollection = Backbone.Collection.extend({
      model: XM.PlanningSystem
    });
    XM.planningSystems = new XM.PlanningSystemCollection();
    for (i = 0; i < planningSystemJson.length; i++) {
      var planningSystem = new XM.PlanningSystem(planningSystemJson[i]);
      XM.planningSystems.add(planningSystem);
    }

    // ABC Class
    var abcClassJson = [
      { id: "A", name: "_a".loc() },
      { id: "B", name: "_b".loc() },
      { id: "C", name: "_c".loc() }
    ];
    XM.AbcClassModel = Backbone.Model.extend({
    });
    XM.AbcClassCollection = Backbone.Collection.extend({
      model: XM.AbcClassModel
    });
    XM.abcClasses = new XM.AbcClassCollection();
    for (i = 0; i < abcClassJson.length; i++) {
      var abcClass = new XM.AbcClassModel(abcClassJson[i]);
      XM.abcClasses.add(abcClass);
    }

    // Cost Method for Avg Cost Count Tags
    var countAvgCostMethodJson = [
      { id: "stdcost", name: "_standardCost".loc() },
      { id: "avgcost", name: "_averageCost".loc() }
    ];
    XM.CountAvgCostMethodModel = Backbone.Model.extend({
    });
    XM.CountAvgCostMethodCollection = Backbone.Collection.extend({
      model: XM.CountAvgCostMethodModel
    });
    XM.countAvgCostMethod = new XM.CountAvgCostMethodCollection();
    for (i = 0; i < countAvgCostMethodJson.length; i++) {
      var countAvgCostMethod = new XM.CountAvgCostMethodModel(countAvgCostMethodJson[i]);
      XM.countAvgCostMethod.add(countAvgCostMethod);
    }

    // When Count Tag Qty Exceeds Slip Qty
    var postCountTagToDefaultJson = [
      { id: "default", name: "_postToDefaultLocation".loc() },
      { id: "dontPost", name: "_dontPost".loc() }
    ];
    XM.PostCountTagToDefaultModel = Backbone.Model.extend({
    });
    XM.PostCountTagToDefaultCollection = Backbone.Collection.extend({
      model: XM.PostCountTagToDefaultModel
    });
    XM.postCountTagToDefault = new XM.PostCountTagToDefaultCollection();
    for (i = 0; i < postCountTagToDefaultJson.length; i++) {
      var postCountTagToDefault = new XM.PostCountTagToDefaultModel(postCountTagToDefaultJson[i]);
      XM.postCountTagToDefault.add(postCountTagToDefault);
    }

    // Control Method
    var controlMethodJson = [
      { id: XM.ItemSite.NO_CONTROL, name: "_none".loc() },
      { id: XM.ItemSite.REGULAR_CONTROL, name: "_regular".loc() }
    ];
    XM.ControlMethodModel = Backbone.Model.extend({
    });
    XM.ControlMethodCollection = Backbone.Collection.extend({
      model: XM.ControlMethodModel
    });
    XM.controlMethods = new XM.ControlMethodCollection();
    for (i = 0; i < controlMethodJson.length; i++) {
      var controlMethod = new XM.ControlMethodModel(controlMethodJson[i]);
      XM.controlMethods.add(controlMethod);
    }

    // Cost Slip Auditing
    var countSlipAuditingJson = [
      { id: "allowDups", name: "_allowDups".loc() },
      { id: "noUnpostedDupsSite", name: "_noUnpostedSlipDupsSite".loc() },
      { id: "noUnpostedDups", name: "_noUnpostedSlipDups".loc() },
      { id: "noSlipDupsSite", name: "_noSlipDupsSite".loc() },
      { id: "noSlipDups", name: "_noSlipDups".loc() }
    ];
    XM.CountSlipAuditingModel = Backbone.Model.extend({
    });
    XM.CountSlipAuditingCollection = Backbone.Collection.extend({
      model: XM.CountSlipAuditingModel
    });
    XM.countSlipAuditing = new XM.CountSlipAuditingCollection();
    for (i = 0; i < countSlipAuditingJson.length; i++) {
      var countSlipAuditing = new XM.CountSlipAuditingModel(countSlipAuditingJson[i]);
      XM.countSlipAuditing.add(countSlipAuditing);
    }

    // Cost Method
    K = XM.ItemSite;
    var costMethodJson = [
        {id: K.NO_COST, name: "_none".loc() },
        {id: K.AVERAGE_COST, name: "_average".loc()},
        {id: K.STANDARD_COST, name: "_standard".loc()},
        {id: K.JOB_COST, name: "_job".loc()}
      ];

    XM.CostMethodModel = Backbone.Model.extend({
    });
    XM.CostMethodCollection = Backbone.Collection.extend({
      model: XM.CostMethodModel
    });
    XM.costMethods = new XM.CostMethodCollection();
    for (i = 0; i < costMethodJson.length; i++) {
      var costMethod = new XM.CostMethodModel(costMethodJson[i]);
      XM.costMethods.add(costMethod);
    }

    // Transfer Order
    K = XM.TransferOrder;
    var transferOrderStatusesJson = [
      { id: K.UNRELEASED_STATUS, name: "_unreleased".loc() },
      { id: K.OPEN_STATUS, name: "_open".loc() },
      { id: K.CLOSED_STATUS, name: "_closed".loc() }
    ];
    XM.TransferOrderStatusModel = Backbone.Model.extend({
    });
    XM.TransferOrderStatusCollection = Backbone.Collection.extend({
      model: XM.TransferOrderStatusModel
    });
    XM.transferOrderStatuses = new XM.TransferOrderStatusCollection();
    for (i = 0; i < transferOrderStatusesJson.length; i++) {
      var transferOrderStatus = new XM.TransferOrderStatusModel(transferOrderStatusesJson[i]);
      XM.transferOrderStatuses.add(transferOrderStatus);
    }

    // Transfer Order Workflow
    K = XM.TransferOrderWorkflow;
    var transferOrderWorkflowTypeJson = [
      { id: K.TYPE_OTHER, name: "_other".loc() },
      { id: K.TYPE_PACK, name: "_pack".loc() },
      { id: K.TYPE_POST_RECEIPTS, name: "_postReceipts".loc() },
      { id: K.TYPE_RECEIVE, name: "_receive".loc() },
      { id: K.TYPE_SHIP, name: "_ship".loc() }
    ];
    XM.TransferOrderWorkflowTypeModel = Backbone.Model.extend({});
    XM.TransferOrderWorkflowTypeCollection = Backbone.Collection.extend({
      model: XM.TransferOrderWorkflowTypeModel
    });
    XM.transferOrderWorkflowTypes = new XM.TransferOrderWorkflowTypeCollection();
    _.each(transferOrderWorkflowTypeJson, function (obj) {
      XM.transferOrderWorkflowTypes.add(new XM.TransferOrderWorkflowTypeModel(obj));
    });

    // It's likely settings haven't been loaded so we'll have to wait until they are
    // To add trace options if applicable
    if (XT.session.settings) {
      callback();
    } else {
      XT.getStartupManager().registerCallback(callback);
    }

    // Add to workflow type (defined in core)
    K = XM.PurchaseOrderWorkflow;
    var purchaseOrderWorkflowTypeJson = [
      { id: K.TYPE_RECEIVE, name: "_receive".loc() },
      { id: K.TYPE_POST_RECEIPTS, name: "_postReceipt".loc() }
    ];
    _.each(purchaseOrderWorkflowTypeJson, function (obj) {
      XM.purchaseOrderWorkflowTypes.add(new XM.PurchaseOrderWorkflowTypeModel(obj));
    });

    K = XM.SalesOrderWorkflow;
    var salesOrderWorkflowTypeJson = [
      { id: K.TYPE_PACK, name: "_pack".loc() },
      { id: K.TYPE_SHIP, name: "_ship".loc() }
    ];
    _.each(salesOrderWorkflowTypeJson, function (obj) {
      XM.salesOrderWorkflowTypes.add(new XM.SalesOrderWorkflowTypeModel(obj));
    });

    // Look ahead types
    K = XM.ItemSite;
    var lookAheadJson = [
        {id: "byLeadTime", name: "_byLeadTime".loc() },
        {id: "byDays", name: "_byDays".loc()},
        {id: "byDates", name: "_byDates".loc()}
      ];

    XM.LookAheadModel = Backbone.Model.extend({
    });
    XM.LookAheadCollection = Backbone.Collection.extend({
      model: XM.LookAheadModel
    });
    XM.lookAheadOptions = new XM.CostMethodCollection();
    for (i = 0; i < lookAheadJson.length; i++) {
      var lookAheadOption = new XM.LookAheadModel(lookAheadJson[i]);
      XM.lookAheadOptions.add(lookAheadOption);
    }


  };

}());
