/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initOrderModels = function () {

    XM.Order = {
      /** @scope XM.Order */


      /**
        Credit Memo.

        @static
        @constant
        @type String
      */
      CREDIT_MEMO: "CM",

      /**
        Invoice.

        @static
        @constant
        @type String
      */
      INVOICE: "IN",

      /**
        Purchase Order.

        @static
        @constant
        @type String
      */
      PURCHASE_ORDER: "PO",

      /**
        Sales Order.

        @static
        @constant
        @type String
      */
      SALES_ORDER: "SO",

      /**
        Transfer Order.

        @static
        @constant
        @type String
      */
      TRANSFER_ORDER: "TO",

      /**
        Planned Order.

        @static
        @constant
        @type String
      */
      PLANNED_ORDER: "PL",

      /**
        Purchase Request.

        @static
        @constant
        @type String
      */
      PURCHASE_REQUEST: "PR",

      /**
        Order is open.

        @static
        @constant
        @type String
        @default O
      */
      OPEN_STATUS: "O",

      /**
        Order is closed.

        @static
        @constant
        @type String
        @default C
      */
      CLOSED_STATUS: "C",

      /**
        Order is cancelled.

        @static
        @constant
        @type String
        @default X
      */
      CANCELLED_STATUS: "X",

      /**
        Order is planned.

        @static
        @constant
        @type String
        @default P
      */
      PLANNED_STATUS: "P",

      /**
        Order is firmed.

        @static
        @constant
        @type String
        @default F
      */
      FIRMED_STATUS: "F",

    };

    /**
      Mixin to handle assignment of editable model which can vary depending
      on fetched model order type.
    */
    XM.OrderMixin = {
      couldCreate: function () {
        return false;
      },

      couldRead: function () {
        var Klass = Backbone.Relational.store.getObjectByName(this.editableModel);
        return Klass ? Klass.canRead(this) : false;
      },

      /**
        Returns sales order hold type as a localized string.

        @returns {String}
      */
      formatHoldType: function () {
        var K = XM.SalesOrderBase,
          holdType = this.get('holdType');

        switch (holdType)
        {
        case K.NONE_HOLD_TYPE:
          return "_none".loc();
        case K.CREDIT_HOLD_TYPE:
          return '_creditHoldType'.loc();
        case K.PACKING_HOLD_TYPE:
          return '_packingHoldType'.loc();
        case K.RETURN_HOLD_TYPE:
          return '_returnHoldType'.loc();
        case K.SHIPPING_HOLD_TYPE:
          return '_shippingHoldType'.loc();
        }
      },

      /**
      Returns order status as a localized string.

      @returns {String}
      */
      getOrderStatusString: function () {
        return XM.OrderMixin.localize[this.get('status')];
      },

      /**
      Returns order type as a localized string.

      @returns {String}
      */
      getOrderTypeString: function () {
        return XM.OrderMixin.localize[this.get('orderType')];
      },

      localize: {},

      setEditableModel: function () {
        var orderType = this.get("orderType");
        if (orderType === XM.Order.SALES_ORDER) {
          this.editableModel = "XM.SalesOrder";
        } else if (orderType === XM.Order.TRANSFER_ORDER) {
          this.editableModel = "XM.TransferOrder";
        } else if (orderType === XM.Order.PURCHASE_ORDER && XT.extensions.purchasing) {
          this.editableModel = "XM.PurchaseOrder";
        }
        return this.editableModel;
      }
    };

    // Doing localizations this way so they are extensible
    var K = XM.Order,
     L = XM.OrderMixin.localize;

    L[K.PURCHASE_ORDER] = "_purchaseOrder".loc();
    L[K.SALES_ORDER] = "_salesOrder".loc();
    L[K.TRANSFER_ORDER] = "_transferOrder".loc();
    L[K.PLANNED_ORDER] = "_plannedOrder".loc();
    L[K.PURCHASE_REQUEST] = "_purchaseRequest".loc();
    L[K.OPEN_STATUS] = "_open".loc();
    L[K.CLOSED_STATUS] = "_closed".loc();
    L[K.CANCELLED_STATUS] = "_cancelled".loc();
    L[K.PLANNED_STATUS] = "_planned".loc();
    L[K.FIRMED_STATUS] = "_firmed";

    /**
      @class

      @extends XM.Model
    */
    XM.OrderLine = XM.Model.extend({

      recordType: "XM.OrderLine"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.OrderRelation = XM.Info.extend(_.extend({}, XM.OrderMixin, {

      recordType: "XM.OrderRelation",

      handlers: {
        "status:READY_CLEAN": "setEditableModel"
      }

    }));

    /**
      @class

      @extends XM.Info
    */
    XM.OrderListItem = XM.Info.extend(_.extend({}, XM.SalesOrderBaseMixin, XM.OrderMixin, {

      recordType: "XM.OrderListItem",

    }));

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.OrderRelationCollection = XM.Collection.extend({

      model: XM.OrderRelation

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.OrderListItemCollection = XM.Collection.extend({

      model: XM.OrderListItem

    });

  };

}());

