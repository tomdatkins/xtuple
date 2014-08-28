/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    common = require("../../../../xtuple/test/lib/common"),
    assert = require("chai").assert;

  var primeSubmodels = function (done) {
    var submodels = {};
    async.series([
      function (callback) {
        submodels.itemModel = new XM.ItemRelation();
        submodels.itemModel.fetch({number: "YTRUCK1", success: function () {
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
      done(submodels);
    });
  };

  var plannedOrderType = function (orderType) {
    var type;
    if (orderType === "purchaseOrder") {
      type = XM.PlannedOrder.PURCHASE_ORDER;
    } else if (orderType === "transferOrder") {
      type = XM.PlannedOrder.TRANSFER_ORDER;
    } else if (orderType === "workOrder") {
      type = XM.PlannedOrder.WORK_ORDER;
    }
    return type;
  };

  var spec = {
    skipDelete: true,
    captureObject: true,
    recordType: "XM.PlannedOrder",
    collectionType: "XM.PlannedOrderListItemCollection",
    listKind: "XV.PlannedOrderList",
    instanceOf: "XM.Document",
    cacheName: null,
    isLockable: true,
    orderType: "purchaseOrder",
    idAttribute: "uuid",
    attributes: ["id", "uuid", "number", "subNumber", "isFirm", "plannedOrderType", "startDate",
      "dueDate", "quantity", "item", "site", "notes", "parent", "supplySite"],
    extensions: ["inventory"],
    privileges: {
      createUpdate: "CreatePlannedOrders",
      read: "ViewPlannedOrders",
      delete: "DeletePlannedOrders"
    },
    createHash: {
      dueDate: new Date(),
      quantity: 10
    },
    updatableField: "notes",
    beforeSaveActions: [{it: "should set the item and site ", action: function (data, next) {
      primeSubmodels(function (submodels) {
        data.model.set({
          "item": submodels.itemModel,
          "site": submodels.siteModel,
          "plannedOrderType": plannedOrderType(spec.orderType)
        });
        setTimeout(function () {
          next();
        }, 3000);
      });
    }}],
    beforeSaveUIActions: [{it: 'sets item, site and quantity',
      action: function (workspace, done) {
        var gridRow;

        primeSubmodels(function (submodels) {
          workspace.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel,
            site: submodels.siteModel}});
          setTimeout(function () {
            done();
          }, 3000);
        });
      }
    }]
  };

  exports.spec = spec;

}());
