/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, setTimeout:true, XM:true, require:true, assert:true,
before:true, exports:true, it:true, describe:true, XG:true */

(function () {
  "use strict";

  var smoke = require("../../../xtuple/test/lib/smoke");

  var getSearchScreenAction = function (transactionName) {
    return function (done) {
      var orderWidget,
        navigator = smoke.navigateToList(XT.app, "XV.TransferOrderList");

      navigator.actionSelected(navigator.$.menuDecorator, {originator: {action: {method: transactionName}}});
      orderWidget = XT.app.$.postbooks.$[transactionName].$.parameterWidget.$.order.$.input;
      orderWidget.menuItemSelected({}, {originator: orderWidget.$.searchItem});
      XT.app.$.postbooks.getActive().$.list.value.once("status:READY_CLEAN", function () {
        done();
      });
    };
  };

  var getTapAction = function (done) {
    return function (done) {
      var postbooks = XT.app.$.postbooks,
        model = postbooks.getActive().$.list.value.find(function (model) {
          // fragility: what if there are more sales orders than are lazy-loaded?
          return model.get("number") === XG.capturedId;
        });

      postbooks.getActive().itemTap({}, {model: model});
      postbooks.getActive().$.list.value.once("status:READY_CLEAN", function () {
        done();
      });
    };
  };

  var getBarcodeScanAction = function (done) {
    var btruck = this.getBtruckUpc();
    return function (done) {
      var postbooks = XT.app.$.postbooks,
        transactionList = postbooks.getActive().$.list;
      transactionList.captureBarcode({}, {data: btruck});
      // TODO: get rid of this setTimeout
      setTimeout(function () {
        done();
      }, 2000);
    };
  };

  var getBackoutAction = function () {
    return function () {
      XT.app.$.postbooks.goToNavigator();
    };
  };

  /*
    Returns the current demo barcode for the BTRUCK Item
  */
  var getBtruckUpc = function () {
    return "739048117066";
  };

  exports.getBtruckUpc = getBtruckUpc;
  exports.getSearchScreenAction = getSearchScreenAction;
  exports.getTapAction = getTapAction;
  exports.getBarcodeScanAction = getBarcodeScanAction;
  exports.getBackoutAction = getBackoutAction;

}());
