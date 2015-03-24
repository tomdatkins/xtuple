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
          {kind: "XV.ListColumn", style: "padding-left: 0px;", components: [
            {kind: "enyo.Checkbox", checked: true, disabled: true}
          ]},
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
      fit: true,
      transFunction: "issueToShipping",
      transModule: XM.Inventory,
      transWorkspace: "XV.IssueStockWorkspace",
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
      components: [
        {name: 'divider', classes: 'xv-list-divider', fit: true},
        {kind: "XV.ListItem", name: "listItem", fit: true, components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListAttr", name: "status", attr: "formatStatus", formatter: "formatStatus"},
            {kind: "XV.ListColumn", classes: "medium", components: [
              {kind: "XV.ListAttr", name: "itemNumber", attr: "itemSite.item.number", style: "font-size: medium;"},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1", classes: "label-below", style: "padding-top: 0px; padding-left: 5px;"},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListColumn", classes: "short", components: [
                  {kind: "XV.ListAttrLabeled", attr: "fifoLocation", formatter: "formatFifo",
                    label: "_location".loc()}
                ]},
                {kind: "XV.ListColumn", classes: "short", components: [
                  {kind: "XV.ListAttrLabeled", attr: "fifoTrace", formatter: "formatFifo",
                    label: "_lot".loc()},
                ]}
              ]}
            ]},
            {kind: "XV.ListColumn", style: "width: 75px;", components: [
              {kind: "XV.ListAttrLabeled", attr: "balance", formatter: "formatQuantity", style: "font-size: medium;",
                label: "_balance".loc()},
              {kind: "XV.ListAttrLabeled", attr: "atShipping", formatter: "formatQuantity",
                label: "_issued".loc()}
            ]},
            {kind: "XV.ListColumn", style: "width: 35px;", components: [
              {kind: "XV.ListAttrLabeled", attr: "unit.name", label: "_unit".loc()},
              {kind: "XV.ListAttrLabeled", attr: "itemSite.site.code", label: "_site".loc()}
              
            ]},
            {kind: "XV.ListColumn", fit: false, style: "width: 75px;", components: [
              //TODO : {tag: "br", content: ""},
              {kind: "XV.ListAttrLabeled", attr: "scheduleDate", label: "_scheduled".loc()}
            ]}
            /**
              - Additional requested columns:
              - "qohOtherWhs" - this should be a meta attribute
            */
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
      /**
        Replace FIFO attributes with scanned data
      */
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
      formatStatus: function (value, view, model) {
        var color = model.getValue("metaStatus").color;
        view.addStyles("color: " + color + "; font-size: 32px; text-align: center; " + 
          "vertical-align: middle; width: 32px; padding-bottom: 0px;");
        return value;
      },
      orderChanged: function () {
        this.doOrderChanged({order: this.getOrder()});
      },
      /**
        Overload: used to keep track of shipment,
          and handle div bars.
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
  };

}());
