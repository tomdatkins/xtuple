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
      this.timeout(40 * 1000);
      crud.runAllCrud(salesOrder.spec); // TODO: unknown why this is necessary
      salesOrder.spec.skipSmokeDelete = true;
      smoke.runUICrud(salesOrder.spec);
      it('should issue that sales order to shipping', function (done) {
        var navigator = smoke.navigateToList(XT.app, "XV.TransferOrderList"),
          postbooks = XT.app.$.postbooks,
          orderWidget;
        navigator.actionSelected(navigator.$.menuDecorator, {originator: {action: {method: "issueToShipping"}}});
        orderWidget = postbooks.$.issueToShipping.$.parameterWidget.$.order.$.input;
        orderWidget.menuItemSelected({}, {originator: orderWidget.$.searchItem});
        setTimeout(function () {
          // TODO: get rid of the setTimeouts
          var collection = postbooks.getActive().$.list.value,
            // Fragile assumption. Better if we knew the # of the order we just set up
            model = collection.at(0);

          postbooks.getActive().itemTap({}, {model: model});
          setTimeout(function () {
            var transactionList = postbooks.getActive().$.list;
            assert.equal(transactionList.value.length, 1);
            transactionList.captureBarcode({}, {data: "1234-4567"});
            setTimeout(function () {
              var workspaceContainer = postbooks.getActive();
              workspaceContainer.$.workspace.value.set({toIssue: 99});
              workspaceContainer.saveAndClose({force: true});
              // ugly: blow through error message
              XT.app.$.postbooks.notifyTap({}, {originator: {name: "notifyYes"}});
              // TODO: ship
              setTimeout(function () {
                assert.equal(postbooks.getActive().kind, "XV.IssueToShipping");
                postbooks.goToNavigator();
                assert.equal(postbooks.getActive().kind, "XV.Navigator");
                done();
              }, 2000);
            }, 2000);
          }, 2000);
        }, 2000);
      });

    });
  });
}());
