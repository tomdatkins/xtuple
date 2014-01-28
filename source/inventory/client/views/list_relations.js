/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.inventory.initListRelations = function () {

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
                {kind: "XV.ListAttr", attr: "site.description"},
                {kind: "XV.ListAttr", attr: "controlMethod",
                  formatter: "formatControlMethod",
                  classes: "right"},
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
