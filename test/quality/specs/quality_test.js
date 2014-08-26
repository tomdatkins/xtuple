/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
  
  var async = require("async"),
  _ = require("underscore"),
  common = require("../../../../xtuple/test/lib/common"),
  crud = require("../../../../xtuple/test/lib/crud"),
  smoke = require("../../../../xtuple/test/lib/smoke"),
  zombieAuth = require("../../../../xtuple/test/lib/zombie_auth"),
  assert = require("chai").assert,
  submodels,
  workspace;
  
  //
  // Business logic returning Quality Plan information
  //
  var primeSubmodels = function (done) {
    var submodels = {};
    async.series([
      function (callback) {
        submodels.planModel = new XM.QualityPlanRelation();
        submodels.planModel.fetch({code: "QP10000", success: function () {
          callback();
        }});
      }
    ], function (err) {
      done(err, submodels);
    });
  };
  
  var getBeforeSaveAction = function (planCode) {
    //XM.QualityTest.createFromQualityPlan(planCode);
  };

   /**
  Quality Tests are used to define an actual instance of a test and allow an end user
  to manually record the Test result
  @class
  @alias QualityTest
  @property {String} Code
  @property {String} Description
  @property {String} Test Type
  
  **/
  var spec = {
    recordType: "XM.QualityTest",
    enforceUpperKey: true,
    idAttribute: "numberjshint",
    collectionType: "XM.QualityTestsCollection",
    cacheName: null,
    listKind: "XV.QualityTestList",
    instanceOf: "XM.Model",
    attributes: ["id", "number", "uuid", "qualityPlan", "item", "site", "orderType", "orderNumber", "trace", "revisionNumber", "startDate", "completedDate", "testStatus", "testDisposition", "qualityTestItems", "workflow", "comments", "testNotes"],
    /**
      @member -
      @memberof QualityTest.prototype
      @description Used in the Manufacturing modules
    */
    extensions: ["manufacturing"],
    /**
      @member -
      @memberof QualityTest.prototype
      @description Quality Specs can be read by users with "ViewQualityTests" privilege
      , can be created or updated by users with the "MaintainQualityTests" privilege
      and can be deleted by users with "MaintainQualityTests" privilege
    */
    privileges: {
      createUpdate: "MaintainQualityTests",
      read: "ViewQualityTests",
      delete: "MaintainQualityTests"
    },

    /**
      @member -
      @memberof QualityTest.prototype
      @description QualityTest are lockable.
    */
    isLockable: true,

    createHash: {
      number: "QT10-" + Math.floor(Math.random() * 1000) + 1,
      item: {number: "BTRUCK1"},
      site: {code: "WH1"},
      qualityPlan: {code: "QP10000"},
      revisionNumber: "1",
      startDate: new Date(),
      testStatus: "O", // Open
      testDisposition: "I", // In-Process
      testNotes: "Quality Test Notes"
    },
    
    beforeSaveActions: [{it: 'Sets up a valid test item with plan items assigned',
      action: getBeforeSaveAction({code: "QP10000"})}
    ],
          
    updateHash: {
      revisionNumber: "1.1",
      completedDate: new Date(),
      testStatus: "P", // Pass
      testDisposition: "OK", // Pass
      testNotes: "Quality Test Edited"
    }
      
  };
      
  var additionalTests = function () {
    /**
      @member -
      @memberof QualityPlan
      @description Additional Tests TO BE DEFINED
    */
    describe.skip("Additional tests to be defined for Quality Test documents", function () {
      it.skip("Enter Quality Test Comments", function () {
      });
      it.skip("Quality Test item fails - Overall test FAILS", function () {
      });
      it.skip("All Quality Test items pass - Overall test PASS", function () {
      });
      it.skip("Quality Test Fail - trigger workflow action", function () {
      });
    });
  };
  
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
