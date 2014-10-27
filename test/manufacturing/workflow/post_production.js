/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, XG:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    crud = require("../../../../xtuple/test/lib/crud"),
    smoke = require("../../../../xtuple/test/lib/smoke"),
    workOrder = require("../specs/work_order"),
    zombieAuth = require("../../../../xtuple/test/lib/zombie_auth");

  describe('Manufacturing Post Production workflow', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('Post production', function () {
      var navigator,
        postbooks,
        orderWidget,
        model,
        workOrderList;

      this.timeout(40 * 1000);
      workOrder.spec.captureObject = true;
      smoke.runUICrud(workOrder.spec);

      it("should release the work order from the work order list", function (done) {
        var navigator = smoke.navigateToList(XT.app, "XV.WorkOrderList");
        model = navigator.$.contentPanels.$.workOrderList.value.find(function (model) {
          return model.id === XG.capturedId;
        });

        model.releaseOrder(function () {
          assert.equal(XM.WorkOrder.RELEASED_STATUS, model.get("status"));
          done();
        });
      });

      it("Check post production action requisite - canPostProduction", function (done) {
        model.canPostProduction(function (answer) {
          assert.isTrue(answer);
          done();
        });
      });

      it("navigate to Post Production", function (done) {
        var afterDone = function () {
            assert.equal(XT.app.$.postbooks.getActive().$.workspace, "XV.PostProductionWorkspace");
            done();
          };

        workOrderList = XT.app.$.postbooks.$.navigator.$.contentPanels.getActive();
        workOrderList.doWorkspace({
          workspace: "XV.PostProductionWorkspace",
          id: model.id,
          success: afterDone
        });
      });

      it("workspace has a Print Label checkbox ", function (done) {
        var workspace = XT.app.$.postbooks.getActive().$.workspace;
        assert.isNotNull(workspace.$.printPostProductionLabel);
        assert.isFalse(workspace.$.printPostProductionLabel.disabled);
        done();
      });

      it.skip("Post button is disabled on open", function () {
        // TODO: put under test
      });

      it.skip("distribute qty if Location/Lot/Serial item... ", function () {
        // TODO: put under test
      });

      it("Enter qty to post and Post (save) ", function (done) {
        var wsContainer = XT.app.$.postbooks.getActive();
        wsContainer.$.workspace.value.set("toPost", 10); 
        wsContainer.saveAndClose({
          force: true
        });

        workOrderList = XT.app.$.postbooks.$.navigator.$.contentPanels.getActive();
        assert.equal(workOrderList.value.getStatus(), XM.Model.READY_CLEAN);
        assert.equal(workOrderList.kind, "XV.WorkOrderList");
        done();
      });
    });
  });
}());

