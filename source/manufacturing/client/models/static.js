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
      { id: K.START_DATE, name: "_workOrderStartDate".loc() },
      { id: K.CURRENT_DATE, name: "_dateOfExplosion".loc() }
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

    // Job Items Work Order Cost Recognition Defaults
    var jobItemCosDefaultJson = [
      { id: K.COS_TO_DATE, name: "_toDate".loc() },
      { id: K.COS_PROPORTIONAL, name: "_proportional".loc() }
    ];
    XM.JobItemCosDefaultModel = Backbone.Model.extend({
    });
    XM.JobItemCosDefaultCollection = Backbone.Collection.extend({
      model: XM.JobItemCosDefaultModel
    });
    XM.jobItemCosDefaults = new XM.JobItemCosDefaultCollection();
    for (i = 0; i < jobItemCosDefaultJson.length; i++) {
      var jobItemCosDefault = new XM.JobItemCosDefaultModel(jobItemCosDefaultJson[i]);
      XM.jobItemCosDefaults.add(jobItemCosDefault);
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

  };

}());
