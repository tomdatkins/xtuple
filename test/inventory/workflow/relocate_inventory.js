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
          submodels.itemModel.fetch({number: "STRUCK1", success: function () {
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

  describe('Relocate Inventory Workspace', function () {
    this.timeout(20 * 1000);
    
    before(function (done) {
      zombieAuth.loadApp(function () {
        primeSubmodels(function (err, submods) {
          submodels = submods;
          done();
        });
      });
    });
    
    var itemsToTest = ["STRUCK1"];

    _.each(itemsToTest, function (item) {
      describe('Relocate the ' + item + ' item', function () {
        it("Navigate to Inventory and enter Relocate Inventory Transaction", function () {
          utils.getListAction("relocateInventory", function (workspaceContainer) {
            workspace = workspaceContainer.$.workspace;
            assert.equal(workspace.value.recordType, "XM.RelocateInventory");
          
            workspace.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel,
              site: submodels.siteModel}});
            workspace.$.quantityWidget.doValueChange({value: 1});
          });
        });
        
        it("Select From and To Locations", function () {
          var sourceList = workspace.$.source,
            targetList = workspace.$.target,
            inSenderSource = workspace.$.source.$.list,
            inSenderTarget = workspace.$.target.$.list,
            inEvent = {index: 0, key: 0, originator: {isSelected: function () { return true; }}},
            sourceModel,
            targetModel;

          // Reproduce tap on first item in source/target lists
          XT.app.$.postbooks.getActive().waterfall("selectionChanged", inSenderSource, inEvent);
          XT.app.$.postbooks.getActive().waterfall("selectionChanged", inSenderTarget, inEvent);
        
          //sourceList.selectionChanged(sourceList.$.list, {index: 0, key: 0, originator: {isSelected: function () { return true; }}});
          //targetList.selectionChanged(targetList.$.list, {index: 0, key: 0, originator: {isSelected: function () { return true; }}});

          /* TODO For some reason the code below works in js console but not in mocha tests - returns errors
          sourceModel = sourceList.$.list.readyModels()[0].id;
          targetModel = targetList.$.list.readyModels()[0].id;
            
          assert.notEqual(sourceModel.id, targetModel.id);
          */
        });
        
        it.skip("Saving the Relocate transaction", function () {
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
