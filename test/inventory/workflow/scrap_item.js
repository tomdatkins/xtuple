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
    zombieAuth = require("../../../../xtuple/test/lib/zombie_auth"),
    utils = require("../workflow_utils"),
    async = require("async"),
    workspace,
    submodels,
    primeSubmodels = function (done) {
      var submodels = {};
      async.series([
        function (callback) {
          submodels.itemModel = new XM.ItemRelation();
          submodels.itemModel.fetch({number: "BTRUCK1", success: function () {
            callback();
          }});
        },
        function (callback) {
          submodels.siteModel = new XM.SiteRelation();
          submodels.siteModel.fetch({code: "WH1", success: function () {
            callback();
          }});
        }
      ], function (err) {
        done(err, submodels);
      });
    };

  describe('Scrap Inventory Workspace', function () {
    this.timeout(30 * 1000);
    
    before(function (done) {
      zombieAuth.loadApp(function () {
        primeSubmodels(function (err, submods) {
          submodels = submods;
          done();
        });
      });
    });
    
    var itemsToTest = ["BTRUCK1", "STRUCK1"]; //, "BTRUCK1", "LOT1", "SERIAL1"];

    _.each(itemsToTest, function (item) {
      describe('Scrap the ' + item + ' item', function () {
        it("Navigate to Inventory and enter Scrap Transaction", function () {
          utils.getListAction("scrapTransaction", function (workspaceContainer) {
            workspace = workspaceContainer.$.workspace;
            assert.equal(workspace.value.recordType, "XM.ScrapTransaction");
          
            workspace.$.itemSiteWidget.doValueChange({value: {item: item,
              site: "WH1"}});
            workspace.$.quantityWidget.doValueChange({value: 1});
          });
        });
        
        // Have to specify Detail selection for Location Controlled and Lot/Serial enabled Items
        // Confirm after selection that the undistributed qty is zero.
        if (item !== "BTRUCK1") {
          it.skip("Distribute scrap qty to detail", function () {
            //workspace.$.detail.selectionChanged(workspace.$.detail.$.list, {index: 0, key: 0, originator: {isSelected: function () { return true; }}});
            var data = {index: 0, key: 0, originator: {isSelected: function () { return true; }}};
            XT.app.$.postbooks.getActive().waterfall("selectionChanged", data);
            assert.equal(workspace.value.getValue("undistributed"), 0);
          });
        }
        
        it("Check Quantity on Hand after scrap >= zero", function () {
          assert.isTrue(workspace.value.getValue("quantityAfter") >= 0);
        });
        
        it("Saving the Scrap transaction", function () {
          smoke.saveWorkspace(workspace, function (err, model) {
            if(err) { console.log(err.message()); }
            assert.isNull(err);
          }, true);
        });
      
        it("backs out of the transaction list", utils.getBackoutAction());
      });
    });
  });
}());
