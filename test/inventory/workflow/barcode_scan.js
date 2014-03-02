(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    crud = require("../../../../xtuple/test/lib/crud"),
    smoke = require("../../../../xtuple/test/lib/smoke"),
    salesOrder = require("../../../../xtuple/test/specs/sales_order"),
    zombieAuth = require("../../../../xtuple/test/lib/zombie_auth");

  describe('Inventory workflow', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('Issue to shipping with barcode scanner', function () {
      var navigator,
        postbooks,
        orderWidget;

      this.timeout(40 * 1000);
      crud.runAllCrud(salesOrder.spec); // TODO: unknown why this is necessary
      salesOrder.spec.captureObject = true;
      smoke.runUICrud(salesOrder.spec);

      it("should open up the search screen in issueToShipping", function (done) {
        navigator = smoke.navigateToList(XT.app, "XV.TransferOrderList");
        postbooks = XT.app.$.postbooks;

        navigator.actionSelected(navigator.$.menuDecorator, {originator: {action: {method: "issueToShipping"}}});
        orderWidget = postbooks.$.issueToShipping.$.parameterWidget.$.order.$.input;
        orderWidget.menuItemSelected({}, {originator: orderWidget.$.searchItem});
        postbooks.getActive().$.list.value.once("status:READY_CLEAN", function () {
          done();
        });
      });

      it("taps on the sales order we've created", function (done) {
        var model = postbooks.getActive().$.list.value.find(function (model) {
          // fragility: what if there are more sales orders than are lazy-loaded?
          return model.get("number") === XG.capturedId;
        });
        assert.isObject(model);

        postbooks.getActive().itemTap({}, {model: model});
        postbooks.getActive().$.list.value.once("status:READY_CLEAN", function () {
          done();
        });
      });

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
    });
  });
}());
