/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XM:true, enyo:true, XV:true, _:true */

(function () {

  enyo.kind({
    name: "XV.IssueToShippingOrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.OrderRelationCollection",
    keyAttribute: "number",
    list: "XV.OrderList",
    query: {parameters: [
      {attribute: "status", value: XM.SalesOrderBase.OPEN_STATUS},
      {attribute: "orderType", operator: "ANY", value: ["SO", "TO"]}
    ]}
  });

  // ..........................................................
  // TRANSFER ORDER ITEM
  //

  /**
    This relation widget allows selection of items in the context of a Transfer Order
    where only items that have item sites set up for the source, destination and transit
    site are allowed to be selected.
  */
  enyo.kind({
    name: "XV.TransferOrderItemWidget",
    kind: "XV.RelationWidget",
    published: {
      item: null,
      transferOrder: null
    },
    handlers: {
      onValueChange: "handleValueChanged"
    },
    collection: "XM.TransferOrderItemRelationCollection",
    list: "XV.TransferOrderItemList",
    nameAttribute: "description1",
    descripAttribute: "description2",
    destroy: function () {
      var order = this.getTransferOrder();
      if (order) {
        order.off("change:sourceSite change:destinationSite change:transitSite", this.siteChanged, this);
      }
    },
    /**
      @protected
      Intercepts value passed the "normal" way and reformats to this widget.
    */
    handleValueChanged: function (inSender, inEvent) {
      inEvent.value =  {item: inEvent.value};
    },
    /**
      This setValue function handles a value which is an
      object potentially consisting of multiple key/value pairs for the
      both the item and transfer order.

      @param {Object} Value
      @param {Object} [value.item] Item
      @param {Date} [value.transferOrder] Transfer Order
    */
    setValue: function (value, options) {
      value = value instanceof XM.Model || !value ? {item: value} : value;
      if (value && value.transferOrder) {
        this.setTransferOrder(value.transferOrder);
      }
      XV.RelationWidget.prototype.setValue.call(this, value.item, options);
    },
    siteChanged: function () {
      var order = this.getTransferOrder(),
        source = order.get("sourceSite"),
        destination = order.get("destinationSite"),
        transit = order.get("transitSite");

      if (source) {
        this.addParameter({
          attribute: "source",
          value: source
        });
      }

      if (destination) {
        this.addParameter({
          attribute: "destination",
          value: destination
        });
      }

      if (transit) {
        this.addParameter({
          attribute: "transit",
          value: transit
        });
      }
    },
    transferOrderChanged: function () {
      var order = this.getTransferOrder();
      order.on("change:sourceSite change:destinationSite change:transitSite", this.siteChanged, this);
      this.siteChanged();
    },
    query: {parameters: [
      {attribute: "isActive", value: true}
    ]}
  });

  enyo.kind({
    name: "XV.ReceiptOrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.OrderRelationCollection",
    keyAttribute: "number",
    list: "XV.OrderList",
    query: {parameters: [
      {attribute: "status", value: XM.SalesOrderBase.OPEN_STATUS},
      {attribute: "orderType", operator: "ANY", value: ["PO", "TO"]}
    ]}
  });

  enyo.kind({
    name: "XV.TraceSequenceWidget",
    kind: "XV.RelationWidget",
    keyAttribute: "number",
    collection: "XM.TraceSequenceCollection",
    list: "XV.TraceSequenceList"
  });

  // ..........................................................
  // ORDER
  //

  enyo.kind({
    name: "XV.OrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.OrderRelationCollection",
    keyAttribute: "number",
    list: "XV.OrderList",
    query: {parameters: [
      {attribute: "status", value: XM.SalesOrderBase.OPEN_STATUS},
    ]}
  });

  enyo.kind({
    name: "XV.ShipmentOrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ShipmentOrderCollection",
    list: "XV.SalesOrderList",
    keyAttribute: "number",
    nameAttribute: "billtoName",
    descripAttribute: "formatShipto",
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", fit: true, classes: "xv-flexible-label"},
        {kind: "onyx.InputDecorator", name: "decorator",
          classes: "xv-input-decorator", components: [
          {name: 'input', kind: "onyx.Input", classes: "xv-subinput",
            onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur",
            onfocus: "receiveFocus"
          },
          {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
            {kind: "onyx.IconButton", src: "/assets/triangle-down-large.png",
              classes: "xv-relationwidget-icon"},
            {name: 'popupMenu', floating: true, kind: "onyx.Menu",
              components: [
              {kind: "XV.MenuItem", name: 'searchItem', content: "_search".loc()},
              {kind: "XV.MenuItem", name: 'openItem', content: "_open".loc(),
                disabled: true},
              {kind: "XV.MenuItem", name: 'newItem', content: "_new".loc(),
                disabled: true}
            ]}
          ]},
          {name: "completer", kind: "XV.Completer", onSelect: "itemSelected"}
        ]}
      ]},
      {kind: "FittableColumns", components: [
        {name: "labels", classes: "xv-relationwidget-column left",
          components: [
          {name: "nameLabel", content: "_billto".loc() + ":",
            classes: "xv-relationwidget-description label"},
          {name: "descriptionLabel", content: "_shipto".loc() + ":",
            classes: "xv-relationwidget-description label"}
        ]},
        {name: "data", fit: true, components: [
          {name: "name", classes: "xv-relationwidget-description hasLabel"},
          {name: "description", classes: "xv-relationwidget-description hasLabel",
            allowHtml: true}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // SHIPMENT
  //

  enyo.kind({
    name: "XV.ShipmentWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ShipmentRelationCollection",
    keyAttribute: "number",
    list: "XV.ShipmentList"
  });

  // ..........................................................
  // TRACE
  //

  enyo.kind({
    name: "XV.TraceSequenceWidget",
    kind: "XV.RelationWidget",
    keyAttribute: "number",
    collection: "XM.TraceSequenceCollection",
    list: "XV.TraceSequenceList"
  });

}());