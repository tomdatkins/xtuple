/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  Standard Operation is a template Operation for Work Order processes
  @class
  @alias Standard Operation
  @property {Number} id:
  @property {String} number: Is the id Attribute.](Is a unique code to identify the Std. Operation.
  @property {WorkCenter} workCenter: the Work Center the operation is performed at
  @property {OperationType} operationType: the type of Operation - a simple classification of operation types
  @property {String} description1: Is a brief name to describe the Std. Operation
  @property {String} description2: additional description
  @property {String} toolingReference: Describes what tools are to be used
  @property {Boolean} isReportRun: Report Run Time
  @property {Boolean} isReportSetup: Report Setup Time
  @property {Number} runQuantityPer: Run time reported covers nn items manufactured
  @property {String} productionUnit: Production unit of measure
  @property {UnitRatio} productionUnitRatio: Production unit ration per inventory unit
  @property {String} setupCostType: Setup Cost Type - Direct Labor / Overhead / None
  @property {String} runCostType: Runtime Cost Type - Direct Labor / Overhead / None
  @property {String} instructions: Operation instructions
  @property {Boolean} standardTimes: Switch use standard times
  @property {Number} setupTime: Setup time in minutes
  @property {Number} runTime: Run time in minutes
  **/

  var spec = {
      recordType: "XM.StandardOperation",
      collectionType: "XM.StandardOperationCollection",

      /**
      @member Other
      @memberof StandardOperation
      @description The StandardOperation Collection is not cached.
      */
      cacheName: null,
      listKind: "XV.StandardOperationList",
      instanceOf: "XM.Document",
      skipCrud: false,
      skipSmoke: false,

      /**
        @member Settings
        @memberof StandardOperation
        @description The ID attribute is "number", which will be automatically uppercased.
      */
      idAttribute: ["number"],
      enforceUpperKey: false,
      attributes: ["number", "workCenter", "operationType", "description1", "description2", "toolingReference", "isReportSetup", "isReportRun", "runQuantityPer", "productionUnit", "productionUnitRatio", "setupCostType", "runCostType", "instructions", "standardTimes", "setupTime", "runTime"],
      requiredAttributes: ["number"],
      /**
        @member Settings
        @memberof StandardOperation
        @description StandardOperations are lockable.
      */
      isLockable: true,

      /**
        @member Privileges
        @memberof StandardOperation
        @description StandardOperation can be read, created, updated,
          or deleted by users with the "MaintainStandardOperations" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainStandardOperations",
        read: true
      },


      createHash: {
        number: "SO" + Math.random(),
        description1: 'Standard Operation Description',
        toolingReference: "Microscope"
      },

      updateHash: {
        description1: 'Standard Operation edited'
      },

      updateableField: "description1"

    };

  var additionalTests =  function () {
      /**
      @member Settings
      @memberof StandardOperation
      @description User should not be allowed to duplicate the StandardOperation number
     */
      it.skip("User should not be allowed to duplicate the StandardOperation number", function () {
      });
      /**
      @member Settings
      @memberof StandardOperation
      @description StandardOperation should not allow to save without entering StandardOperation number
     */
      it.skip("User should not able to save unless StandardOperation number is entered", function () {
      });
      /**
      @member Settings
      @memberof StandardOperation
      @description StandardOperation should not allow to save if standradTimes is checked and neither runTime or setupTime entered
     */
      it.skip("User should not able to save if standardTimes is checked and neither runTime or setupTime is entered", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
