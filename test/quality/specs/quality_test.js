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
  // Business logic returning Quality Spec information
  //
  var primeSubmodels = function (done) {
    var submodels = {};
    async.series([
      function (callback) {
        submodels.specModel = new XM.QualityPlanRelation();
        submodels.specModel.fetch({number: "QP-300-1", success: function () {
          callback();
        }});
      }
    ], function (err) {
      done(submodels);
    });
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
    enforceUpperKey: false,    
    idAttribute: "uuid",
    collectionType: "XM.QualityTestsCollection",
    cacheName: null,
    listKind: "XV.QualityTestList",
    instanceOf: "XM.Document",
    attributes: ["id", "number", "uuid", "qualityPlan", "item", "site", "orderType", "orderNumber", "parent", "trace", "revisionNumber", "startDate", "completedDate", "testStatus", "testDisposition", "qualityTestItems", "workflow", "comments", "testNotes"],
    requiredAttributes: ["number", "qualityPlan", "item", "site"],
    /**
      @member -
      @memberof QualityTest.prototype
      @description Used in the Manufacturing modules
    */
    extensions: ["quality"],
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
    
    skipSmoke: true,

    createHash: {
      number: "QT10-" + Math.floor(Math.random() * 1000) + 1,
      qualityPlan: { uuid: "4b5d05bc-f3a0-44d4-c611-e01db888442e" },
      item: { number: "BTRUCK1" },
      site: { code: "WH1" },
      startDate: new Date(),
      testStatus: "O", // Open
      testDisposition: "I", // In-Process
      testNotes: "Quality Test Notes"
    },
                
    updateHash: {
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
    describe("Additional tests for Quality Test documents", function () {
      it.skip("Check Quality Test revision equals Plan Revision", function (done) {
        var qualityTest = new XM.QualityTest(),
          initCallback = function () {
            assert.equal(qualityTest.getValue("revisionNumber"), "");
            qualityTest.set({qualityPlan: "QP-300-1"});
            //Quality Plan Revision gets copied to the Quality Test
            assert.equal(qualityTest.getValue("revisionNumber"), "1");
            done();
          };  
          
        qualityTest.on('change:number', initCallback);
        qualityTest.initialize(null, {isNew: true});
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
