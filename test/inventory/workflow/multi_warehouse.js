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
    var siteModel;

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(function () {
        siteModel = new XM.SiteRelation();
        siteModel.fetch({code: "WH2", success: function () {
          done();
        }});
      });
    });

    describe('Sales order entry with multi-warehouse', function () {
      var postbooks;

      this.timeout(40 * 1000);
      crud.runAllCrud(salesOrder.spec); // TODO: unknown why this is necessary
      salesOrder.spec.beforeSaveUIActions.unshift({
        it: "can use a non-default warehouse",
        action: function (workspace, done) {
          assert.equal(workspace.value.get("site").id, "WH1");
          workspace.value.set("site", siteModel);
          assert.equal(workspace.value.get("site").id, "WH2");
          done();
        }
      });
      smoke.runUICrud(salesOrder.spec);

    });
  });
}());

