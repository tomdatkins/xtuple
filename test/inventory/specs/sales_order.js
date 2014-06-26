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
    @description after saving, should not be able to Open and have edit privs in Item Site Workspace
      > The sales order has a line item.
      > The first line's item site is 'opened'.
      > Verify that the notes attribute in the workspace is readOnly.
  */
  spec.afterSaveUIActions.push(
    {it: 'after saving, should not be able to Open and have edit privs in Item Site Workspace',
        action: function (workspace, done) {
      var gridBox = workspace.$.salesOrderLineItemBox,
        gridRow = gridBox.$.editableGridRow,
        originator = {},
        statusReadyClean,
        workspaceContainer;

      originator.name = "openItem";
      gridRow.$.itemSiteWidget.$.privateItemSiteWidget.menuItemSelected(null, {originator: originator});
      /** XXX totype what event can be used here instead? Tried a callback in menuItemSelected and passing it on
        in PrivateItemSiteWidget's l154doWorkspace in the Private Item Site Widget.
      */
      setTimeout(function () {
        workspaceContainer = XT.app.$.postbooks.getActive();
        assert.equal(workspaceContainer.$.workspace.kind, "XV.ItemSiteWorkspace");
        // "If notes are read only, assume that all the attributes are readOnly"... Lazy
        assert.isTrue(workspaceContainer.$.workspace.value.isReadOnly("notes"));
        // XXX  again, need an event
        setTimeout(function () {
          workspaceContainer.doPrevious();
          assert.equal(XT.app.$.postbooks.getActive().$.workspace.kind, "XV.SalesOrderWorkspace");
          // Update the notes field to leave the model READY_DIRTY
          XT.app.$.postbooks.getActive().$.workspace.value.set("orderNotes", "test");
          done();
        }, 2000);
      }, 3000);
    }});


  exports.spec = spec;
  exports.additionalTests = coreFile.additionalTests;
  //exports.extensionTests = extensionTests;

}());

