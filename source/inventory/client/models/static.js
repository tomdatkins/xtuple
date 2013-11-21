/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initStaticModels = function () {
    // These are hard coded collections that may be turned into tables at a later date
    var i;

    var callback = function () {
      // Only add trace options if they are turned on
      // TODO: this needs to be done better
      if (XT.session.settings.get("LotSerialControl")) {
        if (!XM.controlMethods) {
          XM.ControlMethodModel = Backbone.Model.extend({
          });
          XM.ControlMethodCollection = Backbone.Collection.extend({
            model: XM.ControlMethodModel
          });
          XM.controlMethods = new XM.ControlMethodCollection();
        }
        XM.controlMethods.add({ id: XM.ItemSite.LOT_CONTROL, name: "_lot".loc() })
                         .add({ id: XM.ItemSite.SERIAL_CONTROL, name: "_serial".loc() });
      }
    };

    // It's likely settings haven't been loaded so we'll have to wait until they are
    // To add trace options if applicable
    if (XT.session.settings) {
      callback();
    } else {
      XT.getStartupManager().registerCallback(callback);
    }

    // Planning System
    var K = XM.ItemSite,
      planningSystemJson = [
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
  };

}());
