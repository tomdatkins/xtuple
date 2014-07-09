/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true,
 beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    zombieAuth = require("../../../../xtuple/test/lib/zombie_auth"),
    smoke = require("../../../../xtuple/test/lib/smoke"),
    assert = require("chai").assert,
    spec,
    additionalTests;

  spec = {
    recordType: "XM.InventoryAvailability",
    cacheName: null,
    listKind: "XV.InventoryAvailabilityList",
    instanceOf: "XM.Model",
    isLockable: false,
    idAttribute: "uuid",
    collectionType: "XM.InventoryAvailabilityCollection",
    /**
      @member Settings
      @memberof InventoryAvailability
      @description The ID attribute is "uuid", which will be automatically uppercased.
    */
    attributes: ["id", "uuid", "item", "itemType", "site", "description1", "description2", "inventoryUnit",
      "classCode", "plannerCode", "leadTime", "onHand", "allocated", "unallocated", "ordered", "requests",
      "available", "useParameters", "reorderLevel", "orderTo", "isPurchased", "isManufactured"],
    /**
      @member Setup
      @memberof InventoryAvailability
      @description Used in the Inventory module
    */
    extensions: ["inventory"],
    privileges: {
      create: false,
      update: false,
      read: "ViewInventoryAvailability",
      delete: false
    },
    skipCrud: true,
    skipSmoke: true
  };

  additionalTests = function () {
    describe('Inventory Availability', function () {
      var list,
        paramWidget;

      this.timeout(30 * 1000);

      before(function (done) {
        this.timeout(30 * 1000);
        zombieAuth.loadApp(done);
      });

      it("User navigates to Inventory Availability", function (done) {
        smoke.navigateToList(XT.app, "XV.InventoryAvailabilityList");
        list = XT.app.$.postbooks.$.navigator.$.contentPanels.getActive();
        paramWidget = XT.app.$.pullout.getParameterWidget(list.name);
        list.value.once("status:READY_CLEAN", function () {
          done();
        });
      });
      
      it("user checks the Reorder Exceptions and Ignore Reorder at Zero boxes in the filters " +
        "(parameter widget) box", function (done) {
        var checkModelLength,
          startModelLength = list.value.models.length;
        // Make sure we have some models
        assert.notEqual(startModelLength, 0);
        // Uncheck Reorder Exceptions and make sure that the Ignore Reorder at Zero is disabled
        paramWidget.$.reorderExceptions.setValue(false);
        assert.isTrue(paramWidget.$.ignoreZeroReorder.$.input.disabled);
        paramWidget.$.reorderExceptions.setValue(true);

        checkModelLength = function () {
          // There should be less models now
          assert.notEqual(list.value.models.length, startModelLength);
          done();
        };
        list.value.once("status:READY_CLEAN", checkModelLength);
        paramWidget.$.ignoreZeroReorder.setValue(true);
      });
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
