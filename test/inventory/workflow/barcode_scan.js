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
      var postbooks,
        model,
        uuid;

      this.timeout(40 * 1000);
      crud.runAllCrud(salesOrder.spec); // TODO: unknown why this is necessary
      salesOrder.spec.captureObject = true;
      smoke.runUICrud(salesOrder.spec);

      it("should open up the search screen in issueToShipping", utils.getSearchScreenAction("issueToShipping"));

      it("taps on the sales order we've created", utils.getTapAction());

      it("can open the order from the order widget", function (done) {
        var orderWidget = XT.app.$.postbooks.$.issueToShipping.$.parameterWidget.$.order.$.input;
        assert.equal(orderWidget.$.openItem.disabled, false);
        done();
      });

      it("barcode-scans an item UPC code", utils.getBarcodeScanAction());

      it("commits the quantity to be issued", function (done) {
        var workspaceContainer = XT.app.$.postbooks.getActive();
        workspaceContainer.$.workspace.value.set({toIssue: 99});
        workspaceContainer.saveAndClose({force: true});
        // ugly: blow through error message
        XT.app.$.postbooks.notifyTap({}, {originator: {name: "notifyYes"}});
        XT.app.$.postbooks.getActive().$.list.value.once("status:READY_CLEAN", function () {
          done();
        });
      });

      it("is not able to issue (all/line) for qty > balance", function (done) {
        var list = XT.app.$.postbooks.getActive().$.list, btruck = utils.getBtruckUpc(),
          model = _.find(list.value.models, function (model) {
            // XXX = barcode should be a var. Update workflow_util.js as needed
            return model.getValue("itemSite.item.barcode") === btruck;
          }),
          modelIndex, ordered;

        assert.isNotNull(model);
        modelIndex = list.indexInContainer(model);
        ordered = model.get("ordered");
        assert.operator(model.get("atShipping"), '>', 0);
        list.select(modelIndex);

        // Return the full qty of the line that was previously issued with the barcode.
        list.returnItem();
        // XXX - get this working with events.
        setTimeout(function () {
          // make sure the full qty was returned and that the model's canIssueLine returns true
          assert.equal(model.get("atShipping"), 0);
          list.select(modelIndex);
          model.canIssueLine(function (ret) {
            assert.equal(ret, true);
          });

          // issue line and verify, then verify that the model's canIssueLine returns false
          list.transactLine();
          setTimeout(function () {
            assert.equal(model.get("atShipping"), ordered);
            list.select(modelIndex);
            model.canIssueLine(function (ret) {
              assert.equal(ret, false);
            });
            // should not be able to issue all
            if (list.value.length === 1) {
              assert.isFalse(XT.app.$.postbooks.getActive().canIssueAll());
            }
            done();
          }, 4000);
        }, 4000);
      });

      // Packing Hold Type tests: XXX - skipping all because of locking issues updating model

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

      it("ships the shipment", function (done) {
        var workspaceContainer = XT.app.$.postbooks.getActive();
        assert.isFalse(workspaceContainer.$.postButton.disabled);
        // Ship (go to Ship Shipment Workspace)
        workspaceContainer.post();

        var workspace = XT.app.$.postbooks.getActive().$.workspace,
          model = workspace.value,
          shipmentId = model.get(model.idAttribute),
          workspaceReady = function () {
            assert.isTrue(workspace.$.lineItems.value.models.length > 0);
            assert.isTrue(model.isReady());
            var shipped = function () {
              workspace.doPrevious();
              assert.equal(XT.app.$.postbooks.getActive().kind, "XV.IssueToShipping");
              assert.isNull(XT.app.$.postbooks.getActive().$.parameterWidget.$.order.value);
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
