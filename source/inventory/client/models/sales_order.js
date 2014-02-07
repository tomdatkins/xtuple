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

      /**
        A map between child model order types and the model
        classes used to instantiate the "real" version of the
        model.
      */
      childTypeModels: {}, // The maps for this are populated below

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

      /**
        This function looks for child order references on
        each sales order line, attempts to resolve what kind
        of order they really represent, create and fetch the
        real order and cache it in the `children` collection
        on the order so we can manipulate it if the user
        changes something like quantity or due date.
      */
      fetchChildren: function () {
        var lineItems = this.get("lineItems"),
          children = this.getValue("children"),
          that = this;

        children.reset();

        lineItems.each(function (lineItem) {
          var child = lineItem.get("childOrder"),
            K = XM.SalesOrderLineChild,
            Klass,
            model;

          if (child) {
            // Map the child to right model type, then create
            // and fetch the model
            Klass = that.childTypeModels[child.get("orderType")];
            if (_.isString(Klass)) { Klass = XT.getObjectByName(Klass); }
            if (Klass) {
              lineItem.setValue("createOrder", true, {silent: true});
              lineItem.setReadOnly("createOrder", true);

              // Only bother fetching the model if user has privileges
              // to change it.
              if (Klass.canUpdate()) {
                model = new Klass();
                // Over-ride usual behavior because there are no relations.
                // Need the parent to be recognized for destroy to work right.
                model.getParent = function () {
                  return that;
                };
                children.add(model);
                model.fetch({id: child.get("editorKey")});
              }
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

    });

    XM.SalesOrderLine.prototype.augment({

      defaults: function () {
        return {
          atShipping: 0,
          shipped: 0
        };
      },

      readOnlyAttributes: [
        "createOrder",
        "childOrder",
        "isDropShip",
        "purchaseCost"
      ],

      handlers: {
        "change:item change:site status:READY_CLEAN": "fetchItemSite"
      },

      autoCreateOrder: function () {
        var childOrder = this.get("childOrder"),
          quantity = childOrder.get("quantity"),
          dueDate = childOrder.get("dueDate");

        if (quantity && dueDate &&
          this.isNew() && !this._autoCreated) {

          this.setValue("createOrder", true);
           // Don't try this again if the user manually unchecks
          this._autoCreated = true;
        }
      },

      bindEvents: function () {
        this.meta.on("change:itemSite", this.itemSiteChanged, this)
                 .on("change:createOrder", this.createOrderChanged, this);
      },

      createOrderChanged: function () {
        var K = XM.SalesOrderLineChild,
          createOrder = this.getValue("createOrder"),
          childOrder = this.get("childOrder"),
          orderType = childOrder.get("orderType"),
          salesOrder = this.get("salesOrder"),
          children = salesOrder.getValue("children"),
          that = this,
          subNumber,
          orders,
          numbers,
          model,
          isRequestOrder = function (order) {
            if (order.recordType === "XM.PurchaseRequest" &&
              !order.isDestroyed()) {
              return true;
            }
          },
          afterDeleteQuestion = function (resp) {
            if (resp.answer) {
              model = _.findWhere(children.models, {id: childOrder.id});
              model.destroy();

              // Reset a new empty child order record
              childOrder = new XM.SalesOrderLineChild({
                orderType: orderType,
                quantity: that.get("quantity"),
                dueDate: that.get("scheduleDate")
              });
              that.set("childOrder", childOrder);
            } else {
              that.meta.off("orderChanged", that.createOrderChanged, that);
              that.setValue("createOrder", true);
              that.meta.on("orderChanged", that.createOrderChanged, that);
            }
          };

        if (createOrder) {
          if (orderType === K.PURCHASE_REQUEST) {
            // Determine the next sub number.
            orders = children.filter(isRequestOrder);
            numbers = _.pluck(_.pluck(orders, "attributes"), "subNumber");
            subNumber = _.max(numbers) + 1;

            // Create the purchase request.
            model = new XM.PurchaseRequest(null, {isNew: true});
            model.set({
              uuid: childOrder.id,
              number: salesOrder.get("number"),
              subNumber: subNumber,
              item: this.get("item"),
              site: this.get("site"),
              quantity: childOrder.get("quantity"),
              dueDate: childOrder.get("dueDate"),
              project: salesOrder.get("project")
            });

            children.add(model);
            childOrder.set("orderNumber", model.formatNumber());
          }

        } else {
          this.notify("_deleteChildOrder?".loc(), {
            type: K.QUESTION,
            callback: afterDeleteQuestion
          });
        }
      },

      fetchItemSite: function () {
        var item = this.get("item"),
          site = this.get("site"),
          itemSites,
          options = {},
          that = this,
          afterFetch = function () {
            if (itemSites.length) {
              that.setValue("itemSite", itemSites.first());
            }
          };

        this.setValue("itemSite", null);

        if (item && site) {
          itemSites = new XM.ItemSiteRelationCollection();

          options.query = {
            parameters: [
              {attribute: "item", value: item},
              {attribute: "site", value: site}
            ]
          };
          options.success = afterFetch;
          itemSites.fetch(options);
        }
      },

      handleChildOrder: function () {
        var K = XM.SalesOrderLineChild,
          quantity = this.get("quantity"),
          noQty = !_.isNumber(quantity),
          childOrder = this.get("childOrder"),
          orderType;

        if (childOrder) {
          // Purchase specific behavior
          orderType = childOrder.get("orderType");
          if (orderType === K.PURCHASE_ORDER ||
              orderType === K.PURCHASE_REQUEST) {
            this.setReadOnly(["isDropShip", "purchaseCost"], noQty);
          }

          // General behavior
          this.setReadOnly(["createOrder", "childOrder"], noQty);
          childOrder.setReadOnly("quantity", noQty);
        }
      },

      initialize: function () {
        // Meta was setup by sales order base
        this.meta.set({
          createOrder: false,
          itemSite: null
        }, {silent: true});
      },

      itemSiteChanged: function () {
        var K = XM.SalesOrderLineChild,
          itemSite = this.getValue("itemSite"),
          childOrder = this.get("childOrder"),
          quantity = this.get("quantity"),
          scheduleDate = this.get("scheduleDate"),
          options = {silent: true}, // Don't make record dirty
          orderType,
          createPo,
          createPr;

        if (itemSite) {
          createPr = itemSite.get("isCreatePurchaseRequestsForSalesOrders");
          createPo = itemSite.get("isCreatePurchaseOrdersForSalesOrders");
          childOrder = this.get("childOrder");

          this.setValue("createOrder", _.isObject(childOrder), options);

          // Create a child order object if there isn't one just to be ready
          if ((createPr || createPo) && !childOrder) {
            orderType =  createPr ? K.PURCHASE_REQUEST : K.PURCHASE_ORDER;
            childOrder = new XM.SalesOrderLineChild({
              salesOrderLine: this,
              orderType: orderType,
              quantity: quantity,
              dueDate: scheduleDate
            });
            this.set("childOrder", childOrder, options);
            this.autoCreateOrder();
          }
        }

        this.handleChildOrder();
      },

      scheduleDateChanged: function () {
        var scheduleDate = this.get("scheduleDate"),
          childOrder = this.get("childOrder"),
          dueDate = this.getValue("childOrder.dueDate"),
          createOrder = this.getValue("createOrder"),
          that = this,
          callback = function (resp) {
            if (resp.answer) {
              childOrder.set("dueDate", scheduleDate);
              that.trigger("change:childOrder");
              that.autoCreateOrder();
            }
          };
 
        if (createOrder &&
          XT.date.compareDate(dueDate, scheduleDate)) {
          this.notify("_updateChildDueDate?".loc(), {
            type: K.QUESTION,
            callback: callback
          });
        } else if (childOrder) {
          callback(true);
        }
      }

    });

    // Need to handle quantity change in a specific order
    // Because of potential user invoked callbacks on original
    // function and this monkey patch.
    var _proto = XM.SalesOrderLine.prototype,
      _quantityChanged = _proto.quantityChanged;

    _proto.quantityChanged = function () {
      var quantity = this.get("quantity"),
        createOrder = this.getValue("createOrder"),
        childOrder = this.get("childOrder"),
        that = this,
        orderType,
        callback = function (resp) {
          if (resp.answer) {
            childOrder.set("quantity", quantity);
            that.trigger("change:childOrder");
            that.handleChildOrder();
            that.autoCreateOrder();
            _quantityChanged.apply(that, arguments);
          }
        };

      if (createOrder) {
        this.notify("_updateChildQuantity?".loc(), {
          type: K.QUESTION,
          callback: callback
        });
      } else if (childOrder) {
        callback(true);
      }
    };

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderLineChild = XM.Model.extend({

      recordType: "XM.SalesOrderLineChild",

      readOnlyAttributes: [
        "formatOrderType",
        "formatStatus",
        "orderNumber",
        "orderType",
        "status",
        "quantity",
        "dueDate"
      ],

      handlers: {
        "change:dueDate": "dueDateChanged",
        "change:quantity": "quantityChanged"
      },

      dueDateChanged: function () {
        var dueDate = this.get("dueDate"),
          orderType = this.get("orderType"),
          Klass = XM.SalesOrder.prototype.childTypeModels[orderType],
          order;

        Klass = XT.getObjectByName(Klass);
        order = Backbone.Relational.store.find(Klass, this.id);

        if (order) {
          order.set("dueDate", dueDate, {validate: false});
        }
      },

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

      formatOrderTypeShort: function () {
        var type = this.get("orderType"),
          K = XM.SalesOrderLineChild;

        switch (type)
        {
        case K.PURCHASE_REQUEST:
          return "_request".loc();
        case K.PURCHASE_ORDER:
          return "_purchase".loc();
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

      quantityChanged: function () {
        var quantity = this.get("quantity"),
          orderType = this.get("orderType"),
          Klass = XM.SalesOrder.prototype.childTypeModels[orderType],
          order;

        Klass = XT.getObjectByName(Klass);
        order = Backbone.Relational.store.find(Klass, this.id);

        if (order) {
          order.set("quantity", quantity, {validate: false});
        }
      }

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


    // Now we can populate the model type map on Sales Order
    var _sproto = XM.SalesOrder.prototype,
      K = XM.SalesOrderLineChild;

    _sproto.childTypeModels[K.PURCHASE_REQUEST] = "XM.PurchaseRequest";
    _sproto.childTypeModels[K.PURCHASE_ORDER] = "XM.PurchaseOrder";


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
