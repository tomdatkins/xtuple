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
    captureObject: true,
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
        workspace.$.Label.setValue(XG.capturedId);
        workspace.parent.parent.saveAndClose();
        done();
      });
    });

    describe("Navigate to Invoice list and print", function () {
      var invoice = require("./invoice");
      this.timeout(20 * 1000);
      invoice.spec.skipDelete = true;
      crud.runAllCrud(invoice.spec);
      it("Navigate to Billing > Invoice list and print", function (done) {
        var navigator = smoke.navigateToList(XT.app, "XV.InvoiceList"),
          list = navigator.$.contentPanels.getActive(),
          printOptions = {},
          model;
        assert.equal(list.kind, "XV.InvoiceList");
        setTimeout(function () {
          assert.isTrue(list.value.models.length > 0);
          printOptions.model = list.value.models[0];
          printOptions.callback = function (printResp) {
            assert.isTrue(printResp);
            done();
          };
          list.doPrint(printOptions);
        }, 2000);
      });
    });
  };

  exports.additionalTests = additionalTests;
  exports.spec = spec;

}());
