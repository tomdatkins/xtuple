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
        options.propagate = true; // Make sure child order statuses get set too.

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
            orderType,
            Klass;

          if (editorKey && !childOrder.isDestroyed()) {
            var order,
              map;

            // Map the child to right model type, then create
            // and fetch the model
            orderType = childOrder.get("orderType");
            map = lineItem.childTypes[orderType];
            Klass = map.parentRecordType || map.recordType;
            if (_.isString(Klass)) { Klass = XT.getObjectByName(Klass); }
            if (Klass) {
              lineItem.setValue("createOrder", true, {silent: true});

              // Only bother fetching the model if user has privileges
              // to change it.
              if (Klass.canUpdate()) {
                order = Klass.findOrCreate(editorKey) || new Klass();
                // Over-ride usual behavior because there are no relations.
                // Need the parent to be recognized for destroy to work right.
                order.getParent = function () {
                  return that;
                };
                children.add(order);
                order.fetch({id: editorKey});
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

      scheduleDateChanged: function () {
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

      /**
        A map between child model order types and the model
        classes used to instantiate the "real" version of the
        model.
      */
      childTypes: {
        R: {
          recordType: "XM.PurchaseRequest",
          createMethod: "createPurchaseRequest",
          autoCreate: "isCreatePurchaseRequestsForSalesOrders",
          localize: "_purchaseRequest".loc(),
          localizeShort: "_request".loc()
        },
        P: {
          recordType: "XM.PurchaseOrderLine",
          parentRecordType: "XM.PurchaseOrder",
          createMethod: "createPurchaseOrderLine",
          destroyMethod: "destroyPurchaseOrderLine",
          autoCreate: "isCreatePurchaseOrdersForSalesOrders",
          localize: "_purchaseOrder".loc(),
          localizeShort: "_purchase".loc()
        }
      },

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
        var createOrder = this.getValue("createOrder"),
          childOrder,
          orderType,
          createMethod,
          that = this,
          afterDeleteQuestion = function (resp) {
            var children = that.getValue("salesOrder.children"),
              model,
              orderType,
              destroyMethod;

            if (resp.answer) {
              orderType = that.getOrderType();
              destroyMethod = that.childTypes[orderType].destroyMethod;
              if (destroyMethod) {
                that[destroyMethod]();
              } else {
                childOrder = that.get("childOrder");
                model = _.findWhere(children.models, {id: childOrder.id});
                model.destroy();
              }
              that.unset("childOrder");
            } else {
              // User changed their mind, so recheck create order.
              that.meta.off("orderChanged", that.createOrderChanged, that);
              that.setValue("createOrder", true);
              that.meta.on("orderChanged", that.createOrderChanged, that);
            }
          };

        if (createOrder) {
          // First generically create new child order reference.
          childOrder = new XM.SalesOrderLineChild({
            uuid: XT.generateUUID(),
            orderType: this.getOrderType(),
            quantity: this.get("quantity"),
            dueDate: this.get("scheduleDate")
          });
          this.set("childOrder", childOrder);

          // Now create the "real" order.
          orderType = this.getOrderType();
          createMethod = this.childTypes[orderType].createMethod;
          this[createMethod]();

          // Manually emit a change event.
          Backbone.trigger.call(this, "change");
        } else {
          this.notify("_deleteChildOrder?".loc(), {
            type: XM.Model.QUESTION,
            callback: afterDeleteQuestion
          });
        }
        this.handleChildOrder();
      },

      createPurchaseOrderLine: function () {
        var K = XM.SalesOrderLineChild,
          itemSources = new XM.ItemSourceCollection(),
          item = this.get("item"),
          that = this,
          options,
          itemSource,
          vendor,
          purchaseOrder,

          // If we have a default item source, make a P/O from
          // that, otherwise present a search list
          afterFetchDefaultSource = function () {
            var list;

            if (itemSources.length) {
              findExisting(itemSources.first());
            } else {
              // Request an item source selection
              that.notify(null, {
                type: XM.Model.QUESTION,
                request: "itemSource",
                payload: item,
                callback: findExisting
              });
            }
          },

          // See if there's an existing purchase order for the item source.
          findExisting = function (resp) {
            var children = that.getValue("salesOrder.children");

            // Bail if no item source found or selected
            if (!resp) { return; }

            itemSource = resp;

            // Look for a Purchase Order on this Sales Order for this Vendor
            purchaseOrder = _.find(children.models, function (model) {
              return model.recordType === "XM.PurchaseOrder" &&
                model.get("vendor").id === itemSource.get("vendor").id &&
                model.get("isDropShip") === that.getValue("isDropShip");
            });

            if (purchaseOrder) {
              appendOrder();
            } else {
              fetchVendor();
            }
          },

          appendOrder = function () {
            var childOrder = that.get("childOrder"),
              line = new XM.PurchaseOrderLine({
                uuid: childOrder.id
              }, {isNew: true}),
              site = that.get("site"),
              inventoryQuantity = that.getValue("inventoryQuantity"),
              purchaseCost = that.get("purchaseCost"),
              quantity = that.get("quantity") * that.get("quantityUnitRatio") /
                itemSource.get("vendorUnitRatio"),
              orderNumber = purchaseOrder.get("number");

            // Set data on new line item.
            purchaseOrder.get("lineItems").add(line);
            line.set("site", site)
                .set("itemSource", itemSource)
                .set("quantity", quantity)
                .set("dueDate", that.get("scheduleDate"))
                .set("notes", that.get("notes"))
                .set("project", that.getValue("salesOrder.project"));

            if (_.isNumber(purchaseCost)) {
              line.set("price", purchaseCost);
            }

            // Update our child reference.
            orderNumber += "-" + line.get("lineNumber");
            childOrder.set("orderNumber", orderNumber);
            Backbone.trigger.call(that, "change");
          },

          fetchVendor = function () {
            vendor = new XM.PurchaseVendorRelation();
            vendor.fetch({
              id: itemSource.get("vendor").id,
              success: buildOrder
            });
          },

          buildOrder = function () {
            var salesOrder = that.get("salesOrder"),
              children = salesOrder.getValue("children"),
              orderNumber = salesOrder.get("number"),
              salesOrderRelation,
              childOrder,
              attrs;

            // Get some reference information.
            childOrder = that.get("childOrder");
            salesOrderRelation = XM.SalesOrderRelation.findOrCreate(orderNumber) ||
              new XM.SalesOrderRelation({number: orderNumber});

            // Create the purchase order.
            purchaseOrder = new XM.PurchaseOrder(null, {isNew: true});

            // Deal with the async aspect of order number.
            purchaseOrder.once("change:number", function () {
              childOrder.set({
                editorKey: purchaseOrder.get("number"),
                status: purchaseOrder.get("status")
              });

              // Add the line item
              appendOrder();
            });

            attrs = {
              vendor: vendor,
              salesOrder: salesOrderRelation,
              notes: salesOrder.get("shipNotes")
            };

            if (that.get("isDropShip")) {
              _.extend(attrs, {
                isDropShip: true,
                shiptoAddress: salesOrder.getValue("shipto.address"),
                shiptoName: salesOrder.get("shiptoName"), // After 4.4...
                shiptoAddress1: salesOrder.get("shiptoAddress1"),
                shiptoAddress2: salesOrder.get("shiptoAddress2"),
                shiptoAddress3: salesOrder.get("shiptoAddress3"),
                shiptoCity: salesOrder.get("shiptoCity"),
                shiptoState: salesOrder.get("shiptoState"),
                shiptoPostalCode: salesOrder.get("shiptoPostalCode"),
                shiptoCountry: salesOrder.get("shiptoCountry"),
                shiptoContact: salesOrder.get("shiptoContact"),
                shiptoContactHonorific: salesOrder.get("shiptoHonorific"),
                shiptoContactFirstName: salesOrder.get("shiptoContactFirstName"),
                shiptoContactMiddleName: salesOrder.get("shiptoContactMiddleName"),
                shiptoContactLastName: salesOrder.get("shiptoContactLastName"),
                shiptoContactSuffix: salesOrder.get("shiptoContactSuffix"),
                shiptoContactPhone: salesOrder.get("shiptoContactPhone"),
                shiptoContactTitle: salesOrder.get("shiptoContactTitle"),
                shiptoContactFax: salesOrder.get("shiptoContactFax"),
                shiptoContactEmail: salesOrder.get("shiptoContactEmail")
              });
            }

            purchaseOrder.setIfExists(attrs);

            // Add it to our sales order collection.
            children.add(purchaseOrder);
          };

        // Start by looking for a default item source
        options = {
          query: {
            parameters: [
              {attribute: "item", value: item},
              {attribute: "isDefault", value: true}
            ]
          },
          success: afterFetchDefaultSource
        };
        itemSources.fetch(options);
      },

      createPurchaseRequest: function () {
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
          isRequestOrder = function (order) {
            if (order.recordType === "XM.PurchaseRequest" &&
              !order.isDestroyed()) {
              return true;
            }
          };

        // Get some reference information.
        childOrder = this.get("childOrder");
        orderNumber = salesOrder.get("number");
        status = XM.PurchaseRequest.OPEN_STATUS;

        // Determine the next sub number.
        orders = children.filter(isRequestOrder);
        numbers = _.pluck(_.pluck(orders, "attributes"), "subNumber");
        subNumber = numbers.length ? _.max(numbers) + 1 : 1;

        // Create the purchase request.
        model = new XM.PurchaseRequest(null, {isNew: true});
        model.set({
          uuid: childOrder.id,
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
          editorKey: childOrder.id,
          orderNumber: model.formatNumber(),
          status: status
        });
      },

      destroyPurchaseOrderLine: function () {
        var childOrder = this.get("childOrder"),
         Klass = XM.PurchaseOrderLine,
         line = Backbone.Relational.store.find(Klass, childOrder.id),
         purchaseOrder = line.get("purchaseOrder"),
         lineItems;

        line.destroy({validate: false});
        lineItems = purchaseOrder.get("lineItems").filter(function (lineItem) {
          return !lineItem.isDestroyed();
        });
        if (!lineItems.length) {
          purchaseOrder.destroy();
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

      formatOrderType: function () {
        var orderType = this.getOrderType();

        return orderType ? this.childTypes[orderType].localize : "";
      },

      getOrderType: function () {
        var K = XM.SalesOrderLineChild,
          childOrder = this.get("childOrder"),
          itemSite = this.getValue("itemSite"),
          childTypes = this.childTypes,
          ret;

        if (childOrder) {
          return childOrder.get("orderType");
        } else if (itemSite) {
          ret = _.find(_.keys(childTypes), function (key) {
            if (itemSite.get(childTypes[key].autoCreate)) {
              return true;
            }
          });
        }
        return ret || false;
      },

      handleChildOrder: function () {
        var K = XM.SalesOrderLineChild,
          quantity = this.get("quantity"),
          childOrder = this.get("childOrder"),
          orderType = this.getOrderType(),
          Klass;

        if (orderType) {
          Klass = this.childTypes[orderType].recordType;
          Klass = XT.getObjectByName(Klass);
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
          itemSite: null,
          isDropShip: false
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
            type: XM.Model.QUESTION,
            callback: callback
          });
        }
      }

    });

    // Need to handle quantity change in a specific order
    // Because of potential user invoked callbacks on original
    // function and this monkey patch.
    var _proto = XM.SalesOrderLine.prototype,
      _destroy = _proto.destroy,
      _quantityChanged = _proto.quantityChanged;

    _.extend(_proto, {
      destroy: function (options) {
        var atShipping = this.get("atShipping"),
          shipped = this.get("shipped"),
          K = XM.SalesOrder,
          that = this,
          payload = {},
          args = arguments,
          message;

        if (atShipping) {
          message = "_lineItemAtShipping".loc();
        } else if (shipped) {
          message = "_lineItemHasShipmentsClose?".loc();
          payload.type = K.QUESTION;
          payload.callback = function (response) {
            if (response.answer) {
              that.set("status", K.CLOSED_STATUS);
            }
          };
        } else {
          return _destroy.apply(this, arguments);
        }

        this.notify(message, payload);
      },

      quantityChanged: function () {
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
            type: XM.Model.QUESTION,
            callback: callback
          });
        } else {
          this.autoCreateOrder();
          _quantityChanged.apply(this, arguments);
        }
      }
    });

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
          proto = XM.SalesOrderLine.prototype,
          Klass = proto.childTypes[orderType].recordType,
          order;

        Klass = XT.getObjectByName(Klass);
        order = Backbone.Relational.store.find(Klass, this.id);

        if (order) {
          order.set("dueDate", dueDate, {validate: false});
        }
      },

      formatOrderType: function () {
        var proto = XM.SalesOrderLine.prototype,
          orderType = this.get("orderType"),
          map = proto.childTypes[orderType];

        return map.localizeShort || map.localize;
      },

      formatStatus: function () {
        var proto = XM.SalesOrderLine.prototype,
          orderType = this.get("orderType"),
          Klass = proto.childTypes[orderType].recordType,
          order;

        Klass = XT.getObjectByName(Klass);
        order = Backbone.Relational.store.find(Klass, this.id);
        return order ? order.formatStatus() : "";
      },

      quantityChanged: function () {
        var quantity = this.get("quantity"),
          orderType = this.get("orderType"),
          proto = XM.SalesOrderLine.prototype,
          Klass = proto.childTypes[orderType].recordType,
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
