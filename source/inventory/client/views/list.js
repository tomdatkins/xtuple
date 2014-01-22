/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true*/

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

    XV.registerModelList("XM.ItemRelation", "XV.ItemList");

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
    // INVENTORY HISTORY REPORT
    //

    enyo.kind({
      name: "XV.InventoryHistoryList",
      kind: "XV.List",
      label: "_history".loc(),
      collection: "XM.InventoryHistoryCollection",
      canAddNew: false,
      query: {orderBy: [
        {attribute: "transactionDate", descending: true},
        {attribute: "uuid"}
      ]},
      parameterWidget: "XV.InventoryHistoryListParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "transactionDate"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "transactionType",
                formatter: "formatTransactionType"},
              {kind: "XV.ListAttr", attr: "itemSite.site.code"}
            ]},
            {kind: "XV.ListColumn", classes: "second left", components: [
              {kind: "XV.ListAttr", attr: "itemSite.item.number"},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "orderType",
                formatter: "formatOrderType"},
              {kind: "XV.ListAttr", attr: "orderNumber"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "unit"},
              {kind: "XV.ListAttr", attr: "quantity",
                formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "valueBefore",
                formatter: "formatMoney"},
              {kind: "XV.ListAttr", attr: "quantityBefore",
                formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "valueAfter",
                formatter: "formatMoney"},
              {kind: "XV.ListAttr", attr: "quantityAfter",
                formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "costMethod",
                formatter: "formatCostMethod"},
              {kind: "XV.ListAttr", attr: "user.username"}
            ]}
          ]}
        ]},
      ],
      formatCostMethod: function (value) {
        switch (value)
        {
        case XM.ItemSite.STANDARD_COST:
          return "_standard".loc();
        case XM.ItemSite.AVERAGE_COST:
          return "_average".loc();
        case XM.ItemSite.JOB_COST:
          return "_job".loc();
        case XM.ItemSite.NO_COST:
          return "_None".loc();
        default:
          return value;
        }
      },
      formatTime: function (value) {
        return Globalize.format(value, "t");
      },
      formatMoney: function (value, view) {
        view.addRemoveClass("error", value < 0);
        var scale = XT.locale.currencyScale;
        return Globalize.format(value, "c" + scale);
      },
      formatOrderType: function (value) {
        switch (value)
        {
        case "SO":
          return "_salesOrder".loc();
        case "PO":
          return "_purchaseOrder".loc();
        case "WO":
          return "_workOrder".loc();
        case "EX":
          return "_expense".loc();
        case "AD":
          return "_adjustment".loc();
        case "RX":
          return "_materialReceipt".loc();
        case "TO":
          return "_transferOrder".loc();
        case "Misc":
          return "_miscellaneous".loc();
        default:
          return value;
        }
      },
      formatQuantity: function (value, view) {
        view.addRemoveClass("error", value < 0);
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      formatTransactionType: function (value) {
        switch (value)
        {
        case "SH":
          return "_issueToShipping".loc();
        case "RS":
          return "_returnFromShipping".loc();
        case "IM":
          return "_issueMaterial".loc();
        case "CC":
          return "_cycleCount".loc();
        case "RP":
          return "_receivePurchaseOrder".loc();
        case "RM":
          return "_receiveMaterial".loc();
        case "EX":
          return "_expense".loc();
        case "AD":
          return "_adjustment".loc();
        case "RX":
          return "_materialReceipt".loc();
        case "TW":
          return "_siteTransfer".loc();
        case "RB":
          return "_receiveBreeder".loc();
        case "IB":
          return "_issueBreeder".loc();
        case "RL":
          return "_relocate".loc();
        case "RR":
          return "_receiveReturn".loc();
        default:
          return value;
        }
      }
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
