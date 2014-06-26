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
    @memberof SalesOrder
    @description Changing the Schedule Date updates the line item's schedule date
      > Update the schedule date to the first day of the week
      > Handle both popups - Yes, update line items. No, don't select next working day.
      > Verify that the first line item has it's schedule date updated.
  */
  spec.beforeSaveUIActions.push(
    {it: "changing the Schedule Date updates the line item\'s schedule date",
        action: function (workspace, done) {
        // Skip if site cal not enabled... 
        // TODO  temporary until second notifyPopup (_nextWorkingDate) is handled properly in test
        if (!(XT.session.settings.get("UseSiteCalendar"))) {return done(); }
        var getDowDate = function (dow) {
          var date = new Date(),
            currentDow = date.getDay(),
            distance = dow - currentDow;
          date.setDate(date.getDate() + distance);
          return date;
        },
        newScheduleDate = getDowDate(0), // Sunday from current week
        handlePopup = function () {
          assert.equal(workspace.value.get("scheduleDate"), newScheduleDate);
          // Confirm to update all line items
          XT.app.$.postbooks.notifyTap(null, {originator: {name: "notifyYes"}});
          // And verify that they were all updated with the new date
          setTimeout(function () {
            _.each(workspace.value.get("lineItems").models, function (model) {
              assert.equal(model.get("scheduleDate"), newScheduleDate);
            });
            done();
          }, 3000);
        };
 
        workspace.value.once("change:scheduleDate", handlePopup);
        workspace.value.set("scheduleDate", newScheduleDate);
      }}
    );

  exports.spec = spec;
  exports.additionalTests = coreFile.additionalTests;
  //exports.extensionTests = extensionTests;

}());

