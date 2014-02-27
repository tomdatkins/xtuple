/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, XG:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    crud = require("../../../../xtuple/test/lib/crud"),
    smoke = require("../../../../xtuple/test/lib/smoke"),
    purchaseOrder = require("../../../../xtuple/test/specs/purchase_order"),
    zombieAuth = require("../../../../xtuple/test/lib/zombie_auth"),
    utils = require("../workflow_utils");

  describe('Inventory workflow', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('Enter receipt with barcode scanner', function () {
      var navigator,
        postbooks,
        orderWidget;

      this.timeout(40 * 1000);
      crud.runAllCrud(purchaseOrder.spec); // TODO: unknown why this is necessary
      purchaseOrder.spec.captureObject = true;
      smoke.runUICrud(purchaseOrder.spec);

      it("should release the purchase order", function (done) {
        // TODO
        var navigator = smoke.navigateToList(XT.app, "XV.PurchaseOrderList"),
          model = navigator.$.contentPanels.$.purchaseOrderList.value.find(function (model) {
            return model.id === XG.capturedId;
          });

        model.doRelease();
        setTimeout(function () {
          done();
        }, 3000);
      });

      it("should open up the search screen in enterReceipt", utils.getSearchScreenAction("enterReceipt"));

      it("taps on the purchase order we've created", utils.getTapAction());

/*
      it("barcode-scans an item UPC code", function (done) {
        var transactionList = postbooks.getActive().$.list;
        transactionList.captureBarcode({}, {data: "1234-4567"});
        //postbooks.getActive().$.workspace.value.on("all", function () {
        //  console.log(arguments);
        //});
        // TODO: get rid of this setTimeout
        setTimeout(function () {
          done();
        }, 2000);
      });

      it("commits the quantity to be issued", function (done) {
        var workspaceContainer = postbooks.getActive();
        workspaceContainer.$.workspace.value.set({toIssue: 99});
        workspaceContainer.saveAndClose({force: true});
        // ugly: blow through error message
        XT.app.$.postbooks.notifyTap({}, {originator: {name: "notifyYes"}});
        postbooks.getActive().$.list.value.on("status:READY_CLEAN", function () {
          done();
        });
      });

      it.skip("ships the shipment", function (done) {
        // TODO: ship
      });

      it("backs out of the transaction list", function () {
        assert.equal(postbooks.getActive().kind, "XV.IssueToShipping");
        postbooks.goToNavigator();
        assert.equal(postbooks.getActive().kind, "XV.Navigator");
      });
    */
    });
  });
}());

