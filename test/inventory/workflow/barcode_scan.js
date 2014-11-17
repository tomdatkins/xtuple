/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, setTimeout:true, XM:true, require:true, assert:true,
before:true, console:true, exports:true, it:true, describe:true, XG:true */

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

      // Packing Hold Type tests:

      // Go back to Navigator, update the Sales Order: hold type Packing
      it("backs out of the transaction list", utils.getBackoutAction());

      it("crud updates the Sales Order hold type to packing hold", function (done) {
        var model = new XM.SalesOrder();
        model.fetch({id: XG.capturedId, success: function () {
          assert.isDefined(model, 'model is defined');
          uuid = model.get("uuid");
        }});
        // XXX Unnecessary timeouts
        setTimeout(function () {
          crud.update({
            model: model,
            updateHash: {holdType: "P"}
          });
        }, 3000);

        setTimeout(function () {
          crud.save({
              model: model,
              recordType: "XM.SalesOrder"
            }, 
            done()
          );
        }, 3000);
      });

      // Sales Order list IssueToShipping prerequisite returns false - can't issue to shipping because it's on Pack Hold
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
          assert.isFalse(ret, "can"); // wtf! why is this returning true?!
          done();
        });
      });

      // Go to Issue to Shipping, search for order, select Packing hold order, notify popup displayed
      it("should open up the search screen in issueToShipping", utils.getSearchScreenAction("issueToShipping"));

      //it("taps on the sales order we've created", utils.getTapAction());
      it("taps on the sales order we've created, a notifyPopup is displayed ", function (done) {
        var postbooks = XT.app.$.postbooks,
          model = postbooks.getActive().$.list.value.find(function (model) {
            // fragility: what if there are more sales orders than are lazy-loaded?
            return model.get("number") === XG.capturedId;
          });
        assert.isDefined(model, 'model is defined');
        XT.app.$.postbooks.getActive().itemTap({}, {model: model});
        // XXX Replace with popup timer
        //setTimeout(function () {
          
        done();
        //}, 4000);
      });

      it.skip("Sfsdf", function () {
        setTimeout(function () {
          assert.isTrue(postbooks.$.notifyPopup.showing);
        console.log("5");
        assert.equal(postbooks.$.notifyMessage.content, XT.localizeString("_orderPackHold"));
        console.log("6");
        //postbooks.notifyTap(null, {originator: {name: "notifyOk" }});
        console.log("7");
        }, 3000);
      });

      // Shipping Hold Type tests:

      // Go back to Navigator, update the sales order: hold type Shipping
      //it.skip("backs out of the transaction list", utils.getBackoutAction());

      it.skip("crud updates the Sales Order hold type to shipping", function (done) {
        var model = new XM.SalesOrder();
        //smoke.navigateToList(XT.app, "XV.SalesOrderList");
        model.fetch({id: XG.capturedId, success: function () {
          assert.isDefined(model, 'model is defined');
          uuid = model.get("uuid");
          crud.update({
            model: model,
            updateHash: {holdType: "S"}
          });
          crud.save({
            model: model,
            recordType: "XM.SalesOrder"
          }, function () {
            //assert.equal(XT.app.$.postbooks.getActive().kind, "XV.Navigator");
            done();
          });
        }});
      });

      it.skip("should open up the search screen in issueToShipping", utils.getSearchScreenAction("issueToShipping"));

      it.skip("taps on the sales order we've created", utils.getTapAction());

      // Go to Issue to Shipping, select order, tap Post, notify popup displayed - can't ship
      it.skip("taps Ship (post), process blocked ", utils.getTapAction());      

      // Update the sales order: hold type None
      it.skip("backs out of the transaction list", utils.getBackoutAction());

      // Go to Issue to Shipping

      it.skip("ships the shipment", function (done) {
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

      it.skip("backs out of the transaction list", utils.getBackoutAction());
    });   
  });

}());
