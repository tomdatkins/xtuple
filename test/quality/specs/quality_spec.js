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
    common = require("../../../../xtuple/test/lib/common"),
    zombieAuth = require("../../../../xtuple/test/lib/zombie_auth"),
    utils = require("../../inventory/workflow_utils"),
    spec,
    additionalTests;
  
   /**
    Quality Specifications are used to define test procedures as well as expected 
    results and result tolerances
    @class
    @alias QualitySpecification
    @property {String} Code
    @property {String} Description
    @property {String} Test Type
  **/
  
  spec = {
    recordType: "XM.QualitySpecification",
    enforceUpperKey: false,
    idAttribute: "code",
    collectionType: "XM.QualitySpecsCollection",
    cacheName: null,
    listKind: "XV.QualitySpecsList",
    instanceOf: "XM.Document",
    attributes: ["id", "code", "description", "testType", "target", "upper", "lower", "testUnit", "instructions"],
    requiredAttributes: ["code", "description", "testType"],
    /**
      @member -
      @memberof QualitySpecification.prototype
      @description Used in the Manufacturing modules
    */
    extensions: ["quality"],
    /**
      @member -
      @memberof QualitySpecification.prototype
      @description Quality Specs can be read by users with "ViewQualitySpecifications" privilege
      , can be created or updated by users with the "MaintainQualitySpecifications" privilege
      and can be deleted by users with "MaintainQualitySpecifications" privilege
    */
    privileges: {
      createUpdate: "MaintainQualitySpecs",
      read: "ViewQualitySpecs",
      delete: "MaintainQualitySpecs"
    },

    /**
      @member -
      @memberof QualitySpecification.prototype
      @description QualitySpecification are lockable.
    */
    isLockable: true,
    
    createHash: {
      code: "QS100-" + Math.floor(Math.random() * 1000) + 1,
      description: "Spec 100",
      testType: "N", // Numeric Test
      target: 50,
      upper: 51,
      lower: 49,
      testUnit: "KG",
      instructions: "Default instructions"
    },
    
    updatableField: "description",
    
    updateHash: {
      description: "Spec QS100.1",
      instructions: "Altered Instructions"
    }
  };
   
  additionalTests = function () {
    /**
      @member -
      @memberof QualitySpecification
      @description Additional Spec Tests TO BE DEFINED
    */
    describe.skip("Additional tests to be defined for Quality Specification documents", function () {
      it.skip("Cannot enter values on a non-numeric test type", function () {
      });
    });
  };
  
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
