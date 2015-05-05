/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, setTimeout:true, XM:true, require:true, assert:true, clearInterval:true,
before:true, console:true, exports:true, it:true, describe:true, XG:true, setInterval:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    crud = require("../../../../xtuple/test/lib/crud"),
    smoke = require("../../../../xtuple/test/lib/smoke"),
    salesOrder = require("../../../../xtuple/test/specs/sales_order"),
    zombieAuth = require("../../../../xtuple/test/lib/zombie_auth"),
    utils = require("../workflow_utils");


  describe('Inventory workflow', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('Issue to shipping with barcode scanner', function () {
      var moduleContainer,
        workspace,
        transactionList,
        btruck,
        model,
        modelIndex;

      this.timeout(60 * 1000);
      crud.runAllCrud(salesOrder.spec); // TODO: unknown why this is necessary
      salesOrder.spec.captureObject = true;
      smoke.runUICrud(salesOrder.spec);

      it("should open up the search screen in issueToShipping", utils.getSearchScreenAction("issueToShipping"));

      it("taps on the sales order we've created", utils.getTapAction());

      it("can open the order from the order widget", function (done) {
        moduleContainer = XT.app.$.postbooks;
        var orderWidget = moduleContainer.$.issueToShipping.$.parameterWidget.$.order.$.input;
        assert.equal(orderWidget.$.openItem.disabled, false);
        done();
      });

      it.skip("Issue To Shipping transaction list items have print label action ", function () {
        // TODO
      });

      // TODO - handle this after metric added to toggle scanning functionality
      it.skip("barcode-scans an item UPC code", utils.getBarcodeScanAction());

      it('non controlled item issue qty on successful barcode scan', function (done) {
        transactionList = moduleContainer.getActive().$.list;
        btruck = utils.getBtruckUpc();
        model = _.find(transactionList.value.models, function (mod) {
          return mod.getValue("itemSite.item.barcode") === btruck;
        });
        modelIndex = transactionList.value.indexOf(model);

        assert.isDefined(model);
        assert.isDefined(modelIndex);
        transactionList.captureBarcode({}, {data: btruck});
        // TODO: get rid of this setTimeout
        setTimeout(function () {
          assert.equal(model.getValue("atShipping"), 1);
          done();
        }, 4000);
      });

      it("tap issue item", function () {
        transactionList.select(modelIndex);
        transactionList.transactItem();
        workspace = moduleContainer.getActive().$.workspace;
        model = workspace.value;
        assert.equal(workspace.kind, "XV.IssueStockWorkspace");
      });

      it("Issue Stock workspace has a print label checkbox", function (done) {
        assert.isNotNull(workspace.$.printIssueToShippingLabel);
        done();
      });

      it("commits the quantity to be issued", function (done) {
        var notifyPopupInterval,
          balance = model.getValue("balance");
        model.setValue("toIssue", model.getValue("balance"));

        notifyPopupInterval = setInterval(function () {
          if (!moduleContainer.$.notifyPopup.showing) { return; }

          clearInterval(notifyPopupInterval);
          moduleContainer.notifyTap(null, { originator: { name: "notifyYes" }});
        }, 100);

        moduleContainer.getActive().saveAndClose({force: true});

        setTimeout(function () {
          transactionList = moduleContainer.getActive().$.list;
          assert.equal(transactionList, "XV.IssueToShippingList");
          done();
        }, 5000);
      });

      it("is not able to issue (all/line) for qty > balance", function (done) {
        model = _.find(moduleContainer.getActive().$.list.value.models, function (model) {
          return model.getValue("itemSite.item.barcode") === btruck;
        });

        assert.isNotNull(model);
        modelIndex = moduleContainer.getActive().$.list.value.indexOf(model);
        assert.operator(model.get("atShipping"), '>', 0);
        moduleContainer.getActive().$.list.select(modelIndex);
        assert.equal(moduleContainer.getActive().$.list.selectedModels().length, 1);

        // Return the full qty of the line that was previously issued with the barcode.
        moduleContainer.getActive().$.list.returnItem();

        // XXX - get this working with events.
        setTimeout(function () {
          // make sure the full qty was returned and that the model's canIssueLine returns true
          assert.equal(model.get("atShipping"), 0);
          transactionList.select(modelIndex);
          model.canIssueLine(function (ret) {
            assert.equal(ret, true);
          });

          // issue line and verify, then verify that the model's canIssueLine returns false
          transactionList.transactLine();
          setTimeout(function () {
            assert.equal(model.get("atShipping"), model.get("ordered"));
            transactionList.select(modelIndex);
            model.canIssueLine(function (ret) {
              assert.equal(ret, false);
            });
            // should not be able to issue all
            if (transactionList.value.length === 1) {
              assert.isFalse(moduleContainer.getActive().canIssueAll());
            }
            done();
          }, 4000);
        }, 4000);
      });

      /** XXX - Packing Hold Type tests: skipping all because of locking issues updating model

      it.skip("backs out of the transaction list", utils.getBackoutAction());

      it.skip("crud updates the Sales Order hold type to packing hold", function (done) {
        var model = new XM.SalesOrder();
        model.fetch({id: XG.capturedId, success: function () {
          assert.isDefined(model, 'model is defined');
          assert.equal(model.status, XM.Model.READY_CLEAN);

          crud.update({
            model: model,
            updateHash: {holdType: XM.SalesOrder.PACKING_HOLD_TYPE}
          });

          crud.save({
              model: model,
              recordType: "XM.SalesOrder"
            },
            done,
            true
          );
        }});
      });

      it.skip("checks that the Issue to Shipping action's prerequisite returns false", function (done) {
        smoke.navigateToList(XT.app, "XV.SalesOrderList");
        var action,
          list = XT.app.$.postbooks.$.navigator.$.contentPanels.getActive(),
          model = list.value.find(function (model) {
            return model.get("number") === XG.capturedId;
          });

        action = _.find(list.actions, function (action) {
          return action.name === "issueToShipping";
        });

        model[action.prerequisite](function (ret) {
          assert.isFalse(ret, "can"); // XXX why is this returning true?!
          done();
        });
      });

      it.skip("should open up the search screen in issueToShipping", utils.getSearchScreenAction("issueToShipping"));

      it.skip("taps on the sales order we've created, a notifyPopup is displayed", function (done) {
        var postbooks = XT.app.$.postbooks,
          model = postbooks.getActive().$.list.value.find(function (model) {
            // fragility: what if there are more sales orders than are lazy-loaded?
            return model.get("number") === XG.capturedId;
          });
        assert.isDefined(model, 'model is defined');

        var notifyPopupInterval = setInterval(function () {
          if (!postbooks.$.notifyPopup.showing) { return; }
          clearInterval(notifyPopupInterval);
          assert.equal(postbooks.$.notifyMessage.content, XT.localizeString("_orderPackHold"));
          postbooks.notifyTap(null, {originator: {name: "notifyOk" }});
          done();
        }, 100);

        postbooks.getActive().itemTap({}, {model: model});
      });

      // Shipping Hold Type tests: XXX - skipping all because of locking issues updating model

      it.skip("crud updates the Sales Order hold type to SHIPPING hold", function (done) {
        var model = new XM.SalesOrder();
        model.fetch({id: XG.capturedId, success: function () {
          assert.isDefined(model, 'model is defined');
          assert.equal(model.status, XM.Model.READY_CLEAN);

          crud.update({
            model: model,
            updateHash: {holdType: XM.SalesOrder.SHIPPING_HOLD_TYPE}
          });

          crud.save({
              model: model,
              recordType: "XM.SalesOrder"
            },
            done,
            true
          );
        }});
      });

      it.skip("taps on the sales order we've created", utils.getTapAction());

      it.skip("taps Ship (post), process blocked, popup displayed", function () {
        // TODO
      });

      */

      it("ships the shipment", function (done) {
        var workspaceContainer = moduleContainer.getActive();
        assert.isFalse(workspaceContainer.$.postButton.disabled);
        // Ship (go to Ship Shipment Workspace)
        workspaceContainer.post();

        var workspace = moduleContainer.getActive().$.workspace,
          model = workspace.value,
          shipmentId = model.get(model.idAttribute),
          workspaceReady = function () {
            assert.isTrue(workspace.$.lineItems.value.models.length > 0);
            assert.isTrue(model.isReady());
            var shipped = function () {
              workspace.doPrevious();
              assert.equal(moduleContainer.getActive().kind, "XV.IssueToShipping");
              assert.isNull(moduleContainer.getActive().$.parameterWidget.$.order.value);
              // Make sure it shipped in the database
              model = new XM.ShipShipment();
              model.fetch({id: shipmentId, success: function () {
                assert.isTrue(model.get("isShipped"));
              }});
              done();
            };
            // Ship Shipment
            model.save(null, {success: shipped});
          };
        assert.equal(workspace.kind, "XV.ShipShipmentWorkspace");
        model.once("status:READY_DIRTY", workspaceReady);
      });

      it("backs out of the transaction list", utils.getBackoutAction());
    });
  });

}());
