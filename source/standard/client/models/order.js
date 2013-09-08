/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.standard.initOrderModels = function () {

    XM.Order = {
      /** @scope XM.Order */

      /**
        Reference item.

        @static
        @constant
        @type String
        @default R
      */
      SALES_ORDER: "SO",

      /**
        Manufactured item.

        @static
        @constant
        @type String
        @default M
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
          // We can set to transfer order later when transfer order exists as a model.
          return false;
          //this.editableModel = "XM.TransferOrder"
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

      recordType: "XM.OrderRelation"

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

  };

}());

