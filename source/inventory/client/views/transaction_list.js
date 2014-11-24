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
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "lineNumber"},
                {kind: "XV.ListAttr", attr: "itemSite.item.number", fit: true},
                {kind: "XV.ListAttr", attr: "itemSite.site.code",
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1",
                fit: true,  style: "text-indent: 18px;"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "ordered",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "received",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "balance",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "atReceiving",
                onValueChange: "atReceivingChanged",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", components: [
              {kind: "XV.ListAttr", attr: "scheduleDate", placeholder: "_noSchedule".loc(),
                formatter: "formatScheduleDate", style: "text-align: right"}
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
          method: "returnItem", notify: false, isViewMethod: true}
      ],
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-list-header",
          components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {content: "_number".loc()},
            {content: "_description".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_unit".loc()},
            {content: "_ordered".loc()},
            {content: "_atShipping".loc()}
          ]},
          {kind: "XV.ListColumn", fit: true, components: [
            {content: "_site".loc()},
            // XXX width -- TC55 quirk
            {content: "_scheduleDate".loc(), style: "width:200px;"},
            {content: "_balance".loc()}
          ]}
        ]}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "XV.ListAttr", attr: "lineNumber"},
              {kind: "XV.ListAttr", attr: "itemSite.item.number"},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "unit.name"},
              {kind: "XV.ListAttr", attr: "ordered", formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "atShipping", formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", fit: true, components: [
              {kind: "XV.ListAttr", attr: "itemSite.site.code"},
              {kind: "XV.ListAttr", attr: "scheduleDate",
                placeholder: "_noSchedule".loc(), formatter: "formatScheduleDate"},
              {kind: "XV.ListAttr", attr: "balance", formatter: "formatQuantity"}
            ]}
          ]}
        ]}
      ],

      fetch: function () {
        this.setShipment(null);
        this.inherited(arguments);
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

  };

}());
