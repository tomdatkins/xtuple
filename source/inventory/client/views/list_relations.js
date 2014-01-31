/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, XM:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.inventory.initListRelations = function () {

    // ..........................................................
    // INVENTORY HISTORY DETAIL
    //

    enyo.kind({
      name: "XV.InventoryHistoryDetailListRelations",
      kind: "XV.ListRelations",
      orderBy: [

      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "XV.ListAttr", attr: "quantity",
                formatter: "formatDistQuantity"},
              {kind: "XV.ListAttr", attr: "location",
                formatter: "formatLocation"},
              {kind: "XV.ListAttr", attr: "trace.number",
                formatter: "formatTrace"},
              {kind: "XV.ListAttr", attr: "expiration",
                formatter: "formatExpiration"},
              {kind: "XV.ListAttr", attr: "purchaseWarranty",
                formatter: "formatPurchaseWarranty"}
            ]}
          ]}
        ]}
      ],
      formatExpiration: function (value, view) {
        var display = value &&
          !XT.date.compareDate(value, XT.date.startOfTime()) &&
          !XT.date.compareDate(value, XT.date.endOfTime());

        view.applyStyle("display", display ? "block" : "none");
        return display ? "_expiration".loc() + ": " + this.formatDate(value) : "";
      },
      formatLocation: function (value, view) {
        var display = !_.isEmpty(value);

        view.applyStyle("display", display ? "block" : "none");
        return display ? "_location".loc() + ": " + value.format() : "";
      },
      formatPurchaseWarranty: function (value, view) {
        var display = value &&
          !XT.date.compareDate(value, XT.date.startOfTime()) &&
          !XT.date.compareDate(value, XT.date.endOfTime());

        view.applyStyle("display", display ? "block" : "none");
        return display ? "_purchaseWarranty".loc() + ": " + this.formatDate(value) : "";
      },
      formatDistQuantity: function (value, view) {
        return "_quantity".loc() + ": " + this.formatQuantity(value, view);
      },
      formatTrace: function (value, view, model) {
        var controlMethod =
          model.getValue("inventoryHistory.itemSite.controlMethod"),
          K = XM.ItemSite,
          display = false;

        if (controlMethod === K.LOT_CONTROL) {
          value = "_lot".loc() + ": " + value;
          display = true;
        } else if (controlMethod === K.SERIAL_CONTROL) {
          value = "_serial#".loc() + ": " + value;
          display = true;
        }

        view.applyStyle("display", display ? "block" : "none");
        return value;
      }
    });

    // ..........................................................
    // ISSUE TO SHIPPING DETAIL
    //

    enyo.kind({
      name: "XV.IssueStockDetailListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "aisle"},
        {attribute: "rack"},
        {attribute: "bin"},
        {attribute: "location"}
      ],
      multiSelect: true,
      parentKey: "itemSite",
      events: {
        onDistributedTapped: ""
      },
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "FittableColumns", components: [
                  {kind: "XV.ListAttr", attr: "location",
                    formatter: "formatLocation"},
                ]},
                {kind: "XV.ListAttr", attr: "quantity",
                  formatter: "formatQuantity",
                  classes: "right"},
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "trace.number"},
                {kind: "XV.ListAttr", attr: "expiration",
                  formatter: "formatDate"},
                {kind: "XV.ListAttr", attr: "purchaseWarranty",
                  formatter: "formatDate"},
                {kind: "XV.ListAttr", attr: "distributed",
                  formatter: "formatQuantity",
                  classes: "right hyperlink", ontap: "distributedTapped"}
              ]}
            ]}
          ]}
        ]}
      ],
      destroy: function () {
        var collection = this.getValue(),
          that = this;
        _.each(collection.models, function (model) {
          model.off("change:distributed", that.rowChanged, that);
        });
        this.inherited(arguments);
      },
      distributedTapped: function (inSender, inEvent) {
        inEvent.model = this.readyModels()[inEvent.index];
        this.doDistributedTapped(inEvent);
        return true;
      },
      isDefault: function (model) {
        var location = model.get("location"),
          itemSite = model.get("itemSite"),
          stockLoc = itemSite.get("stockLocation"),
          locationControl = itemSite.get("locationControl");
        return locationControl && location && stockLoc.id === location.id;
      },
      formatDate: function (value, view) {
        var isExpired = value ? XT.date.compareDate(value, new Date()) >= 0 : false;
        view.addRemoveClass("error", isExpired);
        return XT.date.isEndOfTime(value) ? "" : value;
      },
      formatLocation: function (value, view, model) {
        view.addRemoveClass("emphasis", this.isDefault(model));
        if (value) { return value.format(); }
      },
      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      rowChanged: function (model) {
        this.renderRow(this.getValue().indexOf(model));
      },
      /**
        Overload: Don't highlight as selected if no quantity was distributed.
      */
      setupItem: function (inSender, inEvent) {
        var view = this.$.listItem,
          model = this.readyModels()[inEvent.index],
          isDistributed;
        if (!model) { return; } // Hack
        this.inherited(arguments);
        isDistributed = model.get("distributed");
        view.addRemoveClass("item-selected", isDistributed);
      },
      /**
       Overload: Add observers to all detail models to re-render if
       distribute values change.
       */
      valueChanged: function () {
        this.inherited(arguments);
        var that = this,
         collection = this.getValue();
        _.each(collection.models, function (model) {
          model.on("change:distributed", that.rowChanged, that);
        });
      }
    });

    enyo.kind({
      name: "XV.SiteTypeWorkflowListRelations",
      kind: "XV.WorkflowListRelations",
      parentKey: "siteType"
    });

    // ..........................................................
    // ITEM ITEM SITE
    //

    enyo.kind({
      name: "XV.ItemSiteListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "site.code"}
      ],
      parentKey: "item",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "site.code", classes: "bold"},
                {kind: "XV.ListAttr", attr: "controlMethod",
                  formatter: "formatControlMethod",
                  classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "site.description"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatControlMethod: function (value) {
        switch (value)
        {
        case "R":
          return "_regular".loc();
        case "L":
          return "_lot".loc();
        case "S":
          return "_serial".loc();
        case "N":
          return "_notControlled".loc();
        }
      }
    });

    // ..........................................................
    // ITEM WORKBENCH ORDERS
    //

    enyo.kind({
      name: "XV.ItemWorkbenchOrdersListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "dueDate"}
      ],
      style: "width: 300px",
      parentKey: "item",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "third", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "getOrderTypeString"}
            ]},
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "XV.ListAttr", attr: "sourceType",
                formatter: "formatType"},
              {kind: "XV.ListAttr", attr: "destinationType",
                formatter: "formatType"}
            ]},
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "XV.ListAttr", attr: "source"},
              {kind: "XV.ListAttr", attr: "destination"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", attr: "dueDate"},
              {kind: "XV.ListAttr", attr: "balance"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", attr: "ordered"},
              {kind: "XV.ListAttr", attr: "fulfilled"}
            ]}
          ]}
        ]}
      ],
      formatType: function (value) {
        switch (value)
        {
        case "I":
          return "_inventory".loc();
        case "V":
          return "_vendor".loc();
        case "C":
          return "_customer".loc();
        case "M":
          return "_manufacturing".loc();
        }
      }
    });

    // ..........................................................
    // RECEIPT CREATE LOT SERIAL / DISTRIBUTE TO LOCATIONS
    //

    enyo.kind({
      name: "XV.ReceiptCreateLotSerialListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "quantity"}
      ],
      parentKey: "itemSite",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "quantity", classes: "bold"},
                {kind: "XV.ListAttr", attr: "trace", fit: true},
                {kind: "XV.ListAttr", attr: "expireDate"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "location.format", fit: true, style: "text-indent: 18px;"},
                {kind: "XV.ListAttr", attr: "warrantyDate", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // SHIPMENT LINE
    //

    enyo.kind({
      name: "XV.ShipmentLineListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "orderLine.lineNumber"}
      ],
      parentKey: "shipment",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "orderLine.lineNumber", classes: "bold"},
                {kind: "XV.ListAttr", attr: "orderLine.item.number", fit: true},
                {kind: "XV.ListAttr", attr: "orderLine.quantity",
                  formatter: "formatQuantity", classes: "right"},
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "orderLine.item.description1",
                  fit: true,  style: "text-indent: 18px;"},
                {kind: "XV.ListAttr", attr: "orderLine.quantityUnit.name",
                  classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      }
    });

    // ..........................................................
    // TRANSFER ORDER LINE
    //

    enyo.kind({
      name: "XV.TransferOrderLineItemListRelations",
      kind: "XV.ListRelations",
      parentKey: "transferOrder",
      orderBy: [
        {attribute: "lineNumber"}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "FittableColumns", components: [
                  {kind: "XV.ListAttr", attr: "lineNumber", isKey: true}
                ]}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "item.number"},
                {kind: "XV.ListAttr", attr: "item.description1"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "quantity", formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "unit"}
            ]}
          ]}
        ]}
      ],
      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      }
    });

  };

}());
