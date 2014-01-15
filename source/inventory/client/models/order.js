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
      }
    };

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
    XM.OrderRelation = XM.Info.extend({

      recordType: "XM.OrderRelation"

    });

    _.extend(XM.OrderRelation, XM.OrderMixin);

    /**
      @class

      @extends XM.Info
    */
    XM.OrderListItem = XM.Info.extend({

      recordType: "XM.OrderListItem",

      /**
      Returns order status as a localized string.

      @returns {String}
      */
      getOrderStatusString: function () {
        var K = XM.Order,
          status = this.get('status');

        switch (status)
        {
        case K.OPEN_STATUS:
          return '_open'.loc();
        case K.CLOSED_STATUS:
          return '_closed'.loc();
        case K.CANCELLED_STATUS:
          return '_cancelled'.loc();
        }
      }

    });

    XM.OrderListItem = XM.OrderListItem.extend(XM.SalesOrderBaseMixin);
    _.extend(XM.OrderListItem, XM.OrderMixin);


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

    // ..........................................................
    // CLASS METHODS
    //
    _.extend(XM.Order, /** @lends XM.Order# */{

      // ..........................................................
      // CONSTANTS
      //

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
      CANCELLED_STATUS: "X"

    });

  };

}());

