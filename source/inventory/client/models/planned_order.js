/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initPlannedOrderModels = function () {

    XM.PlannedOrder = XM.Model.extend({

      recordType: "XM.PlannedOrder",

      canFirm: function () {
        return !this.get("firm");
      },

      canSoften: function () {
        return this.get("firm");
      },

      formatNumber: function () {
        return this.get("number") + "-" + this.get("subNumber");
      },

      formatPlannedOrderType: function () {
        var type = this.get("plannedOrderType"),
          K = XM.PlannedOrder;

        switch (type)
        {
        case K.PURCHASE_ORDER:
          return "_purchaseOrder".loc();
        case K.TRANSFER_ORDER:
          return "_transferOrder".loc();
        default:
          return "";
        }
      }

    });

    _.extend(XM.PlannedOrder, {
      /** @scope XM.PlannedOrder */

      /**
        Purchase Order.

        @static
        @constant
        @type String
        @default P
      */
      PURCHASE_ORDER: "P",

      /**
        Transfer Order

        @static
        @constant
        @type String
        @default W
      */
      TRANSFER_ORDER: "T"

    });

    XM.PlannedOrderRelation = XM.Info.extend({
      
      recordType: "XM.PlannedOrderRelation"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.PlannedOrderCollection = XM.Collection.extend({

      model: XM.PlannedOrder

    });

  };

}());

