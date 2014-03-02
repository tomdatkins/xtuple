/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initPurchaseRequestModels = function () {

    XM.PurchaseRequestMixin = {

      formatNumber: function () {
        return this.get("number") + "-" + this.get("subNumber");
      }

    };

    XM.PurchaseRequest = XM.Model.extend({
      recordType: "XM.PurchaseRequest",

      formatStatus: function () {
        return "_open".loc();
      }
    });

    XM.PurchaseRequest.prototype.augment(XM.PurchaseRequestMixin);

    _.extend(XM.PurchaseRequest, {
      /** @scope XM.PurchaseRequest */

      /**
        Open Status.

        @static
        @constant
        @type String
        @default O
      */
      OPEN_STATUS: "O",

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

    XM.PurchaseRequestListItem = XM.Info.extend({

      recordType: "XM.PurchaseRequestListItem",

      editableModel: "XM.PurchaseRequest",

      formatParent: function () {
        var parent = this.get("parent"),
          type = parent ? parent.get("type") : "",
          orderNumber = parent ? parent.get("orderNumber") : "",
          K = XM.PurchaseRequest;

        if (type === K.SALES_ORDER) {
          type = "_salesOrder".loc();
        } else if (type === K.WORK_ORDER) {
          type = "_workOrder".loc();
        }

        return parent ? type + " " + orderNumber : "";
      }

    });

    XM.PurchaseRequestListItem.prototype.augment(XM.PurchaseRequestMixin);

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.PurchaseRequestListItemCollection = XM.Collection.extend({

      model: XM.PurchaseRequestListItem

    });


  };

}());

