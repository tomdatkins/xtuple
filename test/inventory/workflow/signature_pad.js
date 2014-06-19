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

  // XXX zombie and the signature pad do not seem to like each other
  describe.skip('Signature capture', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('Signature capture on sales order', function () {
      var workspaceContainer;

      this.timeout(40 * 1000);

      it("should go to a new sales order screen", function (done) {
        smoke.navigateToNewWorkspace(XT.app, "XV.SalesOrderList", function (_workspaceContainer) {
           workspaceContainer = _workspaceContainer;
           done();
        });
      });

      it("should go to a new sales order screen", function (done) {
        workspaceContainer.$.workspace.popupSignature();
        setTimeout(function () { done();}, 1000);
      });

      it("should draw something and click ok", function () {
        var notifyPopup = XT.app.$.postbooks.$.notifyPopup;
        notifyPopup.$.customComponent.accessSignaturePad()._drawPoint(0, 0, 1);
        XT.app.$.postbooks.notifyOk(null, {originator: {name: "notifyOk"}});

        // TODO: figure this out: done() out when the docass gets added to this collection
        // workspaceContainer.$.workspace.value.get("files").on("all", function () { console.log(arguments); });
      });

      it("exits out without saving", function () {
        workspaceContainer.saveAndClose({force: true});
        // blow through error message
        XT.app.$.postbooks.notifyTap({}, {originator: {name: "notifyNo"}});
      });
    });
  });
}());
