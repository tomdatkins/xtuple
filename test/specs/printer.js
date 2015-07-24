/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, XG:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var assert = require("chai").assert,
    _ = require("underscore"),
    crud = require("../lib/crud"),
    smoke = require("../lib/smoke");

  /**
    @class
    @alias Printer
  */
  var spec = {
    recordType: "XM.Printer",
    collectionType: "XM.PrinterCollection",
    /**
      @member -
      @memberof Printer.prototype
      @description The Printer collection is cached.
    */
    cacheName: "XM.printers",
    listKind: "XV.PrinterList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Printer.prototype
      @description Printers are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Printer.prototype
      @description The ID attribute is "name", which will not be automatically uppercased.
    */
    idAttribute: "name",
    enforceUpperKey: false,
    attributes: ["name", "description"],
    extensions: [],
    /**
      @member -
      @memberof Printer.prototype
      @description Printers can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainPrinters" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainPrinters",
      read: true
    },
    createHash: {
      name: "TestPrinter" + Math.random(),
      description: "TestPrinterDescription" + Math.random(),
    },
    //skipDelete: true,
    //captureObject: true,
    updatableField: "description"
  };

  var additionalTests = function () {
    /**
      @member Settings
      @memberof Invoice
      @description There is a setting "Valid Credit Card Days"
      @default 7
    */
    describe("User Preference Workspace tests", function () {
      this.timeout(10000);
      var workspace;
      it("User navigates to User Preference workspace", function (done) {
        XT.app.$.postbooks.$.navigator.openPreferencesWorkspace();
        workspace = XT.app.$.postbooks.getActive().$.workspace;
        assert.equal(workspace.kind, "XV.UserPreferenceWorkspace");
        done();
      });
      it("User Preference workspace contains Form and Label PrintPicker widgets" +
        "'Browser', for each of the print settings 'attributes'", function (done) {
        assert.include(workspace.$, "Form");
        assert.include(workspace.$, "Label");
        done();
      });
      it("Set 'Form' to 'Browser', set 'Label' to newly created TestPrinter and save", function (done) {
        workspace.$.Form.setValue("Browser");
        //workspace.$.Label.setValue(XG.capturedId);
        workspace.parent.parent.saveAndClose({force: true});
        done();
      });
    });

    /**
      Test all print actions in xtuple repo. These DO NOT test the success of generate-report rte.
      The success returns before calling the route via a new tab.:
      - InvoiceList; print
      - PurchaseOrderList; print
      - ReturnList; print
      - SalesOrderList; printForm
      TODO:
      - Sales module; printForm
      - InvoiceWorkspace; print
      - SalesOrderWorkspace; printOnSaveSetting: DefaultPrintSOOnSave
      - PurchasingWorkspace; printOnSaveSetting: DefaultPrintPOOnSave //???
      - PurchaseOrderWorkspace; printOnSaveSetting: DefaultPrintPOOnSave
      - ReceivablesWorkspace; printOnSave
    */

    describe("Invoice print tests", function () {
      var invoice = require("./invoice");
      this.timeout(20 * 1000);
      invoice.spec.skipDelete = true;
      crud.runAllCrud(invoice.spec);
      it("Navigate to Billing > Invoice list and print", function (done) {
        var navigator = smoke.navigateToList(XT.app, "XV.InvoiceList"),
          list = navigator.$.contentPanels.getActive(),
          modelIndex = 0,
          model,
          printAction = _.find(list.actions, function (action) {
            return action.name === "print";
          });
        assert.equal(list.kind, "XV.InvoiceList");
        assert.isDefined(printAction);
        setTimeout(function () {
          // The first invoice in a fresh db has bad data
          assert.isTrue(list.value.models.length > 1);
          model = list.value.models[modelIndex];
          list.select(modelIndex);
          list.actionSelected(list, {
            action: printAction,
            index: modelIndex,
            model: model,
            // callback received BEFORE generate-report route called via newTab
            callback: function (resp) {
              assert.isTrue(resp);
              done();
            }
          });
        }, 2000);
      });
    });

    describe("Purchase Order print tests", function () {
      var purchaseOrder = require("./purchase_order");
      this.timeout(20 * 1000);
      purchaseOrder.spec.skipDelete = true;
      crud.runAllCrud(purchaseOrder.spec);
      it("Navigate to Purchasing > Purchase Order list and print", function (done) {
        var navigator = smoke.navigateToList(XT.app, "XV.PurchaseOrderList"),
          list = navigator.$.contentPanels.getActive(),
          modelIndex = 0,
          model,
          printAction = _.find(list.actions, function (action) {
            return action.name === "print";
          });
        assert.equal(list.kind, "XV.PurchaseOrderList");
        assert.isDefined(printAction);
        setTimeout(function () {
          assert.isTrue(list.value.models.length > 0);
          model = list.value.models[modelIndex];
          list.select(modelIndex);
          list.actionSelected(list, {
            action: printAction,
            index: modelIndex,
            model: model,
            // callback received BEFORE generate-report route called via newTab
            callback: function (resp) {
              assert.isTrue(resp);
              done();
            }
          });
        }, 2000);
      });
    });

    describe("Return print tests", function () {
      var returnSpec = require("./return");
      this.timeout(20 * 1000);
      returnSpec.spec.skipDelete = true;
      crud.runAllCrud(returnSpec.spec);
      it("Navigate to Billing > Return list and print", function (done) {
        var navigator = smoke.navigateToList(XT.app, "XV.ReturnList"),
          list = navigator.$.contentPanels.getActive(),
          modelIndex = 0,
          model,
          printAction = _.find(list.actions, function (action) {
            return action.name === "print";
          });
        assert.equal(list.kind, "XV.ReturnList");
        assert.isDefined(printAction);
        setTimeout(function () {
          assert.isTrue(list.value.models.length > 0);
          model = list.value.models[modelIndex];
          list.select(modelIndex);
          list.actionSelected(list, {
            action: printAction,
            index: modelIndex,
            model: model,
            // callback received BEFORE generate-report route called via newTab
            callback: function (resp) {
              assert.isTrue(resp);
              done();
            }
          });
        }, 2000);
      });
    });
      
    describe("Sales Order print tests", function () {
      var salesOrder = require("./sales_order");
      this.timeout(30 * 1000);
      salesOrder.spec.skipDelete = true;
      crud.runAllCrud(salesOrder.spec);
      it("Navigate to Sales > Sales Order list, Print Sales Order Form", function (done) {
        var navigator = smoke.navigateToList(XT.app, "XV.SalesOrderList"),
          list = navigator.$.contentPanels.getActive(),
          modelIndex = 0,
          model,
          printFormAction = _.find(list.actions, function (action) {
            return action.name === "printForm";
          });

        assert.equal(list.kind, "XV.SalesOrderList");
        assert.isDefined(printFormAction);
        setTimeout(function () {
          assert.isTrue(list.value.models.length > 0);
          model = list.value.models[modelIndex];
          list.select(modelIndex);
          list.actionSelected(list, {
            action: printFormAction,
            index: modelIndex,
            model: model
          });

          setTimeout(function () {
            var workspace = XT.app.$.postbooks.getActive().$.workspace;
            assert.equal(workspace.kind, "XV.PrintSalesOrderFormWorkspace");
            assert.equal(workspace.$.salesOrderWidget.value.id, model.id);
            var formPickerColl = workspace.$.formPicker.filteredList();
            assert.isTrue(formPickerColl.length >= 1);
            workspace.$.formPicker.setValue(formPickerColl[0]);
            console.log("here1");
            assert.equal(workspace.value.getStatusString(), "READY_DIRTY");
            // set the meta attr in the model to avoid handling events
            //workspace.value.meta.set("printer", "Browser");
            console.log("here2");
            workspace.$.printer.setValue("Browser");
            assert.equal(workspace.value.getStatusString(), "READY_DIRTY");
            workspace.save({callback: function (resp) {
              // callback received BEFORE generate-report route called via newTab
              assert.isTrue(resp);
              done();
            }});
          }, 2000);
        }, 2000);
      });

      it("Navigate back to welcomePage", function (done) {
        XT.app.$.postbooks.getActive().$.workspace.doPrevious();
        var navigator = XT.app.$.postbooks.getActive();
        assert.equal(XT.app.$.postbooks.$.navigator.$.contentPanels.getActive().kind, "XV.SalesOrderList");
        
        //console.log("XT.app.$.postbooks.getActive().$.menuPanels.getIndex(): " + XT.app.$.postbooks.getActive().$.menuPanels.getIndex());
        //console.log("XT.app.$.postbooks.$.navigator.$.contentPanels.getActive().kind: " + XT.app.$.postbooks.$.navigator.$.contentPanels.getActive().kind);
        //done();
        XT.app.$.postbooks.getActive().backTapped({callback: function (resp) {
          console.log("backTapped callback");
          if (resp) {
            console.log("backTapped callback resp: " + resp);
            assert.equal(XT.app.$.postbooks.getActive().$.menuPanels.getIndex(), 0);
            done();
          }
        }});
        /*XT.app.$.postbooks.getActive().backTapped();
        console.log("here6");
        //setTimeout(function () {
          console.log(XT.app.$.postbooks.$.navigator.$.contentPanels.getActive().name);
          XT.app.$.postbooks.getActive().backTapped();
          assert.equal(XT.app.$.postbooks.$.navigator.$.contentPanels.getActive().name, "welcomePage");
          console.log("here8");
          done();
        //}, 2000); */
      });
    });
  };

  exports.additionalTests = additionalTests;
  exports.spec = spec;

}());
