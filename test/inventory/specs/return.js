/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true,
require:true, assert:true, setTimeout:true, clearTimeout:true, exports:true,
it:true, describe:true, beforeEach:true, before:true, enyo:true */

(function () {
  "use strict";

  var coreFile = require("../../../../xtuple/test/specs/return"),
    common = require("../../../../xtuple/test/lib/common"),
    _ = require("underscore"),
    async = require("async"),
    assert = require("chai").assert,
    spec = coreFile.spec;

  var extensionTests = function () {

    describe("Inventory extensions to XM.Return", function () {
      var billingCustomer,
        returnModel,
        shiptoAttrArray = [
          "shiptoName",
          "shiptoAddress1",
          "shiptoAddress2",
          "shiptoAddress3",
          "shiptoCity",
          "shiptoState",
          "shiptoPostalCode",
          "shiptoCountry",
        ];

      before(function (done) {
        async.parallel([
          function (done) {
            common.initializeModel(returnModel, XM.Return, function (err, model) {
              returnModel = model;
              done();
            });
          },
          function (done) {
            common.fetchModel(billingCustomer, XM.BillingCustomer, {number: "TTOYS"}, function (err, model) {
              billingCustomer = model;
              done();
            });
          }
        ], done);
      });
      /**
        @member -
        @memberof ReturnLine
        @property {Boolean} updateInventory Added by inventory
      */
      it("Return line has updateInventory", function () {
        assert.include(XM.ReturnLine.prototype.getAttributeNames(), "updateInventory");
      });

      it("Return lines start out with read-only updateInventory", function () {
        var model = new XM.ReturnLine();
        assert.isTrue(model.isReadOnly("updateInventory"));
      });

      /**
        @member -
        @memberof ReturnListItem
        @property {String} shiptoName Added by inventory
      */
      it("Return list item has shiptoName", function () {
        assert.include(XM.ReturnListItem.prototype.getAttributeNames(), "shiptoName");
      });

      /**
        @member -
        @memberof Return
        @property {CustomerShiptoRelation} shipto Added by inventory
        @property {String} shiptoName Added by inventory
        @property {String} shiptoAddress1 Added by inventory
        @property {String} shiptoAddress2 Added by inventory
        @property {String} shiptoAddress3 Added by inventory
        @property {String} shiptoCity Added by inventory
        @property {String} shiptoState Added by inventory
        @property {String} shiptoPostalCode Added by inventory
        @property {String} shiptoCountry Added by inventory
        @property {ShipZone} shipZone Added by inventory
        @property {Money} freight Added by inventory required, default 0
      */
      it("Return has ...", function () {
        var newFields = ["shipto", "shiptoName", "shiptoAddress1", "shipto", "shiptoName",
          "shiptoAddress1", "shiptoAddress2", "shiptoAddress3", "shiptoCity", "shiptoState",
          "shiptoPostalCode", "shiptoCountry", "shipZone", "freight"];
        _.each(newFields, function (field) {
          assert.include(XM.Return.prototype.getAttributeNames(), field);
        });
      });
      it("Freight defaults to 0", function () {
        var model = new XM.Return();
        assert.equal(model.get("freight"), 0);
      });
      /**
        @member -
        @memberof Return

        @description Shipto fields will be set to read only if the customer
          does not allow free-form shipto:
      */
      it("BillingCustomer has isFreeFormShipto", function () {
        assert.include(XM.BillingCustomer.prototype.getAttributeNames(), "isFreeFormShipto");
      });
      it("If BillingCustomer is isFreeFormShipto, we can edit", function () {
        billingCustomer.set({isFreeFormShipto: true});
        returnModel.set({customer: billingCustomer});
        _.each(shiptoAttrArray, function (attr) {
          assert.isFalse(returnModel.isReadOnly(attr));
        });
      });
      it("If BillingCustomer is not isFreeFormShipto, we cannot edit", function () {
        // hackish
        billingCustomer.attributes.isFreeFormShipto = false;
        returnModel.set({customer: null});
        returnModel.set({customer: billingCustomer});
        _.each(shiptoAttrArray, function (attr) {
          assert.isTrue(returnModel.isReadOnly(attr));
        });
      });
      /**
        @member -
        @memberof Return
        @description The inventory extension adds a function to XM.Return
          "copyBilltoToShipto" that does the following
          > Clears the shipto
          > Copies billto name, address fields and phone number to shipto equivilants.
          > Sets the Return tax zone to the customer tax zone.
      */
      it("copy billto to shipto", function () {
        assert.notEqual(returnModel.get("billtoName"), returnModel.get("shiptoName"));
        returnModel.copyBilltoToShipto();
        _.each(shiptoAttrArray, function (attr) {
          assert.equal(returnModel.get(attr.replace("billto", "shipto")), returnModel.get(attr));
        });
        assert.isNull(returnModel.get("shipto"));
        assert.equal(returnModel.get("taxZone").id, returnModel.getValue("customer.taxZone").id);
      });
      /**
        @member -
        @memberof Return
        @description When an Return is loaded where "isPosted" is true, then the following
          attributes will be made read only: shipZone, freight
      */
      it("When an Return is loaded where isPosted is true, then the following " +
          "attributes will be made read only: shipZone, freight", function (done) {
        var postedReturn = new XM.Return(),
          statusChanged = function () {
            if (postedReturn.isReady()) {
              postedReturn.off("statusChange", statusChanged);
              assert.isTrue(postedReturn.isReadOnly("shipZone"));
              assert.isTrue(postedReturn.isReadOnly("freight"));
              done();
            }
          };
        postedReturn.on("statusChange", statusChanged);
        postedReturn.fetch({number: "70000"});
      });
      /*
        @member -
        @memberof Return
        @description If the shipto changes to a value, the following fields should be set based on information
        from the shipto:
        - shiptoName (= customer.shipto.name)
        - shiptoAddress1
        - shiptoAddress2
        - shiptoAddress3
        - shiptoCity
        - shiptoState
        - shiptoPostalCode
        - shiptoCountry (< ^ should be populated by the default customer.shipto.address).
        - shiptoPhone
        - salesRep
        - commission
        - taxZone
        - shipCharge
        - shipZone
      */
      it("Shipto fields get populated from a shipto", function () {
        returnModel.set({customer: null});
        returnModel.set({customer: billingCustomer});
        assert.equal(returnModel.get("shiptoCity"), "Alexandria");
        assert.equal(returnModel.get("salesRep").id,
          returnModel.getValue("shipto.salesRep").id);
        assert.equal(returnModel.get("commission"),
          returnModel.getValue("shipto.commission"));
        assert.equal(returnModel.get("taxZone").id,
          returnModel.getValue("shipto.taxZone").id);
        //assert.equal(returnModel.get("shipCharge"),
        //  returnModel.getValue("shipto.shipCharge"));
        assert.equal(returnModel.get("shipZone").id,
          returnModel.getValue("shipto.shipZone").id);
      });
      /*
        @member -
        @memberof Return
        @description if the shipto is cleared these fields should be unset:
        - shiptoName
        - shiptoAddress1
        - shiptoAddress2
        - shiptoAddress3
        - shiptoCity
        - shiptoState
        - shiptoPostalCode
        - shiptoCountry
        - shiptoPhone
      */
      it.skip("if the shipto is cleared these fields should be unset", function () {
        returnModel.set({shipto: null});
        _.each(shiptoAttrArray, function (attr) {
          assert.isUndefined(returnModel.get(attr));
        });
      });
      /*
        @member -
        @memberof Return
        @description If any of the above listed shipto attributes are manually altered, the shipto is unset.
      */
      it("if the shipto fields are set then shipto should be unset", function () {
        assert.isObject(returnModel.get("shipto"));
        returnModel.set({shiptoAddress2: "123 Street"});
        assert.isNull(returnModel.get("shipto"));
        assert.equal(returnModel.get("shiptoAddress2"), "123 Street");
      });
      /*
        @member -
        @memberof Return
        @description TotalTax should be recalculated when freight changes.
      */
      it.skip("totalTax should be recalculated when freight changes", function () {
        // TODO: put under test (code is written)
      });
    });
  };

  if (!spec.beforeDeleteActions) {
    spec.beforeDeleteActions = [];
  }
  /**
    @member -
    @memberof ReturnLine
    @description The updateInventory attribute is readOnly unless all the following are true
      > The Return is unposted.
      > A valid item is selected.
      > The item and site do not resolve to an item site that is job cost
      > There is no associated salesOrderLine (attr added by sales extension) XXX really?
  */
  spec.beforeDeleteActions.push(
    {it: "updateInventory is readOnly if the return is posted or there " +
        "is no item or if the itemsite is job costed",
        action: function (data, done) {
      // XXX possible nondeterminism if the item site collection fetch hasn't returned yet
      assert.isFalse(data.model.get("lineItems").models[0].isReadOnly("updateInventory"));
      done();
    }}
  );

    /**
      @member -
      @memberof Return
      @description When the customer changes will copy the default shipto from the customer model
     */
  spec.beforeDeleteActions.push(
    {it: "copies the default shipto from the customer", action: function (data, done) {
      assert.equal(data.model.getValue("shipto.number"), "STORE1");
      done();
    }}
  );

  exports.spec = spec;
  exports.additionalTests = coreFile.additionalTests;
  exports.extensionTests = extensionTests;

}());

