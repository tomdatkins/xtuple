/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.inventory.initOrderModels = function () {

    XM.Order = {
      /** @scope XM.Order */

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

    /** @private */
    var _could = function (method, model, callback) {
      var orderType;
      if (this instanceof XM.Info && this.getStatus() === XM.Model.READY_CLEAN) {
        orderType = this.get("orderType");
        if (orderType === XM.Order.SALES_ORDER) {
          this.editableModel = "XM.SalesOrder";
        } else if (orderType === XM.Order.TRANSFER_ORDER) {
          this.editableModel = "XM.TransferOrder";
        } else if (orderType === XM.Order.PURCHASE_ORDER && XT.extensions.purchasing) {
          this.editableModel = "XM.PurchaseOrder";
        }
        return XM.Info.prototype[method].apply(this, model, callback);
      }
      return false;
    };

    /**
      Mixin to handle assignment of editable model which can vary depending
      on fetched model order type.
    */
    XM.OrderMixin = {
      couldCreate: function () {
        return false;
      },

      couldRead: function (model) {
        return _could.call(this, "couldRead", model);
      },

      couldUpdate: function (model) {
        return _could.call(this, "couldUpdate", model);
      },

      couldDelete: function (model) {
        return _could.call(this, "couldDelete", model);
      },

      couldDestroy: function (model, callback) {
        return _could.call(this, "couldDestroy", model, callback);
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

      localize: {}
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

      recordType: "XM.OrderRelation"

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

