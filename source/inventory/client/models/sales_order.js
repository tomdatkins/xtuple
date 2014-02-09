/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSalesOrderModels = function () {

    // Extend Sales Order to handle child supply order changes.
    _.extend(XM.SalesOrder.prototype, {
      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        var success = options.success,
          dirtyOrders = this.getOrders().filter(function (order) {
            return order.isDirty();
          });

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        // We want to persist this order and all its children.
        // TO DO: Should we figure out a way to persist collections with
        // collection.sync instead?
        options.collection = new Backbone.Collection(dirtyOrders);

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) { value = options; }

        return XM.Document.prototype.save.call(this, key, value, options);
      }
    });

    XM.SalesOrder.prototype.augment({

      handlers: {
        "change:packDate": "packDateDidChange",
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
          var childOrder = lineItem.get("childOrder"),
            editorKey = childOrder ? childOrder.get("editorKey") : false,
            K = XM.SalesOrderLineChild,
            Klass,
            model;

          if (editorKey && !childOrder.isDestroyed()) {
            // Map the child to right model type, then create
            // and fetch the model
            Klass = that.childTypeModels[childOrder.get("orderType")];
            if (_.isString(Klass)) { Klass = XT.getObjectByName(Klass); }
            if (Klass) {
              lineItem.setValue("createOrder", true, {silent: true});

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
                model.fetch({id: editorKey});
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
        var children = this.getValue("children"),
          orders =  new Backbone.Collection();

        orders.add(children.models);
        orders.add(this); // Save children first!

        return orders;
      },

      holdTypeDidChange: function () {
        this.updateWorkflowItemPackDate();
      },

      initialize: function () {
        this.meta.set({
          children: new Backbone.Collection()
        });
      },

      packDateDidChange: function () {
        this.updateWorkflowItemPackDate();
      },

      releaseLock: function (options) {
        var children = this.getValue("children");

        children.each(function (child) {
          child.releaseLock();
        });
      },

      saleTypeDidChange: function () {
        this.updateWorkflowItemPackDate();
        this.updateWorkflowItemShipDate();
      },

      statusReadyClean: function () {
        this.fetchChildren();
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

    XM.SalesOrderLine.prototype.augment({

      defaults: function () {
        return {
          atShipping: 0,
          shipped: 0
        };
      },

      readOnlyAttributes: [
        "atShipping",
        "createOrder",
        "childOrder",
        "formatOrderType",
        "isDropShip",
        "purchaseCost",
        "shipped"
      ],

      handlers: {
        "change:item change:site status:READY_CLEAN": "fetchItemSite"
      },

      autoCreateOrder: function () {
        var childOrder = this.get("childOrder"),
          quantity = this.get("quantity"),
          scheduleDate = this.get("scheduleDate");

        if (!childOrder && this.isNew() &&
          this.getOrderType() &&
          quantity && scheduleDate) {

          this.setValue("createOrder", true);
        }
      },

      bindEvents: function () {
        this.meta.on("change:itemSite", this.itemSiteChanged, this)
                 .on("change:createOrder", this.createOrderChanged, this);
      },

      createOrderChanged: function () {
        var K = XM.SalesOrderLineChild,
          createOrder = this.getValue("createOrder"),
          salesOrder = this.get("salesOrder"),
          children = salesOrder.getValue("children"),
          quantity = this.get("quantity"),
          scheduleDate = this.get("scheduleDate"),
          childOrder,
          orderType,
          that = this,
          uuid,
          status,
          orderNumber,
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
              that.unset("childOrder");
            } else {
              that.meta.off("orderChanged", that.createOrderChanged, that);
              that.setValue("createOrder", true);
              that.meta.on("orderChanged", that.createOrderChanged, that);
            }
          };

        if (createOrder) {
          // First generically create new child order reference.
          uuid = XT.generateUUID();
          orderType = this.getOrderType();

          childOrder = new XM.SalesOrderLineChild({
            uuid: uuid,
            orderType: orderType,
            quantity: quantity,
            dueDate: scheduleDate
          });

          this.set("childOrder", childOrder);

          // Now create the "real" order.
          if (orderType === K.PURCHASE_REQUEST) {
            orderNumber = salesOrder.get("number");
            status = XM.PurchaseOrder.OPEN_STATUS;

            // Determine the next sub number.
            orders = children.filter(isRequestOrder);
            numbers = _.pluck(_.pluck(orders, "attributes"), "subNumber");
            subNumber = numbers.length ? _.max(numbers) + 1 : 1;

            // Create the purchase request.
            model = new XM.PurchaseRequest(null, {isNew: true});
            model.set({
              uuid: uuid,
              number: orderNumber - 0,
              subNumber: subNumber,
              item: this.get("item"),
              site: this.get("site"),
              quantity: childOrder.get("quantity"),
              dueDate: childOrder.get("dueDate"),
              status: status,
              project: salesOrder.get("project"),
              created: new Date()
            });

            // Add it to our sales order collection.
            children.add(model);

            // Update specifics of this order type on reference.
            childOrder.set({
              editorKey: orderNumber,
              orderNumber: model.formatNumber(),
              status: status
            });

            // Manually emit a change event.
            Backbone.trigger.call(this, "change");
          }

        } else {
          this.notify("_deleteChildOrder?".loc(), {
            type: K.QUESTION,
            callback: afterDeleteQuestion
          });
        }
        this.handleChildOrder();
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

      formatOrderType: function () {
        var K = XM.SalesOrderLineChild,
          childOrder = this.get("childOrder"),
          orderType = this.getOrderType();

        switch (orderType)
        {
        case K.PURCHASE_REQUEST:
          return "_purchaseRequest".loc();
        case K.PURCHASE_ORDER:
          return "_purchaseOrder".loc();
        default:
          return "";
        }
      },

      getOrderType: function () {
        var childOrder = this.get("childOrder"),
          itemSite = this.getValue("itemSite"),
          createPr,
          createPo;

        if (childOrder) {
          return childOrder.get("orderType");
        } else if (itemSite) {
          createPr = itemSite.get("isCreatePurchaseRequestsForSalesOrders");
          createPo = itemSite.get("isCreatePurchaseOrdersForSalesOrders");

          if (createPr) {
            return K.PURCHASE_REQUEST;
          } else if (createPo) {
            return K.PURCHASE_ORDER;
          }
        }
        return false;
      },

      handleChildOrder: function () {
        var K = XM.SalesOrderLineChild,
          salesOrder = this.get("salesOrder"),
          quantity = this.get("quantity"),
          childOrder = this.get("childOrder"),
          orderType = this.getOrderType(),
          Klass;

        if (orderType) {
          Klass = XT.getObjectByName(salesOrder.childTypeModels[orderType]);
        } else {
          this.setReadOnly("createOrder");
          return;
        }

        if (childOrder) {
          // Purchase specific behavior
          if (orderType === K.PURCHASE_ORDER ||
              orderType === K.PURCHASE_REQUEST) {
            this.setReadOnly(["isDropShip", "purchaseCost"], false);
          }

          // General behavior
          this.setReadOnly(["createOrder", "childOrder"], false);
          childOrder.setReadOnly("quantity", false);
          this.setReadOnly("createOrder", !Klass.canDelete());
        } else {
          this.setReadOnly("createOrder", !Klass.canCreate());
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
          childOrder = this.get("childOrder");

        if (itemSite) {
          // If a child order exists, (quietly) check the box.
          if (childOrder) {
            this.setValue("createOrder", true, {silent: true});

          // Otherwise we should try to make one.
          } else {
            this.autoCreateOrder();
          }

          this.handleChildOrder();
        }
      },

      scheduleDateChanged: function () {
        var scheduleDate = this.get("scheduleDate"),
          childOrder = this.get("childOrder"),
          dueDate = this.getValue("childOrder.dueDate"),
          that = this,
          callback = function (resp) {
            if (resp.answer) {
              childOrder.set("dueDate", scheduleDate);
              Backbone.trigger.call(that, "change");
              that.autoCreateOrder();
            }
          };
 
        if (childOrder &&
          XT.date.compareDate(dueDate, scheduleDate)) {
          this.notify("_updateChildDueDate?".loc(), {
            type: K.QUESTION,
            callback: callback
          });
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
        childOrder = this.get("childOrder"),
        that = this,
        orderType,
        callback = function (resp) {
          if (resp.answer) {
            childOrder.set("quantity", quantity);
            Backbone.trigger.call(that, "change");
            that.handleChildOrder();
            that.autoCreateOrder();
            _quantityChanged.apply(that, arguments);
          }
        };

      if (childOrder) {
        this.notify("_updateChildQuantity?".loc(), {
          type: K.QUESTION,
          callback: callback
        });
      } else {
        this.autoCreateOrder();
        _quantityChanged.apply(this, arguments);
      }
    };

    /**
      @class

      This model is an abstracted proxy for "real" orders 
      maintaned in an array called "children" handled in meta
      on Sales Order. It is something of an odd bird as we perform
      editing on it even though edits don't actually get saved. However
      it is an important intermediary because it allows us to support
      any number of different supply order types.

      @extends XM.Model
    */
    XM.SalesOrderLineChild = XM.Model.extend({

      recordType: "XM.SalesOrderLineChild",

      readOnlyAttributes: [
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

    _.extend(XM.SalesOrderWorkflow, /** @lends XM.SalesOrderLine# */{

      TYPE_PACK: "P",

      TYPE_SHIP: "S"

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

  };

}());
