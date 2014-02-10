/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initSalesOrderModels = function () {

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
        }, {validate: false});

        // Add it to our sales order collection.
        children.add(model);

        // Update specifics of this order type on reference.
        childOrder.set({
          editorKey: childOrder.id,
          orderNumber: model.getValue("name"),
          status: status
        });
      }
    });

    // Order of events matters here
    var _proto = XM.SalesOrderLine.prototype,
      _scheduleDateChanged = _proto.scheduleDateChanged;

    _.extend(_proto, {
      /**
        Implement site calendar.
      */
      scheduleDateChanged: function (model, changes, options) {
        options = options ? _.clone(options) : {};
        var scheduleDate = this.get("scheduleDate"),
          site = this.get("site"),
          useSiteCalendar = XT.session.settings.get("UseSiteCalendar"),
          dispOptions = {},
          nextDate,
          that = this,
          params,

          afterCalculate = function (resp) {
            var message = "_nextWorkingDate?".loc();

            nextDate = new Date(resp);

            // If dates don't match, ask if  they should
            if (XT.date.compare(scheduleDate, nextDate)) {
              that.notify(message, {
                type: XM.Model.QUESTION,
                callback: afterQuestion
              });
            } else {
              _scheduleDateChanged.apply(that, arguments);
            }
          },

          afterQuestion = function (resp) {
            if (resp.answer) {
              that.set("scheduleDate", nextDate, {validate: false});
            } else {
              _scheduleDateChanged.apply(that, arguments);
            }
          };

        // Determine whether we need to get the server to answer some questions
        if (useSiteCalendar && options.validate !== false) {
          params = [site.id, scheduleDate, 0];
          dispOptions.success = afterCalculate;
          this.dispatch("XM.Site", "calculateNextWorkingDate", params, dispOptions);
        } else {
          _scheduleDateChanged.apply(this, arguments);
        }
      }
    });

  };

}());
