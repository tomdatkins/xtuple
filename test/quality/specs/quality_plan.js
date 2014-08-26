/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
  
  var _ = require("underscore"),
    assert = require("chai").assert,
    crud = require("../../../../xtuple/test/lib/crud"),
    smoke = require("../../../../xtuple/test/lib/smoke"),
    zombieAuth = require("../../../../xtuple/test/lib/zombie_auth"),
    utils = require("../../inventory/workflow_utils"),
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
            if (lineRecordType === "XM.QualityPlanItem") {
              //lineItem.off("all", unitUpdated);
              if (!movedOn) {
                movedOn = true;
                next();
              }
            }
          };

          // Add Specification to the Plan Item
          lineItem.on("all", unitUpdated);
          data.model.get("items").add(lineItem);
          lineItem.set({item: submodels.specModel});
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
    enforceUpperKey: true,
    idAttribute: "code",
    collectionType: "XM.QualityPlansCollection",
    cacheName: null,
    listKind: "XV.QualityPlansList",
    instanceOf: "XM.Model",
    
    attributes: ["id", "code", "description", "revisionNumber", "revisionDate", "revisionStatus", "items", "itemSiteAssignment", "workflow", "notes", "emailProfile"],
    /**
      @member -
      @memberof QualityPlan.prototype
      @description Used in the Manufacturing modules
    */
    extensions: ["manufacturing"],
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
      code: "QP100-"+ Math.floor(Math.random() * 1000) + 1,
      description: "QPlan 100-" + + Math.floor(Math.random() * 1000) + 1,
      revisionNumber: "1",
      revisionDate: new Date(),
      revisionStatus: "A", // Active
      notes: "Quality Test Plan"
    },
/*    
    beforeSaveActions: [{it: 'Sets up a valid quality plan item with a specification assigned',
      action: getBeforeSaveAction("XM.QualityPlanItem")}
    ],
*/    
    updateHash: {
      description: "QPlan 2" + Math.floor(Math.random() * 1000) + 1,
      revisionNumber: "1.1",
      revisionDate: new Date(),
      notes: "Quality Plan Edit"
    }

  };

  describe('Quality Plan', function () {
         
      this.timeout(40 * 1000);      
      crud.runAllCrud(spec);
      spec.captureObject = true;
      smoke.runUICrud(spec);
      
  });
  
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
