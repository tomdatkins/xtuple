/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initStaticModels = function () {

    // These are hard coded collections that may be turned into tables at a later date
    var K = XM.Manufacturing,
      i;

    // Explode Work Order's Effective as of
    var explodeWoEffectiveJson = [
      { id: K.EXPLODE_START_DATE, name: "_startDate".loc() },
      { id: K.EXPLODE_CURRENT_DATE, name: "_currentDate".loc() }
    ];
    XM.ExplodeWoEffectiveModel = Backbone.Model.extend({
    });
    XM.ExplodeWoEffectiveCollection = Backbone.Collection.extend({
      model: XM.ExplodeWoEffectiveModel
    });
    XM.explodeWoEffectives = new XM.ExplodeWoEffectiveCollection();
    for (i = 0; i < explodeWoEffectiveJson.length; i++) {
      var explodeWoEffective = new XM.ExplodeWoEffectiveModel(explodeWoEffectiveJson[i]);
      XM.explodeWoEffectives.add(explodeWoEffective);
    }

    // Default Work Order Explosion Level
    var woExplosionLevelJson = [
      { id: K.EXPLODE_SINGLE_LEVEL, name: "_singleLevel".loc() },
      { id: K.EXLPODE_MULTIPLE_LEVEL, name: "_multipleLevel".loc() }
    ];
    XM.WoExplosionLevelModel = Backbone.Model.extend({
    });
    XM.WoExplosionLevelCollection = Backbone.Collection.extend({
      model: XM.WoExplosionLevelModel
    });
    XM.woExplosionLevels = new XM.WoExplosionLevelCollection();
    for (i = 0; i < woExplosionLevelJson.length; i++) {
      var woExplosionLevel = new XM.WoExplosionLevelModel(woExplosionLevelJson[i]);
      XM.woExplosionLevels.add(woExplosionLevel);
    }

    // Cost Recognitions
    var costRecognitionsJson = [
      { id: K.TO_DATE_COST_RECOGNITION, name: "_toDate".loc() },
      { id: K.PROPORTINAL_COST_RECOGNITION, name: "_proportional".loc() }
    ];
    XM.CostRecognitionModel = Backbone.Model.extend({
    });
    XM.CostRecognitionCollection = Backbone.Collection.extend({
      model: XM.CostRecognitionModel
    });
    XM.costRecognitions = new XM.CostRecognitionCollection();
    for (i = 0; i < costRecognitionsJson.length; i++) {
      var costRecognition = new XM.CostRecognitionModel(costRecognitionsJson[i]);
      XM.costRecognitions.add(costRecognition);
    }

    // Issue Methods
    var issueMethodsJson = [
      { id: K.ISSUE_PUSH, name: "_push".loc() },
      { id: K.ISSUE_PULL, name: "_pull".loc() },
      { id: K.ISSUE_MIXED, name: "_mixed".loc() }
    ];
    XM.IssueMethodModel = Backbone.Model.extend({
    });
    XM.IssueMethodCollection = Backbone.Collection.extend({
      model: XM.IssueMethodModel
    });
    XM.issueMethods = new XM.IssueMethodCollection();
    for (i = 0; i < issueMethodsJson.length; i++) {
      var issueMethod = new XM.IssueMethodModel(issueMethodsJson[i]);
      XM.issueMethods.add(issueMethod);
    }

    // Work Order Modes
    K = XM.WorkOrder;
    var workOrderModesJson = [
      { id: K.ASSEMBLY_MODE, name: "_assembly".loc() },
      { id: K.DISASSEMBLY_MODE, name: "_disassembly".loc() }
    ];
    XM.WorkOrderModeModel = Backbone.Model.extend({
    });
    XM.WorkOrderModeCollection = Backbone.Collection.extend({
      model: XM.WorkOrderModeModel
    });
    XM.workOrderModes = new XM.WorkOrderModeCollection();
    for (i = 0; i < workOrderModesJson.length; i++) {
      var workOrderMode = new XM.WorkOrderModeModel(workOrderModesJson[i]);
      XM.workOrderModes.add(workOrderMode);
    }

    // Work Order Statuses
    var privs = XT.session.privileges;
    var workOrderStatusesJson = [
      { id: K.OPEN_STATUS, name: "_open".loc() },
      { id: K.EXPLODED_STATUS, name: "_exploded".loc() },
      { id: K.RELEASED_STATUS, name: "_released".loc() },
      { id: K.INPROCESS_STATUS, name: "_inProcess".loc() },
      { id: K.CLOSED_STATUS, name: "_closed".loc() },
    ];
    XM.WorkOrderStatusModel = Backbone.Model.extend({
    });
    XM.WorkOrderStatusCollection = Backbone.Collection.extend({
      model: XM.WorkOrderStatusModel
    });
    XM.workOrderStatuses = new XM.WorkOrderStatusCollection();
    for (i = 0; i < workOrderStatusesJson.length; i++) {
      var workOrderStatus = new XM.WorkOrderStatusModel(workOrderStatusesJson[i]);
      XM.workOrderStatuses.add(workOrderStatus);
    }

    // Work Order Workflow
    K = XM.WorkOrderWorkflow;
    var workOrderWorkflowTypeJson = [
      { id: K.TYPE_ISSUE_MATERIAL, name: "_issueMaterial".loc() },
      { id: K.TYPE_POST_PRODUCTION, name: "_postProduction".loc() },
      { id: K.TYPE_TEST, name: "_test".loc() },
      { id: K.TYPE_OTHER, name: "_other".loc() }
    ];
    XM.WorkOrderWorkflowTypeModel = Backbone.Model.extend({});
    XM.WorkOrderWorkflowTypeCollection = Backbone.Collection.extend({
      model: XM.WorkOrderWorkflowTypeModel
    });
    XM.workOrderWorkflowTypes = new XM.WorkOrderWorkflowTypeCollection();
    _.each(workOrderWorkflowTypeJson, function (obj) {
      XM.workOrderWorkflowTypes.add(new XM.WorkOrderWorkflowTypeModel(obj));
    });

  };

}());
