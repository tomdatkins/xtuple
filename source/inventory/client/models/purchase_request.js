/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initPurchaseRequestModels = function () {

    XM.PurchaseRequest = XM.Model.extend({
      recordType: "XM.PurchaseRequest",

      formatNumber: function () {
        return this.get("number") + "-" + this.get("subNumber");
      }
    });

    XM.PurchaseRequestParent = XM.Model.extend({
      recordType: "XM.PurchaseRequestParent"
    });

    _.extend(XM.PurchaseRequestParent, {
      /** @scope XM.PurchaseRequestParent */

      /**
        Sales Order.

        @static
        @constant
        @type String
        @default S
      */
      SALES_ORDER: "S",

      /**
        Work Order

        @static
        @constant
        @type String
        @default W
      */
      WORK_ORDER: "W"
    });

  };

}());

