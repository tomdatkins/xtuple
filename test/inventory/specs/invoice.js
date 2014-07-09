/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true,
require:true, assert:true, setTimeout:true, clearTimeout:true, exports:true,
it:true, describe:true, beforeEach:true, before:true, enyo:true */

(function () {
  "use strict";

  var coreFile = require("../../../../xtuple/test/specs/invoice"),
    common = require("../../../../xtuple/test/lib/common"),
    _ = require("underscore"),
    async = require("async"),
    assert = require("chai").assert,
    spec = coreFile.spec;

  var extensionTests = function () {

    describe("Inventory extensions to XM.Invoice", function () {
      var billingCustomer,
        invoiceModel,
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
            common.initializeModel(invoiceModel, XM.Invoice, function (err, model) {
              invoiceModel = model;
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
        @memberof InvoiceLine
        @property {Boolean} updateInventory Added by inventory
      */
      it("Invoice line has updateInventory", function () {
        console.log(JSON.stringify(XM.InvoiceLine.prototype.getAttributeNames()));
        assert.include(XM.InvoiceLine.prototype.getAttributeNames(), "updateInventory");
      });

      it("Invoice lines start out with read-only updateInventory", function () {
        var model = new XM.InvoiceLine();
        assert.isTrue(model.isReadOnly("updateInventory"));
      });

      /**
        @member -
        @memberof InvoiceListItem
        @property {String} shiptoName Added by inventory
      */
      it("Invoice list item has shiptoName", function () {
        assert.include(XM.InvoiceListItem.prototype.getAttributeNames(), "shiptoName");
      });

      /**
        @member -
        @memberof Invoice
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
      it("Invoice has ...", function () {
        var newFields = ["shipto", "shiptoName", "shiptoAddress1", "shipto", "shiptoName",
          "shiptoAddress1", "shiptoAddress2", "shiptoAddress3", "shiptoCity", "shiptoState",
          "shiptoPostalCode", "shiptoCountry", "shipZone", "freight"];
        _.each(newFields, function (field) {
          assert.include(XM.Invoice.prototype.getAttributeNames(), field);
        });
      });
      it("Freight defaults to 0", function () {
        var model = new XM.Invoice();
        assert.equal(model.get("freight"), 0);
      });
      /**
        @member -
        @memberof Invoice

        @description Shipto fields will be set to read only if the customer
          does not allow free-form shipto:
      */
      it("BillingCustomer has isFreeFormShipto", function () {
        assert.include(XM.BillingCustomer.prototype.getAttributeNames(), "isFreeFormShipto");
      });
      it("If BillingCustomer is isFreeFormShipto, we can edit", function () {
        billingCustomer.set({isFreeFormShipto: true});
        invoiceModel.set({customer: billingCustomer});
        _.each(shiptoAttrArray, function (attr) {
          assert.isFalse(invoiceModel.isReadOnly(attr));
        });
      });
      it("If BillingCustomer is not isFreeFormShipto, we cannot edit", function () {
        // hackish
        billingCustomer.attributes.isFreeFormShipto = false;
        invoiceModel.set({customer: null});
        invoiceModel.set({customer: billingCustomer});
        _.each(shiptoAttrArray, function (attr) {
          assert.isTrue(invoiceModel.isReadOnly(attr));
        });
      });
      /**
        @member -
        @memberof Invoice
        @description The inventory extension adds a function to XM.Invoice
          "copyBilltoToShipto" that does the following
          > Clears the shipto
          > Copies billto name, address fields and phone number to shipto equivilants.
          > Sets the invoice tax zone to the customer tax zone.
      */
      it("copy billto to shipto", function () {
        assert.notEqual(invoiceModel.get("billtoName"), invoiceModel.get("shiptoName"));
        invoiceModel.copyBilltoToShipto();
        _.each(shiptoAttrArray, function (attr) {
          assert.equal(invoiceModel.get(attr.replace("billto", "shipto")), invoiceModel.get(attr));
        });
        assert.isNull(invoiceModel.get("shipto"));
        assert.equal(invoiceModel.get("taxZone").id, invoiceModel.getValue("customer.taxZone").id);
      });
      /**
        @member -
        @memberof Invoice
        @description When an Invoice is loaded where "isPosted" is true, then the following
          attributes will be made read only: shipZone, freight
      */
      it.skip("When an Invoice is loaded where isPosted is true, then the following " +
          "attributes will be made read only: shipZone, freight", function (done) {
        var postedInvoice = new XM.Invoice(),
          statusChanged = function () {
            if (postedInvoice.isReady()) {
              postedInvoice.off("statusChange", statusChanged);
              assert.isTrue(postedInvoice.isReadOnly("shipZone"));
              assert.isTrue(postedInvoice.isReadOnly("freight"));
              done();
            }
          };
        postedInvoice.on("statusChange", statusChanged);
        postedInvoice.fetch({number: "70000"});
      });
      /*
        @member -
        @memberof Invoice
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
        invoiceModel.set({customer: null});
        invoiceModel.set({customer: billingCustomer});
        assert.equal(invoiceModel.get("shiptoCity"), "Alexandria");
        assert.equal(invoiceModel.get("salesRep").id,
          invoiceModel.getValue("shipto.salesRep").id);
        assert.equal(invoiceModel.get("commission"),
          invoiceModel.getValue("shipto.commission"));
        assert.equal(invoiceModel.get("taxZone").id,
          invoiceModel.getValue("shipto.taxZone").id);
        //assert.equal(invoiceModel.get("shipCharge"),
        //  invoiceModel.getValue("shipto.shipCharge"));
        assert.equal(invoiceModel.get("shipZone").id,
          invoiceModel.getValue("shipto.shipZone").id);
      });
      /*
        @member -
        @memberof Invoice
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
        invoiceModel.set({shipto: null});
        _.each(shiptoAttrArray, function (attr) {
          assert.isUndefined(invoiceModel.get(attr));
        });
      });
      /*
        @member -
        @memberof Invoice
        @description If any of the above listed shipto attributes are manually altered, the shipto is unset.
      */
      it("if the shipto fields are set then shipto should be unset", function () {
        assert.isObject(invoiceModel.get("shipto"));
        invoiceModel.set({shiptoAddress2: "123 Street"});
        assert.isNull(invoiceModel.get("shipto"));
        assert.equal(invoiceModel.get("shiptoAddress2"), "123 Street");
      });
      /*
        @member -
        @memberof Invoice
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
    @memberof InvoiceLine
    @description The updateInventory attribute is readOnly unless all the following are true
      > The Invoice is unposted.
      > A valid item is selected.
      > The item and site do not resolve to an item site that is job cost
      > There is no associated salesOrderLine (attr added by sales extension) XXX really?
  */
  spec.beforeDeleteActions.push(
    {it: "updateInventory is readOnly if the invoice is posted or there " +
        "is no item or if the itemsite is job costed",
        action: function (data, done) {
      // XXX possible nondeterminism if the item site collection fetch hasn't returned yet
      assert.isFalse(data.model.get("lineItems").models[0].isReadOnly("updateInventory"));
      done();
    }}
  );

    /**
      @member -
      @memberof Invoice
      @description When the customer changes will copy the default shipto from the customer model
     */
  /*spec.beforeDeleteActions.push(
    {it: "copies the default shipto from the customer", action: function (data, done) {
      assert.equal(data.model.getValue("shipto.number"), "STORE1");
      done();
    }}
  );*/

  exports.spec = spec;
  exports.additionalTests = coreFile.additionalTests;
  exports.extensionTests = extensionTests;

}());

