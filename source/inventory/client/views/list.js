/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true, Backbone:true*/

(function () {

  XT.extensions.inventory.initLists = function () {

    // ..........................................................
    // ACTIVITY
    //
    var _actions = XV.ActivityList.prototype.activityActions,
      _shipMethod = function (inSender, inEvent) {
        if (!XT.session.privileges.get("IssueStockToShipping")) {
          inEvent.message = "_insufficientPrivileges";
          inEvent.type = XM.Model.CRITICAL;
          this.doNotify(inEvent);
          return;
        }
        inEvent.key = inEvent.model.get("parent").id;
        inEvent.kind = "XV.IssueToShipping";
        this.bubbleUp("onTransactionList", inEvent, inSender);
      },
      _receiveMethod = function (inSender, inEvent) {
        if (!XT.session.privileges.get("EnterReceipts")) {
          inEvent.message = "_insufficientPrivileges";
          inEvent.type = XM.Model.CRITICAL;
          this.doNotify(inEvent);
          return;
        }
        inEvent.key = inEvent.model.get("parent").id;
        inEvent.kind = "XV.EnterReceipt";
        this.bubbleUp("onTransactionList", inEvent, inSender);
      };

    _actions.push({activityType: "SalesOrderWorkflow",
      activityAction: XM.SalesOrderWorkflow.TYPE_PACK,
      method: _shipMethod
    });

    _actions.push({activityType: "SalesOrderWorkflow",
      activityAction: XM.SalesOrderWorkflow.TYPE_SHIP,
      method: _shipMethod
    });

    _actions.push({activityType: "TransferOrderWorkflow",
      activityAction: XM.TransferOrderWorkflow.TYPE_PACK,
      method: _shipMethod
    });

    _actions.push({activityType: "TransferOrderWorkflow",
      activityAction: XM.TransferOrderWorkflow.TYPE_POST_RECEIPTS,
      method: _receiveMethod
    });

    _actions.push({activityType: "TransferOrderWorkflow",
      activityAction: XM.TransferOrderWorkflow.TYPE_RECEIVE,
      method: _receiveMethod
    });

    _actions.push({activityType: "TransferOrderWorkflow",
      activityAction: XM.TransferOrderWorkflow.TYPE_SHIP,
      method: _shipMethod
    });

    _actions.push({activityType: "PurchaseOrderWorkflow",
      activityAction: XM.PurchaseOrderWorkflow.TYPE_RECEIVE,
      method: _receiveMethod
    });

    _actions.push({activityType: "PurchaseOrderWorkflow",
      activityAction: XM.PurchaseOrderWorkflow.TYPE_POST_RECEIPTS,
      method: _receiveMethod
    });

    // ..........................................................
    // INVENTORY AVAILABILITY
    //

    XV.InventoryAvailabilityMixin = {
      actions: [
        {name: "createPurchaseOrder", isViewMethod: true, notify: false,
          prerequisite: "canCreatePurchaseOrders",
          privilege: "MaintainPurchaseOrders",
          label: "_purchase".loc()},
        {name: "openItem", isViewMethod: true, notify: false,
          privilege: "ViewItemMasters MaintainItemMasters"},
        {name: "openItemSite", isViewMethod: true, notify: false,
          privilege: "ViewItemSites MaintainItemSites"}
      ],
      createPurchaseOrder: function (inEvent) {
        var itemSources = new XM.ItemSourceCollection(),
          model = this.getModel(inEvent.index),
          item = model.get("item"),
          site = model.get("site"),
          that = this,
          itemSource,
          orderNumber,
          workspace,
          purchaseOrder,
          vendor,
          options,

          // If we have a default item source, make a P/O from
          // that, otherwise present a search list
          afterFetchDefaultSource = function () {
            var list;

            if (itemSources.length) {
              findUnreleased(itemSources.first());
            } else {
              // Select an item source
              list = new XV.ItemSourceList();
              that.doSearch({
                list: "XV.ItemSourceList",
                callback: findUnreleased,
                parameterItemValues: [{name: "item", showing: false}],
                conditions: [{attribute: "item", value: item}]
              });
            }
          },

          // See if there's an existing purchase order for the item source.
          findUnreleased = function (resp) {
            var dispatch = XM.Model.prototype.dispatch,
              options = {success: afterFind};

            // Bail if no item source found or selected
            if (!resp) { return; }

            itemSource = resp;
            dispatch("XM.PurchaseOrder", "findUnreleased", itemSource.id, options);
          },

          // If we found a purchase order, ask the user if they want to use it.
          afterFind = function (resp) {
            var message,
              inEvent;

            if (resp) {
              orderNumber = resp;
              message = "_useExistingPurchaseOrder?".loc();
              message = message.replace("{vendor}", itemSource.getValue("vendor.number"));
              inEvent = {
                type: XM.Model.QUESTION,
                message: message,
                callback: afterNotify
              };
              that.doNotify(inEvent);
            } else {
              doWorkspace();
            }
          },

          // Create the purchase order workspace, passing the found order
          // number contingent on user response.
          afterNotify = function (resp) {
            doWorkspace(resp.answer ? orderNumber : null);
          },

          // Launch the Purchase Order workspace.
          doWorkspace = function (id) {
            that.doWorkspace({
              workspace: "XV.PurchaseOrderWorkspace",
              id: id,
              success: populateOrder,
              callback: done
            });
          },

          // Populate the order with our new information.
          populateOrder = function () {
            var options = {};

            workspace = this;
            purchaseOrder = workspace.getValue();

            // If it's new, we need to resolve and set the vendor
            if (purchaseOrder.isNew()) {
              vendor = new XM.PurchaseVendorRelation();
              options.id = itemSource.get("vendor").id;
              options.success = setVendor;
              vendor.fetch(options);

            // Otherwise add the new line item now
            } else {
              addItemSource();
            }
          },

          setVendor = function () {
            purchaseOrder.set("vendor", vendor);
            addItemSource();
          },

          addItemSource = function () {
            var options =  {isNew: true},
              purchaseOrderLine = new XM.PurchaseOrderLine(null, options),
              lineItems = purchaseOrder.get("lineItems"),
              lineItemBox = workspace.$.purchaseOrderLineItemBox;

            lineItems.add(purchaseOrderLine);
            purchaseOrderLine.set("itemSource", itemSource);
            purchaseOrderLine.set("site", site);
            lineItemBox.gridRowTapEither(lineItems.length - 1, 0);
            lineItemBox.$.editableGridRow.$.quantityWidget.focus();
          },

          done = this.doneHelper(inEvent);

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
      formatAvailable: function (value, view, model) {
        var onHand = model.get("onHand"),
          available = model.get("available"),
          reorderLevel = model.get("reorderLevel"),
          useParameters = model.get("useParameters"),
          warn = useParameters && available > 0 && available <= reorderLevel;

        view.addRemoveClass("warn", warn);

        return this.formatQuantity(value, view, model);
      },
      /**
        Special over-ride because the item we're opening is not the same kind
        of object we have in the list.
      */
      itemTap: function (inSender, inEvent) {
        var model = this.getModel(inEvent.index),
          canNotRead = !model.getClass().canRead(),
          afterFetch = function () {
            var workspace = this, // just for readability
              site = model.get("site"),
              workbenchModel = workspace.getValue();

            // Set site after load item workbench, which includes
            // a collection of sites, one of which can then be
            // selected.
            workbenchModel.setValue("site", site);
          };

        if (!this.getToggleSelected() || inEvent.originator.isKey) {
          // Check privileges first
          if (canNotRead) {
            this.showError("_insufficientViewPrivileges".loc());
            return true;
          }

          this.doWorkspace({
            workspace: "XV.ItemWorkbenchWorkspace",
            id: model.get("item"),
            success: afterFetch
          });
          return true;
        }
      },
      openItemSite: function (inEvent) {
        var itemSite = this.getModel(inEvent.index),
          afterDone = this.doneHelper(inEvent);

        this.doWorkspace({
          workspace: "XV.ItemSiteWorkspace",
          id: itemSite.id,
          callback: afterDone
        });
      }
    };

    /**
      This list is notable because it implements a local filter
      that filters the result on the client if the parameters for displaying
      shortages or reorder levels are selected.

      This design is primarily to prevent serious performance degradation
      of lazy loading that would occur if any attempt were made calculate
      availability on the server side. This solution should work adequately
      on item master lists that filter on hundreds or results or less. If
      thousands of results are being processed and there are complaints
      of sluggishness users should consider using MRP as an alternative,
      which allows batch processing of large quantities of records.

      @extends XV.InventoryAvailabilityMixin
    */
    enyo.kind(_.extend({
      name: "XV.InventoryAvailabilityList",
      kind: "XV.List",
      label: "_availability".loc(),
      collection: "XM.InventoryAvailabilityCollection",
      events: {
        onSearch: ""
      },
      query: {orderBy: [
        {attribute: 'item'},
        {attribute: 'site'}
      ]},
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-list-header",
          components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {content: "_item".loc()},
            {content: "_description".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_site".loc()},
            {content: "_onHand".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "quantity", components: [
            {content: "_leadTime".loc()},
            {content: "_available".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "quantity", components: [
            {content: "_allocated".loc()},
            {content: "_unalloc.".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "quantity", components: [
            {content: "_requests".loc()},
            {content: "_ordered".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "quantity", components: [
            {content: "_reorder".loc()},
            {content: "_orderTo".loc()}
          ]}
        ]}
      ],
      parameterWidget: "XV.InventoryAvailabilityListParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "XV.ListAttr", attr: "item", isKey: true},
              {kind: "XV.ListAttr", attr: "description1"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "site", fit: true},
              {kind: "XV.ListAttr", attr: "onHand",
                formatter: "formatOnHand"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity",
              components: [
              {kind: "XV.ListAttr", attr: "leadTime"},
              {kind: "XV.ListAttr", attr: "available",
                formatter: "formatAvailable"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity",
              components: [
              {kind: "XV.ListAttr", attr: "allocated"},
              {kind: "XV.ListAttr", attr: "unallocated"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity",
              components: [
              {kind: "XV.ListAttr", attr: "requests"},
              {kind: "XV.ListAttr", attr: "ordered"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity",
              components: [
              {kind: "XV.ListAttr", attr: "reorderLevel",
                placeholder: "_na".loc()},
              {kind: "XV.ListAttr", attr: "orderTo",
                placeholder: "_na".loc()}
            ]}
          ]}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        this.setFiltered(new Backbone.Collection());
      },
      filter: function (collection, data, options) {
        options = options ? _.clone(options) : {};
        var query = this.getQuery(),
          method = options.update ? 'update' : 'reset',
          parameters = query.parameters || [],
          filtered  = this.getFiltered(),
          reorderExceptions,
          shortages,
          models;

        shortages = _.isObject(_.find(parameters, function (param) {
          return param.attribute === "showShortages";
        }));

        reorderExceptions = _.isObject(_.find(parameters, function (param) {
          return param.attribute === "useParameters";
        }));

        if (shortages || reorderExceptions) {
          models = collection.filter(function (model) {
            var result = true;

            if (shortages) {
              result = model.get("available") < 0;
            } else if (reorderExceptions) {
              result = model.get("available") <= model.get("reorderLevel");
            }

            return result;
          });
        } else {
          models = collection.models;
        }

        filtered[method](models);

        return this;
      },
      formatOnHand: function (value, view) {
        var param = _.find(this.query.parameters, function (p) {
          return p.attribute === "lookAhead" && p.value === "byDates";
        });

        view.addRemoveClass("disabled", !_.isEmpty(param));
        return this.formatQuantity(value, view);
      },
      openItem: function (inEvent) {
        var item = this.getModel(inEvent.index).get("item"),
          afterDone = this.doneHelper(inEvent);

        this.doWorkspace({
          workspace: "XV.ItemWorkspace",
          id: item,
          callback: afterDone
        });
      }
    }, XV.InventoryAvailabilityMixin));

    // ..........................................................
    // ITEM
    //

    enyo.kind({
      name: "XV.TransferOrderItemList",
      kind: "XV.List",
      label: "_items".loc(),
      collection: "XM.TransferOrderItemListItemCollection",
      query: {orderBy: [
        {attribute: 'number'}
      ]},
      parameterWidget: "XV.TransferOrderItemListParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true},
                {kind: "XV.ListAttr", attr: "inventoryUnit.name", fit: true,
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", formatter: "formatDescription"}
            ]},
            {kind: "XV.ListColumn", classes: "second",
              components: [
              {kind: "XV.ListAttr", attr: "getItemTypeString", classes: "italic"},
              {kind: "XV.ListAttr", attr: "classCode.code"}
            ]},
            {kind: "XV.ListColumn", classes: "third", components: [
              {kind: "XV.ListAttr", attr: "isFractional", formatter: "formatFractional"}
            ]}
          ]}
        ]}
      ],
      formatFractional: function (value, view, model) {
        return value ? "_fractional".loc() : "";
      },
      formatDescription: function (value, view, model) {
        var descrip1 = model.get("description1") || "",
          descrip2 = model.get("description2") || "",
          sep = descrip2 ? " - " : "";
        return descrip1 + sep + descrip2;
      }
    });

    // ..........................................................
    // ORDER
    //

    enyo.kind({
      name: "XV.OrderList",
      kind: "XV.List",
      label: "_orders".loc(),
      collection: "XM.OrderListItemCollection",
      parameterWidget: "XV.OrderListParameters",
      query: {orderBy: [
        {attribute: "orderDate"},
        {attribute: "number"}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "orderType"},
                {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
                {kind: "XV.ListAttr", attr: "getOrderStatusString",
                  style: "padding-left: 24px"},
                {kind: "XV.ListAttr", attr: "scheduleDate",
                  formatter: "formatScheduleDate", classes: "right",
                  placeholder: "_noSchedule".loc()}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "sourceName", style: "padding-left: 36px"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "shiptoName", classes: "italic"},
              {kind: "XV.ListAttr", formatter: "formatShipto"}
            ]}
          ]}
        ]}
      ],
      formatScheduleDate: function (value, view, model) {
        var isLate = model && model.get("scheduleDate") &&
          (XT.date.compareDate(value, new Date()) < 1);
        view.addRemoveClass("error", isLate);
        return value ? Globalize.format(value, "d") : "";
      },
      formatShipto: function (value, view, model) {
        var city = model.get("shiptoCity"),
          state = model.get("shiptoState"),
          country = model.get("shiptoCountry");
        return XM.Address.formatShort(city, state, country);
      }
    });

    // ..........................................................
    // TRANSFER ORDER
    //

    /** @private */
    var _doTransactionList = function (inEvent, kind) {
      var index = inEvent.index,
        model = this.value.at(index),
        that = this,

        afterDone = function () {
          model.fetch({success: afterFetch});
        },

        afterFetch = function () {
          // This callback handles row rendering among
          // Other things
          inEvent.callback();
        };

      this.doTransactionList({
        kind: kind,
        key: model.get("uuid"),
        callback: afterDone
      });
    };

    enyo.kind({
      name: "XV.TransferOrderList",
      kind: "XV.List",
      label: "_transferOrders".loc(),
      collection: "XM.TransferOrderListItemCollection",
      parameterWidget: "XV.TransferOrderListParameters",
      actions: [
        {name: "issueToShipping", method: "issueToShipping",
          isViewMethod: true, notify: false,
          privilege: "IssueStockToShipping",
          prerequisite: "canIssueItem"},
        {name: "enterReceipt", method: "enterReceipt",
          isViewMethod: true, notify: false,
          privilege: "EnterReceipts",
          prerequisite: "canReceiveItem"}
      ],
      query: {orderBy: [
        {attribute: 'number'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
                {kind: "XV.ListAttr", attr: "getTransferOrderStatusString",
                  style: "padding-left: 24px"},
                {kind: "XV.ListAttr", attr: "scheduleDate",
                  formatter: "formatScheduleDate", classes: "right",
                  placeholder: "_noSchedule".loc()}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "sourceName"},
                {kind: "XV.ListAttr", attr: "shipVia",  classes: "right"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "destinationName"},
              {kind: "XV.ListAttr", formatter: "formatShipto"}
            ]}
          ]}
        ]}
      ],
      formatScheduleDate: function (value, view, model) {
        var isLate = model && model.get('scheduleDate') &&
          (XT.date.compareDate(value, new Date()) < 1);
        view.addRemoveClass("error", isLate);
        return value ? Globalize.format(value, "d") : "";
      },
      formatShipto: function (value, view, model) {
        var city = model.get("destinationCity"),
          state = model.get("destinationState"),
          country = model.get("destinationCountry");
        return XM.Address.formatShort(city, state, country);
      },
      enterReceipt: function (inEvent) {
        _doTransactionList.call(this, inEvent, "XV.EnterReceipt");
      },
      issueToShipping: function (inEvent) {
        _doTransactionList.call(this, inEvent, "XV.IssueToShipping");
      }
    });

    // ..........................................................
    // BACKLOG REPORT
    //

    enyo.kind({
      name: "XV.SalesOrderLineListItem",
      kind: "XV.List",
      label: "_backlog".loc(),
      collection: "XM.SalesOrderLineListItemCollection",
      query: {orderBy: [
        {attribute: "salesOrder.number"},
        {attribute: "lineNumber"},
        {attribute: "subNumber"}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableRows", components: [
            {kind: "FittableColumns", name: "header", classes: "header",
              headerAttr: "salesOrder.number", components: [
              {kind: "XV.ListColumn", classes: "short", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.number", isKey: true, classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "first", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.customer.name", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.shiptoName", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.scheduleDate", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.salesRep.name", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.total", formatter: "formatPrice",
                  classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "last", components: [
                {classes: "header"}
              ]}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListColumn", classes: "short", components: [
                {kind: "XV.ListAttr", attr: "lineNumber", formatter: "formatLineNumber"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "itemSite.item.number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "itemSite.item.description1"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.orderDate"},
                {kind: "XV.ListAttr", attr: "scheduleDate"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "quantity"},
                {kind: "XV.ListAttr", attr: "quantityUnit.name"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "quantityShipped"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "shipBalance", classes: "bold"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "price", formatter: "formatPrice"},
                {kind: "XV.ListAttr", attr: "priceUnit.name"}
              ]},
              {kind: "XV.ListColumn", components: [
                {kind: "XV.ListAttr", attr: "extendedPrice", formatter: "formatPrice",
                  classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatPrice: function (value, view, model) {
        var currency = model ? model.getValue("salesOrder.currency") : false,
          scale = XT.locale.salesPriceScale;
        return currency ? currency.format(value, scale) : "";
      },
      formatLineNumber: function (value, view, model) {
        var lineNumber = model.get("lineNumber"),
          subnumber = model.get("subnumber");
        if (subnumber === 0) {
          value = lineNumber;
        } else {
          value = lineNumber + "." + subnumber;
        }
        return value;
      }
    });

    // ..........................................................
    // INVENTORY HISTORY
    //

    enyo.kind({
      name: "XV.InventoryHistoryList",
      kind: "XV.List",
      label: "_history".loc(),
      collection: "XM.InventoryHistoryCollection",
      canAddNew: false,
      query: {orderBy: [
        {attribute: "transactionDate", descending: true},
        {attribute: "created", descending: true},
        {attribute: "uuid"}
      ]},
      parameterWidget: "XV.InventoryHistoryListParameters",
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-list-header",
          components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {content: "_item".loc()},
            {content: "_description".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_transDate".loc()},
            {content: "_quantity".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_site".loc()},
            {content: "_unit".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_orderType".loc()},
            {content: "_order#".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "medium", components: [
            {content: "_transType".loc()},
            {content: "_costMethod".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "quantity", components: [
            {content: "_qtyBefore".loc()},
            {content: "_qtyAfter".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_valueBefore".loc()},
            {content: "_valueAfter".loc()}
          ]}
        ]}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "XV.ListAttr", attr: "itemSite.item.number"},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "transactionDate"},
              {kind: "XV.ListAttr", attr: "quantity"}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttr", attr: "itemSite.site.code"},
              {kind: "XV.ListAttr", attr: "unit"}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttr", attr: "formatOrderType"},
              {kind: "XV.ListAttr", attr: "orderNumber"}
            ]},
            {kind: "XV.ListColumn", classes: "medium", components: [
              {kind: "XV.ListAttr", attr: "formatTransactionType"},
              {kind: "XV.ListAttr", attr: "formatCostMethod"  },
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", attr: "quantityBefore",
                formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "quantityAfter",
                formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "costMethod",
                formatter: "formatCostMethod"},
              {kind: "XV.ListAttr", attr: "createdBy"},
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "valueBefore",
                formatter: "formatMoney"},
              {kind: "XV.ListAttr", attr: "valueAfter",
                formatter: "formatMoney"}
            ]}
          ]}
        ]},
      ]
    });

    XV.registerModelList("XM.InventoryHistory", "XV.InventoryHistoryList");

    // ..........................................................
    // INVOICE (and RETURN)
    // Add shipto to lists
    //
    if (XT.extensions.billing) {
      var shiptoMixin = {
        /**
          Returns formatted Shipto City, State and Country if
          Shipto Name exists, otherwise Billto location.
        */
        formatAddress: function (value, view, model) {
          var hasShipto = model.get("shiptoName") ? true : false,
            cityAttr = hasShipto ? "shiptoCity": "billtoCity",
            stateAttr = hasShipto ? "shiptoState" : "billtoState",
            countryAttr = hasShipto ? "shiptoCountry" : "billtoCountry",
            city = model.get(cityAttr),
            state = model.get(stateAttr),
            country = model.get(countryAttr);
          return XM.Address.formatShort(city, state, country);
        },
        /**
          Returns Shipto Name if one exists, otherwise Billto Name.
        */
        formatName: function (value, view, model) {
          return model.get("shiptoName") || model.get("billtoName");
        },
      };

      // stomp on core function
      _.extend(XV.ReturnList.prototype, shiptoMixin);

      // TODO: implement when we do Invoice:
      //_.extend(XV.InvoiceList.prototype, shiptoMixin);
    }

    // ..........................................................
    // LOCATION
    //

    enyo.kind({
      name: "XV.LocationList",
      kind: "XV.List",
      label: "_locations".loc(),
      collection: "XM.LocationCollection",
      query: {orderBy: [
        {attribute: "description"}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttr", attr: "format", isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "site.code"}
            ]},
            {kind: "XV.ListColumn", classes: "second left", components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "isRestricted"}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "isNetable"}
            ]}
          ]}
        ]}
      ]

    });

    XV.registerModelList("XM.Location", "XV.LocationList");
    XV.registerModelList("XM.LocationItem", "XV.LocationList");

    // ..........................................................
    // ITEM WORKBENCH HISTORY
    //

    enyo.kind({
      name: "XV.ItemWorkbenchHistoryList",
      kind: "XV.List",
      label: "_history".loc(),
      collection: "XM.InventoryHistoryCollection",
      canAddNew: false,
      query: {orderBy: [
        {attribute: "transactionDate", descending: true},
        {attribute: "created", descending: true},
        {attribute: "uuid"}
      ]},
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-list-header",
          components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_transDate".loc()},
            {content: "_quantity".loc(),
              style: "text-align: right;"}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_site".loc()},
            {content: "_unit".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_orderType".loc()},
            {content: "_order#".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "medium", components: [
            {content: "_transType".loc()},
            {content: "_costMethod".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "quantity", components: [
            {content: "_qtyBefore".loc()},
            {content: "_qtyAfter".loc()}
          ]}
        ]}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttr", attr: "transactionDate"},
              {kind: "XV.ListAttr", attr: "quantity",
                style: "text-align: right;"}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttr", attr: "itemSite.site.code"},
              {kind: "XV.ListAttr", attr: "unit"}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttr", attr: "formatOrderType"},
              {kind: "XV.ListAttr", attr: "orderNumber",
                placeholder: "_noOrder".loc()}
            ]},
            {kind: "XV.ListColumn", classes: "medium", components: [
              {kind: "XV.ListAttr", attr: "formatTransactionType"},
              {kind: "XV.ListAttr", attr: "formatCostMethod"  },
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", attr: "quantityBefore",
                formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "quantityAfter",
                formatter: "formatQuantity"}
            ]}
          ]}
        ]},
      ]
    });

    // ..........................................................
    // PURCHASE ORDER
    //

    if (XT.extensions.purchasing) {
      XV.PurchaseOrderList.prototype.enterReceipt = function (inEvent) {
        var index = inEvent.index,
          model = this.getValue().at(index),
          uuid = model.getValue("uuid");
        this.doWorkspace({kind: "XV.EnterReceipt", model: uuid});
      };

      var _purchaseOrderListActions = XV.PurchaseOrderList.prototype.actions;

      _purchaseOrderListActions.push({name: "enterReceipt", method: "enterReceipt",
          notify: false, prerequisite: "canReceiveItem", isViewMethod: true}
      );
    }

    // ..........................................................
    // SALES ORDER
    //

    XV.SalesOrderList.prototype.issueToShipping = function (inEvent) {
      var index = inEvent.index,
        model = this.getValue().at(index),
        uuid = model.getValue("uuid");
      this.doWorkspace({kind: "XV.IssueToShipping", model: uuid});
    };

    var _salesOrderListActions = XV.SalesOrderList.prototype.actions;

    _salesOrderListActions.push({name: "issueToShipping", method: "issueToShipping",
        notify: false, prerequisite: "canIssueItem", isViewMethod: true}
    );

    // ..........................................................
    // SHIPMENT
    //

    enyo.kind({
      name: "XV.ShipmentList",
      kind: "XV.List",
      label: "_shipments".loc(),
      collection: "XM.ShipmentListItemCollection",
      canAddNew: false,
      actions: [
        {name: "shipShipment", method: "shipShipment",
          isViewMethod: true, notify: false,
          privilege: "ShipOrders",
          prerequisite: "canShipShipment"},
        {name: "recallShipment", method: "doRecallShipment",
          prerequisite: "canRecallShipment",
          privilege: "RecallOrders",
          notifyMessage: "_recallShipment?".loc()},
        {name: "recallInvoicedShipment", method: "doRecallShipment",
          label: "_recallShipment".loc(),
          privilege: "RecallInvoicedShipment",
          prerequisite: "canRecallInvoicedShipment",
          notifyMessage: "_recallShipment?".loc()}
      ],
      query: {orderBy: [
        {attribute: "number", descending: true, numeric: true}
      ]},
      parameterWidget: "XV.ShipmentListItemParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
                {kind: "XV.ListAttr", formatter: "formatStatus",
                  style: "padding-left: 24px"},
                {kind: "XV.ListAttr", attr: "shipDate", classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "order.number"},
                {kind: "XV.ListAttr", attr: "shipVia",
                  classes: "right", placeholder: "_noShipVia".loc()}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "order.shiptoName", classes: "italic"},
              {kind: "XV.ListAttr", formatter: "formatShipto"}
            ]}
          ]}
        ]}
      ],
      formatStatus: function (value, view, model) {
        if (model.get("isInvoiced")) {
          return "_invoiced".loc();
        } else if (model.get("isShipped")) {
          return "_shipped".loc();
        }
        return "_open".loc();
      },
      formatShipto: function (value, view, model) {
        var order = model.get("order"),
          city = order && order.get("shiptoCity"),
          state = order && order.get("shiptoState"),
          country = order && order.get("shiptoCountry");
        return XM.Address.formatShort(city, state, country);
      },
      shipShipment: function (inEvent) {
        var index = inEvent.index,
          shipment = this.getValue().at(index),
          that = this,
          callback = function (resp) {
            var options = {
              success: function () {
                // Re-render the row if showing shipped, otherwise remove it
                var query = that.getQuery(),
                  param,
                  collection,
                  model;
                param = _.findWhere(query.parameters, {attribute: "isShipped"});
                if (param) {
                  collection = that.getValue();
                  model = collection.at(index);
                  collection.remove(model);
                  that.fetched();
                } else {
                  that.renderRow(index);
                }
              }
            };
            // Refresh row if shipped
            if (resp) { shipment.fetch(options); }
          };
        this.doWorkspace({
          workspace: "XV.ShipShipmentWorkspace",
          id: shipment.id,
          callback: callback
        });
      }
    });

    XV.registerModelList("XM.Shipment", "XV.ShipmentList");

    // ..........................................................
    // SITE EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.SiteEmailProfileList",
      kind: "XV.EmailProfileList",
      label: "_siteEmailProfiles".loc(),
      collection: "XM.SiteEmailProfileCollection"
    });

    // ..........................................................
    // TRACE SEQUENCE
    //

    enyo.kind({
      name: "XV.TraceSequenceList",
      kind: "XV.List",
      label: "_traceSequences".loc(),
      collection: "XM.TraceSequenceCollection",
      parameterWidget: "XV.TraceSequenceListParameters",
      query: {orderBy: [
        {attribute: 'number'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ]
    });

  };
}());