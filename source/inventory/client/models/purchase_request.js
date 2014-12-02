/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initPurchaseRequestModels = function () {

    if (!XT.extensions.purchasing) {
      return;
    }

    XM.PurchaseRequestMixin = {

      formatNumber: function () {
        return this.get("number") + "-" + this.get("subNumber");
      }

    };

    XM.PurchaseRequest = XM.Document.extend({

      recordType: "XM.PurchaseRequest",

      defaults: {
        subNumber: 1,
        created: new Date()
      },

      nameAttribute: "formatNumber",

      readOnlyAttributes: [
        "formatNumber"
      ],

      numberPolicy: XM.Document.AUTO_NUMBER,

      keyIsString: false

    });

    XM.PurchaseRequest.prototype.augment(XM.PurchaseRequestMixin);

    XM.PurchaseRequestParent = XM.Model.extend({
      recordType: "XM.PurchaseRequestParent"
    });

    _.extend(XM.PurchaseRequest, {
      /** @scope XM.PurchaseRequest */

      /**
        Planned Order.

        @static
        @constant
        @type String
        @default S
      */
      PLANNED_ORDER: "F",

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

      formatOrderType: function () {
        var orderType = this.get("orderType"),
          K = XM.PurchaseRequest;

        switch (orderType)
        {
        case K.SALES_ORDER:
          return "_salesOrder".loc();
        case K.PLANNED_ORDER:
          return "_plannedOrder".loc();
        case K.WORK_ORDER:
          return "_workOrder".loc();
        }

        return "";
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

