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

  spec.captureObject = true;

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
          "shiptoPhone"
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
        assert.include(XM.InvoiceLine.prototype.getAttributeNames(), "updateInventory");
      });

      it("Invoice lines start out with read-only updateInventory", function () {
        var model = new XM.InvoiceLine();

        model.on("status:READY_NEW", function () {
          assert.isTrue(model.isReadOnly("updateInventory"));
        });
      });

      /**
        @member -
        @memberof InvoiceListItem
        @property {String} shiptoName Added by inventory
        @property {Date} shipDate Added by inventory
      */
      it("Invoice list item has shiptoName", function () {
        assert.include(XM.InvoiceListItem.prototype.getAttributeNames(), "shiptoName");
        assert.include(XM.InvoiceListItem.prototype.getAttributeNames(), "shipDate");
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
        @property {String} shiptoPhone Added by inventory
        @property {String} shipCharge Added by inventory
        @property {String} shipZone Added by inventory
        @property {String} incoterms Added by inventory
        @property {String} shipVia Added by inventory (The preferred Ship Via method for the 
          Customer will appear in the field. You may change the Ship Via using the list.)
        @property {Money} freight Added by inventory required, default 0
      */
      it("Invoice has ...", function () {
        var newFields = ["shipto", "shiptoName", "shiptoAddress1", "shiptoAddress2",
          "shiptoAddress3", "shiptoCity", "shiptoState", "shiptoPostalCode", "shiptoCountry",
          "shiptoPhone", "shipCharge", "shipZone", "incoterms", "shipVia", "freight"];
        _.each(newFields, function (field) {
          assert.include(XM.Invoice.prototype.getAttributeNames(), field);
        });
      });
      it("Freight defaults to 0", function () {
        var model = new XM.Invoice();
        assert.equal(model.get("freight"), 0);
      });
      it.skip("Freight should be read only and zero when the 'isCustomerPay' property is false on the " +
        "ship charge associated with the invoice.", function () {
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
        var statusChanged = function () {
          if (invoiceModel.isReady()) {
            _.each(shiptoAttrArray, function (attr) {
              assert.isTrue(invoiceModel.isReadOnly(attr));
            });
          }
        };
        billingCustomer.set({isFreeFormShipto: false});
        invoiceModel.set({customer: null});
        invoiceModel.once("statusChange", statusChanged);
        invoiceModel.set({customer: billingCustomer});
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
      it("When an Invoice is loaded where isPosted is true, then the following " +
          "attributes will be made read only: shipZone, freight", function (done) {
        var postedInvoice = new XM.Invoice(),
          statusChanged = function () {
            if (postedInvoice.isReady()) {
              postedInvoice.off("statusChange", statusChanged);
              assert.isTrue(postedInvoice.isReadOnly("lineItems"));
              assert.isTrue(postedInvoice.isReadOnly("number"));
              assert.isTrue(postedInvoice.isReadOnly("invoiceDate"));
              assert.isTrue(postedInvoice.isReadOnly("terms"));
              assert.isTrue(postedInvoice.isReadOnly("salesRep"));
              assert.isTrue(postedInvoice.isReadOnly("commission"));
              assert.isTrue(postedInvoice.isReadOnly("taxZone"));
              assert.isTrue(postedInvoice.isReadOnly("shipCharge"));
              assert.isTrue(postedInvoice.isReadOnly("project"));
              assert.isTrue(postedInvoice.isReadOnly("freight"));
              assert.isTrue(postedInvoice.isReadOnly("shipZone"));
              assert.isTrue(postedInvoice.isReadOnly("saleType"));
              assert.isTrue(postedInvoice.isReadOnly("freight"));
              done();
            }
          };
        postedInvoice.on("statusChange", statusChanged);
        postedInvoice.fetch({number: "60000"});
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
        var statusReadyDirty = function () {
          assert.equal(invoiceModel.get("shiptoCity"), "Alexandria");
          assert.equal(invoiceModel.get("salesRep").id,
            invoiceModel.getValue("shipto.salesRep").id);
          assert.equal(invoiceModel.get("commission"), invoiceModel.getValue("shipto.commission"));
          assert.equal(invoiceModel.get("taxZone").id, invoiceModel.getValue("shipto.taxZone").id);
          assert.equal(invoiceModel.get("shipCharge"), invoiceModel.getValue("shipto.shipCharge"));
          assert.equal(invoiceModel.get("shipZone").id,
            invoiceModel.getValue("shipto.shipZone").id);
        };
        invoiceModel.set({customer: null});
        invoiceModel.once("status:READY_DIRTY", statusReadyDirty);
        invoiceModel.set({customer: billingCustomer});
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
      @description When the customer changes will copy the default shipto and shipCharge from the customer model
     */
  /*spec.beforeDeleteActions.push(
    {it: "copies the default shipto from the customer", action: function (data, done) {
      assert.equal(data.model.getValue("shipto.number"), "STORE1");
      // TODO - check that shipCharge came from customer
      done();
    }}
  );*/
  
  /** TODOs
    * XM.InvoiceListItem will extend the post function to include inventory information
    * For each line item where "updateInventory" is true, issue materials to the invoice
    * Capture distribution detail (trace and location) where applicable

    * Add the following to the invoice workspace:
      > When the customer is changed on the XV.InvoiceWorkspace model:
        - customer should be set on shipto relation so that it will search on and select from that
        customer's shipto addresses.
        - The bill to address should be supplimented with a "Shipto" button that when clicked runs
        the copyToShipto function ()
        - The copy ship to button should be disabled if the customer does not allow free-form shiptos.
      > The shipto addresses available when searching addresses sholud filter on the addresses
      associated with the customer's account record by default
  */

  exports.spec = spec;
  exports.additionalTests = coreFile.additionalTests;
  exports.extensionTests = extensionTests;

}());

