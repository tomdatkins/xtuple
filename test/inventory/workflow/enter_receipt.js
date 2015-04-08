/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true, clearInterval:true,
setTimeout:true, before:true, XG:true, exports:true, it:true, describe:true, beforeEach:true, setInterval:true */

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

    // TODO: these could use some asserts
    describe('Enter receipt with barcode scanner', function () {
      var navigator,
        moduleContainer,
        orderWidget,
        workspace,
        transactionList,
        btruck,
        model,
        modelIndex;

      this.timeout(60 * 1000);
      crud.runAllCrud(purchaseOrder.spec); // TODO: unknown why this is necessary
      purchaseOrder.spec.captureObject = true;
      smoke.runUICrud(purchaseOrder.spec);

      it("should release the purchase order", function (done) {
        var navigator = smoke.navigateToList(XT.app, "XV.PurchaseOrderList"),
          model = navigator.$.contentPanels.$.purchaseOrderList.value.find(function (model) {
            return model.id === XG.capturedId;
          });

        moduleContainer = XT.app.$.postbooks;
        model.doRelease();
        setTimeout(function () {
          done();
        }, 3000);
      });

      it("should open up the search screen in enterReceipt", utils.getSearchScreenAction("enterReceipt"));

      it("taps on the purchase order we've created", utils.getTapAction());

      it("XV.EnterReceiptList should be printable", function () {
        var actions = moduleContainer.getActive().$.list.actions;
        assert.include(_.pluck(actions, 'name'), 'print');
      });

      // TODO - handle this after metric added to toggle scanning functionality
      it.skip("barcode-scans an item UPC code", utils.getBarcodeScanAction());

      it('non controlled item transact qty on successful barcode scan', function (done) {
        transactionList = moduleContainer.getActive().$.list;
        btruck = utils.getBtruckUpc();
        model = _.find(transactionList.value.models, function (mod) {
          return mod.getValue("itemSite.item.barcode") === btruck;
        });
        modelIndex = transactionList.value.indexOf(model);

        assert.isDefined(model);
        assert.isDefined(modelIndex);
        transactionList.captureBarcode({}, {data: "BTRUCK1"});
        setTimeout(function () {
          assert.equal(model.getValue("atReceiving"), 1);
          // XXX - something funky happening here, balance is not updating.
          // model.on("status:READY_CLEAN", ... also returned non-update balance attribute.
          model.setValue("balance", 4);
          done();
        }, 3000);
      });

      it.skip('lot controlled item transact qty on successful barcode scans', function () {
        // TODO
      });

      it.skip('location controlled item transact qty on successful barcode scans', function () {
        // TODO
      });

      it.skip('lot + location controlled item transact qty on successful barcode scans', function () {
        // TODO
      });

      it("tap Receive Item", function () {
        transactionList.select(modelIndex);
        transactionList.transactItem();
        workspace = moduleContainer.getActive().$.workspace;
        model = workspace.value;
        assert.equal(workspace.kind, "XV.EnterReceiptWorkspace");
      });

      it("Enter Receipt workspace has a print label checkbox", function (done) {
        assert.isNotNull(workspace.$.printLabel);
        done();
      });

      it("commits the quantity to be received", function (done) {
        var notifyPopupInterval,
          balance = model.getValue("balance");
        model.setValue("toReceive", model.getValue("balance"));

        notifyPopupInterval = setInterval(function () {
          if (!moduleContainer.$.notifyPopup.showing) { return; }

          clearInterval(notifyPopupInterval);
          moduleContainer.notifyTap(null, { originator: { name: "notifyYes" }});
        }, 100);

        moduleContainer.getActive().saveAndClose({force: true});

        setTimeout(function () {
          transactionList = moduleContainer.getActive().$.list;
          assert.equal(transactionList, "XV.EnterReceiptList");
          done();
        }, 6000);
      });

      it("posts the receipt", function (done) {
        moduleContainer.getActive().post();
        // TODO: get rid of this setTimeout
        setTimeout(function () {
          done();
        }, 2000);
      });

      it("backs out of the transaction list", utils.getBackoutAction());
    });
  });
}());

