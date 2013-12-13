/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initPurchaseOrderModels = function () {

    _.extend(XM.PurchaseOrderWorkflow, /** @lends XM.PurchaseOrderWorkflow# */{

      TYPE_RECEIVE: "R",

      TYPE_POST_RECEIPTS: "T"

    });

    XM.PurchaseOrder.prototype.augment({
      readOnlyAttributes: ["isDropShip", "salesOrder"]
    })

  };


}());

