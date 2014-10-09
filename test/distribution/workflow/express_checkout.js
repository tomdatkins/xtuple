/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, setTimeout:true, XM:true, require:true, assert:true,
before:true, console:true, exports:true, it:true, describe:true, XG:true,
setTimeout:true, setInterval:true, clearInterval:true*/

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    crud = require("../../../../xtuple/test/lib/crud"),
    smoke = require("../../../../xtuple/test/lib/smoke"),
    salesOrder = require("../../../../xtuple/test/specs/sales_order"),
    zombieAuth = require("../../../../xtuple/test/lib/zombie_auth"),
    utils = require("../../inventory/workflow_utils");


  describe('Distribution workflow', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('Sales Order Express Checkout', function () {
      var postbooks,
        workspace,
        list;

      this.timeout(40 * 1000);
      crud.runAllCrud(salesOrder.spec); // TODO: unknown why this is necessary
      salesOrder.spec.captureObject = true;
      smoke.runUICrud(salesOrder.spec);

      it("Navigate to Sales Order list and open the order", function (done) {
        smoke.navigateToList(XT.app, "XV.SalesOrderList");
        postbooks = XT.app.$.postbooks;
        list = postbooks.$.navigator.$.contentPanels.getActive();
        var model = list.value.find(function (model) {
            // fragility: what if there are more sales orders than are lazy-loaded?
            return model.get("number") === XG.capturedId;
          }),
          originator = {};
        originator.isKey = false;
        // Open the order
        list.itemTap({}, {model: model, originator: originator});
        // Make sure we're in SO workspace and it's in READY state
        workspace = postbooks.getActive().$.workspace;
        assert.equal(workspace, "XV.SalesOrderWorkspace");
        assert.isTrue(workspace.value.isReady());
        done();
      });

      it("Express Checkout issues all line items to shipping, ships and creates invoice", function (done) {
        workspace.expressCheckout();
        // List is ready, order has been removed from list because it's been shipped and invoiced
        var statusReadyClean = function () {
          var model = list.value.find(function (model) {
            // fragility: what if there are more sales orders than are lazy-loaded?
            return model.get("number") === XG.capturedId;
          }) ? true : false;
          // model (sales order) shouldn't be in the list of orders
          assert.isFalse(model);
          done();
        };
        /**
          * Guard on notifyPopup; when the notifyPopup is showing, 'tap' the
          * popup's "OK" button - confirmation that the express checkout process completed.
          */
        var notifyPopupInterval = setInterval(function () {
          if (!postbooks.$.notifyPopup.showing) { return; }

          clearInterval(notifyPopupInterval);
          list.value.on("status:READY_CLEAN", statusReadyClean);
          postbooks.notifyTap(null, { originator: { name: "notifyYes" }});
        }, 100);
      });
    });
  });
}());
