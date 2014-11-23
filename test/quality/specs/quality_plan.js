/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true, console:true*/

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    utils = require("../../inventory/workflow_utils"),
    async = require("async"),
    spec,
    additionalTests;

  //
  // Business logic returning Quality Spec information
  //
  var primeSubmodels = function (done) {
    var submodels = {};
    async.series([
      function (callback) {
        submodels.specModel = new XM.QualitySpecRelation();
        submodels.specModel.fetch({number: "QS300-1", success: function () {
          callback();
        }});
      }
    ], function (err) {
      done(submodels);
    });
  };

  var getBeforeSaveAction = function (lineRecordType) {
    return function (data, next) {
      var lineItem = new XM[lineRecordType.substring(3)](),
        itemInitialized = function (submodels) {
          var unitUpdated = function () {
            // make sure all the fields we need to save successfully have been calculated
            if (!movedOn) {
              movedOn = true;
              next();
            }
          };

          // Add Specification to the Plan Item
          lineItem.on("all", unitUpdated);
          console.log("Adding Specification " + submodels.specModel.id + " to Plan");
          data.model.get("items").add(lineItem);
          lineItem.set({specification: submodels.specModel.id});
        };


      var movedOn = false;
      lineItem.on("statusChange", function () {
        if (lineItem.getStatus() === XM.Model.READY_NEW) {
          primeSubmodels(itemInitialized);
        }
      });
      lineItem.initialize(null, {isNew: true});
    };
  };

   /**
    Quality Plans are used to define test procedures as well as expected
    results and result tolerances
    @class
    @alias QualityPlan
    @property {String} Code
    @property {String} Description
    @property {String} Test Type
  **/
  spec = {
    recordType: "XM.QualityPlan",
    enforceUpperKey: false,
    idAttribute: "uuid",
    collectionType: "XM.QualityPlansCollection",
    cacheName: null,
    listKind: "XV.QualityPlansList",
    instanceOf: "XM.Document",

    attributes: ["id", "uuid", "code", "description", "revisionNumber", "revisionDate", "revisionStatus", "items", "itemSiteAssignment", "workflow", "notes", "emailProfile"],
    /**
      @member -
      @memberof QualityPlan.prototype
      @description Used in the Manufacturing modules
    */
    extensions: ["quality"],
    /**
      @member -
      @memberof QualityPlan.prototype
      @description Quality Specs can be read by users with "ViewQualityPlans" privilege
      , can be created or updated by users with the "MaintainQualityPlans" privilege
      and can be deleted by users with "MaintainQualityPlans" privilege
    */
    privileges: {
      createUpdate: "MaintainQualityPlans",
      read: "ViewQualityPlans",
      delete: "MaintainQualityPlans"
    },

    /**
      @member -
      @memberof QualityPlan.prototype
      @description QualityPlan are lockable.
    */
    isLockable: true,

    createHash: {
      code: "QP100-" + Math.floor(Math.random() * 1000) + 1,
      description: "QPlan 100-" + Math.floor(Math.random() * 1000) + 1,
      revisionNumber: "1",
      revisionDate: new Date(),
      revisionStatus: "A", // Active
      emailProfile: {name: "SUPERV"},
      notes: "Quality Test Plan"
    },

    beforeSaveActions: [{it: 'Sets up a valid quality plan item with a specification assigned',
      action: getBeforeSaveAction("XM.QualityPlanItem")}
    ],

    updateHash: {
      description: "QPlan 2" + Math.floor(Math.random() * 1000) + 1,
      revisionDate: new Date(),
      notes: "Quality Plan Edit"
    }

  };

  additionalTests = function () {
    /**
      @member -
      @memberof QualityPlan
      @description Additional Tests TO BE DEFINED
    */
    describe.skip("Additional tests to be defined for Quality Plan documents", function () {
      it.skip("Quality Plan Comments", function () {
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
  exports.primeSubmodels = primeSubmodels;
  exports.getBeforeSaveAction = getBeforeSaveAction;

}());
