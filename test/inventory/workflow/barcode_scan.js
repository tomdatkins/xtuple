/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, setTimeout:true, XM:true, require:true, assert:true,
before:true, exports:true, it:true, describe:true, XG:true */

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
      var postbooks;

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

      it("barcode-scans an item UPC code", utils.getBarcodeScanAction(null, "1234-4567"));

      it("commits the quantity to be issued", function (done) {
        var workspaceContainer = XT.app.$.postbooks.getActive();
        workspaceContainer.$.workspace.value.set({toIssue: 99});
        workspaceContainer.saveAndClose({force: true});
        // ugly: blow through error message
        XT.app.$.postbooks.notifyTap({}, {originator: {name: "notifyYes"}});
        XT.app.$.postbooks.getActive().$.list.value.on("status:READY_CLEAN", function () {
          done();
        });
      });

      it.skip("returns the line (all quantity)", function (done) {
        var list = XT.app.$.postbooks.getActive().$.list,
          model = list.value.models[0],
          atShipping = model.get("atShipping");

        console.log(list);
        console.log(list.value);
        console.log(atShipping);
        
        // XXX- Fragile, what if there are more than one, I should be selecting the same model that was issued via the barcode
        list.select(0);

        if (atShipping) {
          list.returnItem();
          console.log(atShipping);

          list.select(0);
          model.canIssueLine(function (ret) {
            assert.equal(ret, true);
          });

          console.log(atShipping);
          list.issueLine();
          console.log(atShipping);
          list.select(0);
          model.canIssueLine(function (ret) {
            assert.equal(ret, false);
          });
        }

        done();
      });

      it.skip("ships the shipment", function (done) {
        // TODO: ship
      });

      it("backs out of the transaction list", utils.getBackoutAction());
    });
  });
}());
