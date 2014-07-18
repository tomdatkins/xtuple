/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true,
require:true, assert:true, setTimeout:true, clearTimeout:true, exports:true,
it:true, describe:true, beforeEach:true, before:true, enyo:true */

(function () {
  "use strict";

  var coreFile = require("../../../../xtuple/test/specs/sales_order"),
    common = require("../../../../xtuple/test/lib/common"),
    _ = require("underscore"),
    async = require("async"),
    assert = require("chai").assert,
    spec = coreFile.spec;
      
  if (!spec.afterSaveUIActions) {
    spec.afterSaveUIActions = [];
  }
  /**
    @member -
    @memberof SalesOrderLine
    @description Supply list should have action to open Item Workbench
      > The sales order has a line item.
      > The first line item is selected and the supply list button is tapped.
      > The first line item has the openItemWorkbench action.
      > Select open, the ItemWorkbenchWorkspace should be 'read only'.
  */
  spec.afterSaveUIActions.push(
    {it: "Supply list should have action to open Item Workbench",
        action: function (workspace, done) {
      var gridBox = workspace.$.salesOrderLineItemBox,
        gridRow = gridBox.$.editableGridRow,
        verify,
        action,
        prereq;

      assert.notEqual(workspace.value.status, XM.Model.READY_NEW);
      gridBox.$.supplyButton.bubble("ontap");
      gridBox.$.supplyList.select(0);
      action = _.find(gridBox.$.supplyList.actions, function (action) {
        return action.name === "openItemWorkbench";
      });
      assert.isNotNull(action.prerequisite);

      gridBox.$.supplyList.value.models[0][action.prerequisite](function (hasPriv) {
        assert.isTrue(hasPriv);
        if (hasPriv) {
          gridBox.$.supplyList.actionSelected(null, {action: {method: "openItemWorkbench"}, index: 0});

          setTimeout(function () {
            assert.equal(XT.app.$.postbooks.getActive().$.workspace.kind, "XV.ItemWorkbenchWorkspace");
            XT.app.$.postbooks.getActive().doPrevious();
            assert.equal(XT.app.$.postbooks.getActive().$.workspace.kind, "XV.SalesOrderWorkspace");
            done();
          }, 3000);
        } else {done(); }
      });
    }}
  );

  exports.spec = spec;
  exports.additionalTests = coreFile.additionalTests;
  //exports.extensionTests = extensionTests;

}());

