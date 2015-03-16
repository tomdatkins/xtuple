/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.inventory.initTransactionList = function () {


    // ..........................................................
    // ENTER RECEIPT
    //
    enyo.kind({
      name: "XV.EnterReceiptList",
      kind: "XV.TransactionList",
      label: "_enterReceipt".loc(),
      collection: "XM.EnterReceiptCollection",
      parameterWidget: "XV.EnterReceiptParameters",
      query: {
        orderBy: [{attribute: "lineNumber", numeric: true}]
      },
      showDeleteAction: false,
      events: {
        onAtReceivingChanged: ""
      },
      actions: [
        {name: "enterReceipt", prerequisite: "canReceiveItem",
          // method is defined on XV.TransactionList
          method: "transactItem", notify: false, isViewMethod: true},
        {name: "receiveLine", prerequisite: "canReceiveItem",
          // method is defined on XV.TransactionList
          method: "transactLine", notify: false, isViewMethod: true},
        {name: "print", label: "_printLabel".loc(), notify: false, method: "doPrint",
          isViewMethod: true, prerequisite: "canPrintLabels", modelName: "XM.EnterReceipt"}
      ],
      published: {
        status: null,
        transFunction: "receipt",
        transModule: XM.Inventory,
        transWorkspace: "XV.EnterReceiptWorkspace"
      },
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-list-header",
          components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {content: "_line".loc()},
            {content: "_number".loc()},
            {content: "_description".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_unit".loc()},
            {content: "_ordered".loc()},
            {content: "_atReceiving".loc()}
          ]},
          {kind: "XV.ListColumn", components: [
            {content: "_site".loc()},
            {content: "_received".loc()},
            {content: "_balance".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_schedDate".loc()},
            {content: "_returned".loc()}
          ]}
        ]}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "XV.ListAttr", attr: "lineNumber"},
              {kind: "XV.ListAttr", attr: "itemSite.item.number", style: "font-weight: bold"},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "unit.name"},
              {kind: "XV.ListAttr", attr: "ordered",
                formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "atReceiving", onValueChange: "atReceivingChanged",
                formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", components: [
              {kind: "XV.ListAttr", attr: "itemSite.site.code"},
              {kind: "XV.ListAttr", attr: "received"},
              {kind: "XV.ListAttr", attr: "balance",
                formatter: "formatQuantity", style: "font-weight: bold"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "scheduleDate", placeholder: "_noSchedule".loc(),
                formatter: "formatScheduleDate", style: "text-align: right"},
              {kind: "XV.ListAttr", attr: "returned"}
            ]}
          ]}
        ]}
      ],
      formatScheduleDate: function (value, view, model) {
        var today = new Date(),
          isLate = XT.date.compareDate(value, today) < 1 &&
            model.get("balance") > 0;
        view.addRemoveClass("error", isLate);
        return value ? Globalize.format(value, "d") : "";
      },
      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      atReceivingChanged: function () {
        this.doAtReceivingChanged();
      },
      setupItem: function (inSender, inEvent) {
        this.inherited(arguments);
        var hasQtyToReceive = _.compact(_.pluck(_.pluck(this.getValue().models, "attributes"), "atReceiving"));
        if (hasQtyToReceive.length > 0) {
          this.doAtReceivingChanged();
        }
      }
    });

    XV.registerModelList("XM.PurchaseOrderRelation", "XV.PurchaseOrderLine");

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueToShippingList",
      kind: "XV.TransactionList",
      label: "_issueToShipping".loc(),
      collection: "XM.IssueToShippingCollection",
      parameterWidget: "XV.IssueToShippingParameters",
      query: {orderBy: [
        {attribute: "lineNumber"},
        {attribute: "subNumber"}
      ]},
      published: {
        shipment: null,
        transFunction: "issueToShipping",
        transModule: XM.Inventory,
        transWorkspace: "XV.IssueStockWorkspace"
      },
      actions: [
        {name: "issueItem", prerequisite: "canIssueItem",
          // method is defined on XV.TransactionList
          method: "transactItem", notify: false, isViewMethod: true},
        {name: "issueLine", prerequisite: "canIssueLine",
          // method is defined on XV.TransactionList
          method: "transactLine", notify: false, isViewMethod: true},
        {name: "returnLine", prerequisite: "canReturnItem",
          // method is defined on XV.TransactionList
          method: "returnItem", notify: false, isViewMethod: true},
        {name: "print", label: "_printLabel".loc(), notify: false, method: "doPrint",
          isViewMethod: true, prerequisite: "canPrintLabels", modelName: "XM.IssueToShipping"}
      ],
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-list-header",
          components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {kind: "FittableColumns", components: [
              {content: "_line".loc()},
              {content: "_qoh".loc(), style: "text-align-right"}
            ]},
            {content: "_number".loc()},
            {content: "_description".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_qoh+Unit".loc()},
            {content: "_ordered".loc()},
            {content: "_atShipping".loc()}
          ]},
          {kind: "XV.ListColumn", components: [
            {content: "_site".loc()},
            {content: "_schedDate".loc()},
            {content: "_balance".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_location".loc()},
            {content: "_lot".loc()},
            {content: "_qty".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_qohOther".loc()}
          ]}
        ]}
      ],
      components: [
        {kind: "XV.ListItem", name: "listItem", components: [
          {kind: "FittableColumns", name: "fittableColumns", components: [
            {kind: "XV.ListColumn", components: [
              {kind: "onyx.Checkbox", attr: "itemScanned", name: "itemScanned", showLabel: false},
              {kind: "XV.CheckboxWidget", attr: "traceScanned", name: "traceScanned", 
                showLabel: false, disabled: false},
              {kind: "onyx.Checkbox", attr: "traceScanned", name: "traceScanned", showLabel: false},
              {kind: "onyx.Checkbox", attr: "locationScanned", name: "locationScanned", showLabel: false}
            ]},
            {kind: "XV.ListColumn", components: [
              {kind: "XV.ListAttr", attr: "itemSite.item.number", style: "font-weight: bold"},
              {kind: "XV.ListAttr", attr: "fifoTrace", name: "fifoTrace",
                style: "font-weight: bold", placeholder: "_na".loc(), formatter: "formatFifo"},
              {kind: "XV.ListAttr", attr: "fifoLocation", style: "font-weight: bold", name: "fifoLocation",
                classes: "emphasis", placeholder: "_na".loc(), formatter: "formatFifo"}
              
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "itemSite.item.description1"},
              {kind: "XV.ListAttr", attr: "unit.name", formatter: "formatQoh", style: "font-weight: bold"}
              //{kind: "XV.ListAttr", attr: "ordered", formatter: "formatQuantity"},
              //{kind: "XV.ListAttr", attr: "atShipping", formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", components: [
              {kind: "XV.ListAttr", attr: "itemSite.site.code"},
              {kind: "XV.ListAttr", attr: "scheduleDate",
                placeholder: "_noSchedule".loc(), formatter: "formatScheduleDate"},
              {kind: "XV.ListAttr", attr: "balance", formatter: "formatQuantity",
                style: "font-weight: bold"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "fifoQuantity", name: "fifoQuantity", formatter: "formatFifoQuantity"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", name: "qohColumn", components: [
              {kind: "XV.ListAttr", attr: "qohOtherWhs", name: "qoh"}
            ]}
          ]}
        ]}
      ],
      fetch: function () {
        this.setShipment(null);
        this.inherited(arguments);
      },
      fetched: function (collection, data, options) {
        this.inherited(arguments);
        // Refresh model to disp. fifoDetail meta attribute which was set after list rendered.
        this.refreshModel();
      },
      formatFifo: function (value, view, model) {
        if (view.attr === "fifoLocation") {
          var locationScan = model.getValue("locationScan");
          if (locationScan) {
            value = locationScan;
          } else if (value && value !== view.placeholder) {
            value = value.format();
          }
        } else if (view.attr === "fifoTrace") {
          var traceScan = model.getValue("traceScan");
          if (traceScan) {
            value = traceScan;
          }
        }
        return value;
      },
      formatFifoQuantity: function (value, view, model) {
        //TODO - Only display (in red) if qty < required. Else if scanned attributes, don't display.
        return value;
      },

      formatLocation: function (value, view, model) {
        if (value && value !== view.placeholder) {
          return value.format();
        }
        return value;
      },
      formatScheduleDate: function (value, view, model) {
        var today = new Date(),
          isLate = XT.date.compareDate(value, today) < 1 &&
            model.get("balance") > 0;
        view.addRemoveClass("error", isLate);
        return value ? Globalize.format(value, "d") : "";
      },
      formatLineNumber: function (value, view, model) {
        var lineNumber = model.get("lineNumber"),
          subnumber = model.get("subNumber");
        if (subnumber === 0) {
          value = lineNumber;
        } else {
          value = lineNumber + "." + subnumber;
        }
        return value;
      },
      formatQoh: function (value, view, model) {
        if (value) {
          var scale = XT.locale.quantityScale,
            qoh = Globalize.format(model.getValue("itemSite.quantityOnHand"), "n" + scale);
          return  qoh + " - " + value;
        }
      },
      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      orderChanged: function () {
        this.doOrderChanged({order: this.getOrder()});
      },
      /**
        Overload: used to keep track of shipment.
      */
      setupItem: function (inSender, inEvent) {
        this.inherited(arguments);

        // In mocha there is no inEvent.index
        if (inEvent.index === undefined) {return; }
        var collection = this.getValue(),
          listShipment = collection.at(inEvent.index).get("shipment"),
          listShipmentId = listShipment ? listShipment.id : false,
          shipment = this.getShipment(),
          shipmentId = shipment ? shipment.id : false;
        if (listShipmentId !== shipmentId) {
          this.setShipment(listShipment);
          // Update all rows to match
          _.each(collection.models, function (model) {
            model.set("shipment", listShipment);
          });
        }
      },
      shipmentChanged: function () {
        this.doShipmentChanged({shipment: this.getShipment()});
      }
      /* TODO - create issueLineBalanceToShipping dispatch function
      transactLine: function () {
        var models = this.selectedModels();
        this.transact(models, null, "issueLineBalanceToShipping");
      }*/
    });


    // ..........................................................
    // ISSUE TO SHIPPING SCANNING
    //
    /* TODO 
    var extensions = [
      {kind: "XV.ListColumn", container: "fittableColumns",
        addBefore: "firstColumn", components: [
        {kind: "onyx.Checkbox", attr: "scanAttrs.item.scanned", name: "itemScanned", classes: 'xv-list-item'},
        {kind: "onyx.Checkbox", attr: "traceScanned", name: "traceScanned", classes: 'xv-list-item'},
        {kind: "onyx.Checkbox", attr: "locationScanned", name: "locationScanned"}
      ]}
    ];

    XV.appendExtension("XV.IssueToShippingList", extensions);
    */
  };

}());
