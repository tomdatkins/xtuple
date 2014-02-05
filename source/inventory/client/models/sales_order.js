/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSalesOrderModels = function () {

    XM.SalesOrder.prototype.augment({

      handlers: {
        "status:READY_CLEAN": "statusReadyClean"
      },

      transactionDate: null,

      canCheckout: function () {
        var status = this.get("status"),
          K = XM.SalesOrderBase;

        return status === K.OPEN_STATUS;
      },

      canIssueStockToShipping: function () {
        var status = this.get("status"),
          K = XM.SalesOrderBase;

        return status === K.OPEN_STATUS && !this.isDirty();
      },

      fetchChildren: function () {
        var lineItems = this.get("lineItems"),
          children = this.getValue("children"),
          that = this;

        children.reset();

        lineItems.each(function (lineItem) {
          var child = lineItem.get("childOrder"),
            K = XM.SalesOrderLineChild,
            model;

          if (child) {
            switch (child.get("orderType"))
            {
            case K.PURCHASE_REQUEST:
              model = new XM.PurchaseRequest();
              break;
            case K.PURCHASE_ORDER:
              model = new XM.PurchaseOrder();
              break;
            }
            if (model) {
              lineItem.setValue("createOrder", true);
              lineItem.setReadOnly("createOrder", true);
              children.add(model);
              model.fetch({id: child.get("editorKey")});
            }
          }
        });
      },

      /**
      Return an array of models that includes the current sales order
      and all its children.

      @params {Array} Parent work order.
      returns Array
      */
      getOrders: function () {
        var orders =  new Backbone.Collection([this]);

        orders.add(this.getValue("children").models);

        return orders;
      },

      initialize: function () {
        var that = this;

        that.meta.set({
          children: new Backbone.Collection()
        });
      },

      statusReadyClean: function () {
        this.fetchChildren();
      }

/*
      save: function () {
        // Sync orders?
      }
*/
    });

    XM.SalesOrderLine.prototype.augment({

      readOnlyAttributes: [
        "createOrder",
      ],

      initialize: function () {
        // Meta was setup by sales order base
        this.meta.set({
          createOrder: false
        });
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderLineChild = XM.Model.extend({

      readOnlyAttributes: [
        "formatStatus",
        "orderNumber",
        "orderType",
        "status",
        "quantity",
        "dueDate"
      ],

      formatOrderType: function () {
        var type = this.get("orderType"),
          K = XM.SalesOrderLineChild;

        switch (type)
        {
        case K.PURCHASE_REQUEST:
          return "_purchaseRequest".loc();
        case K.PURCHASE_ORDER:
          return "_purchaseOrder".loc();
        default:
          return "";
        }
      },

      formatStatus: function () {
        var type = this.get("status"),
          K = XM.PurchaseOrder;

        switch (type)
        {
        case K.UNRELEASED_STATUS:
          return "_unreleased".loc();
        case K.OPEN_STATUS:
          return "_open".loc();
        case K.CLOSED_STATUS:
          return "_closed".loc();
        default:
          return "";
        }
      },

      recordType: "XM.SalesOrderLineChild"

    });

    _.extend(XM.SalesOrderLineChild, {
      /** @scope XM.SalesOrderLineChild */

      /**
        Purchase Request.

        @static
        @constant
        @type String
        @default R
      */
      PURCHASE_REQUEST: 'R',

      /**
        Purchase Order.

        @static
        @constant
        @type String
        @default P
      */
      PURCHASE_ORDER: 'P',
    });

    XM.SalesOrderListItem.prototype.augment({

      canIssueItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("IssueStockToShipping");
        if (callback) {
          callback(XM.SalesOrderBase.OPEN_STATUS && hasPrivilege);
        }
        return this;
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderLineListItem = XM.Model.extend({

      recordType: 'XM.SalesOrderLineListItem'

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.SalesOrderLineListItemCollection = XM.Collection.extend({

      model: XM.SalesOrderLineListItem

    });


    XM.SalesOrder.prototype.augment({
      handlers: {
        'change:packDate': 'packDateDidChange'
      },

      holdTypeDidChange: function () {
        this.updateWorkflowItemPackDate();
      },

      packDateDidChange: function () {
        this.updateWorkflowItemPackDate();
      },

      saleTypeDidChange: function () {
        this.updateWorkflowItemPackDate();
        this.updateWorkflowItemShipDate();
      },

      updateWorkflowItemPackDate: function () {
        var that = this;

        _.each(this.get("workflow").where(
            {workflowType: XM.SalesOrderWorkflow.TYPE_PACK}),
            function (workflow) {
          workflow.set({dueDate: that.get("packDate")});
        });
      },

      updateWorkflowItemShipDate: function () {
        var that = this;

        _.each(this.get("workflow").where(
            {workflowType: XM.SalesOrderWorkflow.TYPE_SHIP}),
            function (workflow) {
          workflow.set({dueDate: that.get("scheduleDate")});
        });
      }
    });

    _.extend(XM.SalesOrderWorkflow, /** @lends XM.SalesOrderLine# */{

      TYPE_PACK: "P",

      TYPE_SHIP: "S"

    });
  };

}());
