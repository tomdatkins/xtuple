/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initSalesOrderModels = function () {

    var _proto = XM.SalesOrderLineChild.prototype,
      _formatStatus = _proto.formatStatus;

    // Unfortunately augment won't work with these kind of functions
    // that return values
    XM.SalesOrderLineChild = XM.SalesOrderLineChild.extend({

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

    _.extend(XM.SalesOrderLineChild, {
      /** @scope XM.SalesOrderLineChild */

      /**
        WorkOrder.

        @static
        @constant
        @type String
        @default W
      */
      WORK_ORDER: 'W'

    });

    XM.SalesOrderLine.prototype.augment({

      childTypes: {
        W: {
          recordType: "XM.WorkOrder",
          autoCreate: "isCreateWorkOrdersForSalesOrders",
          createMethod: "createWorkOrder",
          localize: "_workOrder".loc()
        }
      },

      createWorkOrder: function () {
        var K = XM.SalesOrderLineChild,
          salesOrder = this.get("salesOrder"),
          children = salesOrder.getValue("children"),
          childOrder,
          status,
          orderNumber,
          subNumber,
          orders,
          numbers,
          model,
          options = {isNew: true, isChild: true},
          isWorkOrder = function (order) {
            if (order.recordType === "XM.WorkOrder" &&
              !order.isDestroyed()) {
              return true;
            }
          };

        childOrder = this.get("childOrder");
        orderNumber = salesOrder.get("number");
        status = XM.WorkOrder.OPEN_STATUS;

        // Determine the next sub number.
        orders = children.filter(isWorkOrder);
        numbers = _.pluck(_.pluck(orders, "attributes"), "subNumber");
        subNumber = numbers.length ? _.max(numbers) + 1 : 1;

        // Create the work order.
        model = new XM.WorkOrder(null, options);
        model.set({
          uuid: childOrder.id,
          number: orderNumber - 0,
          subNumber: subNumber,
          item: this.get("item"),
          site: this.get("site"),
          quantity: childOrder.get("quantity"),
          dueDate: childOrder.get("dueDate"),
          status: status,
          project: salesOrder.get("project")
        });

        // Add it to our sales order collection.
        children.add(model);

        // Update specifics of this order type on reference.
        childOrder.set({
          editorKey: childOrder.uuid,
          orderNumber: model.getValue("name"),
          status: status
        });

        // Manually emit a change event.
        Backbone.trigger.call(this, "change");
      }

    });

  };

}());
