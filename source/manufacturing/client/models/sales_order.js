/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initSalesOrderModels = function () {

    var _proto = XM.SalesOrderLineChild.prototype,
      _formatOrderType = _proto.formatOrderType,
      _formatStatus = _proto.formatStatus;

    // Unfortunately augment won't work with these kind of functions
    // that return values
    XM.SalesOrderLineChild = XM.SalesOrderLineChild.extend({

      formatOrderType: function () {
        var type = this.get("orderType"),
          K = XM.SalesOrderLineChild;

        return type === K.WORK_ORDER ? "_workOrder".loc() :
          _formatOrderType.apply(this, arguments);
      },

      formatStatus: function () {
        var type = this.get("status"),
          K = XM.WorkOrder;

        // Handle statuses unique to work order
        switch (type)
        {
        case K.EXPLODED_STATUS:
          return "_exploded".loc();
        case K.RELEASED_STATUS:
          return "_released".loc();
        case K.INPROCESS_STATUS:
          return "_inProcess".loc();
        // Any other status is shared with purchase order
        default:
          return _formatStatus.apply(this, arguments);
        }
      }

    });

    var _lproto = XM.SalesOrderLine.prototype,
      _lformatOrderType = _lproto.formatOrderType,
      _getOrderType = _lproto.getOrderType;

    // Unfortunately augment won't work with these kind of functions
    // that return values
    XM.SalesOrderLine = XM.SalesOrderLine.extend({

      formatOrderType: function () {
        var K = XM.SalesOrderLineChild,
          childOrder = this.get("childOrder"),
          itemSite = this.getValue("itemSite"),
          orderType;

        orderType = childOrder ? childOrder.get("orderType") :
          this.getOrderType(itemSite);

        return orderType === K.WORK_ORDER ? "_workOrder".loc() :
          _lformatOrderType.apply(this, arguments);
      },

      getOrderType: function () {
        var createWo = this.getValue("itemSite.isCreateWorkOrdersForSalesOrders");

        return createWo ? XM.SalesOrderLineChild.WORK_ORDER :
          _getOrderType.apply(this, arguments);
      }
    });

    XM.SalesOrderLine.prototype.augment({
      itemSiteChanged: function () {
        var itemSite = this.getValue("itemSite"),
          childOrder = this.get("childOrder"),
          orderType = childOrder ? childOrder.get("orderType") : false,
          K = XM.SalesOrderLineChild;

        if (itemSite && orderType === K.WORK_ORDER) {
          this.setReadOnly("childOrder", false);
          childOrder.setReadOnly(["createOrder", "quantity"], false);
        }
      }
    });

    _.extend(XM.SalesOrderLineChild, {
      /** @scope XM.SalesOrderLineChild */

      /**
        WorkOrder.

        @static
        @constant
        @type String
        @default W
      */
      WORK_ORDER: 'W',

    });

    // Sales Order needs to know how to map work order children to actual models.
    XM.SalesOrder.prototype.childTypeModels[XM.SalesOrderLineChild.WORK_ORDER] = "XM.WorkOrder";

  };

}());
