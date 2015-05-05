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
          isViewMethod: true, prerequisite: "canPrintLabels"}
      ],
      status: null,
      transFunction: "receipt",
      transModule: XM.Inventory,
      transWorkspace: "XV.EnterReceiptWorkspace",
      components: [
        {name: 'divider', classes: 'xv-list-divider', fit: true},
        {kind: "XV.ListItem", name: "listItem", fit: true, components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListAttr", name: "status", attr: "formatStatus", formatter: "formatStatus"},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", name: "itemNumber", attr: "itemSite.item.number",
                style: "font-size: medium;"},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1", classes: "label-below",
                style: "padding-top: 0px; padding-left: 5px;"},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListColumn", classes: "short", components: [
                  {kind: "XV.ListAttrLabeled", attr: "formatTrace", label: "_lot".loc()}
                ]},
                {kind: "XV.ListColumn", classes: "short", components: [
                  {kind: "XV.ListAttrLabeled", attr: "formatLocation", label: "_location".loc()}
                ]}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttrLabeled", attr: "balance", formatter: "formatQuantity",
                style: "font-size: medium;", label: "_balance".loc()},
              {kind: "XV.ListAttrLabeled", attr: "atReceiving", formatter: "formatQuantity",
                label: "_atReceiving".loc(), onValueChange: "atReceivingChanged"}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttrLabeled", attr: "unit.name", label: "_unit".loc()},
              {kind: "XV.ListAttrLabeled", attr: "itemSite.site.code", label: "_site".loc()}

            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              //TODO : {tag: "br", content: ""},
              {kind: "XV.ListAttrLabeled", attr: "scheduleDate", label: "_scheduled".loc()}
            ]}
            /**
              - Additional requested columns:
              - "qohOtherWhs"
            */
          ]}
        ]}
      ],
      atReceivingChanged: function () {
        this.doAtReceivingChanged();
      },
      // Enable the post button if a model in the list has qty to receive
      setupItem: function (inSender, inEvent) {
        this.inherited(arguments);
        var hasQtyToReceive = _.find(this.value.models, function (model) {
          return model.getValue("atReceiving") > 0;
        });
        if (hasQtyToReceive) {
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
        {name: "print", label: "_printLabel".loc(), method: "doPrint", isViewMethod: true,
          notify: false, prerequisite: "canPrintLabels"}
      ],
      components: [
        {name: 'divider', classes: 'xv-list-divider', },
        {kind: "XV.ListItem", name: "listItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListAttr", name: "status", attr: "formatStatus", formatter: "formatStatus"},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", name: "itemNumber", attr: "itemSite.item.number",
                style: "font-size: medium;"},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1", classes: "label-below",
                style: "padding-top: 0px; padding-left: 5px;"},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListColumn", classes: "short", components: [
                  {kind: "XV.ListAttrLabeled", attr: "formatTrace", label: "_lot".loc()}
                ]},
                {kind: "XV.ListColumn", classes: "medium", components: [
                  {kind: "XV.ListAttrLabeled", attr: "formatLocation", label: "_location".loc()}
                ]}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttrLabeled", attr: "balance", formatter: "formatQuantity",
                style: "font-size: medium;", label: "_balance".loc()},
              {kind: "XV.ListAttrLabeled", attr: "atShipping", formatter: "formatQuantity",
                label: "_issued".loc()}
            ]},
            {kind: "XV.ListColumn", classes: "line-number", components: [
              {kind: "XV.ListAttrLabeled", attr: "unit.name", label: "_unit".loc()},
              {kind: "XV.ListAttrLabeled", attr: "itemSite.site.code", label: "_site".loc()}

            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              //TODO : {tag: "br", content: ""},
              {kind: "XV.ListAttrLabeled", attr: "scheduleDate", label: "_scheduled".loc()}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttrLabeled", attr: "qohOtherWhs", label: "_qohOther".loc(),
                formatter: "formatQohOther", showing: false}
            ]}
          ]}
        ]}
      ],
      fetch: function () {
        this.setShipment(null);
        this.inherited(arguments);
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
