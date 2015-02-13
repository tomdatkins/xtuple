/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XM:true, enyo:true, XV:true, _:true, XT:true */

(function () {

  // ..........................................................
  // ORDER
  //

  enyo.kind({
    name: "XV.OrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.OrderRelationCollection",
    keyAttribute: "number",
    list: "XV.OrderList",
    events: {
      onNotify: ""
    },
    menuItemSelected: function (inSender, inEvent) {
      if (inEvent.originator.name === "openItem") {
        this.doWorkspace({
          workspace: this._List.prototype.getWorkspace(this.value),
          id: this.value.get("uuid"),
          allowNew: false
        });
      } else {
        this.inherited(arguments);
      }
    },
    setValue: function (value, options) {
      if (_.isObject(value) ? value.get("holdType") === XM.SalesOrder.PACKING_HOLD_TYPE : false) {
        return this.doNotify({message: "_orderPackHold".loc(), type: XM.Model.WARNING });
      } else { this.inherited(arguments); }
    }
  });

  // ..........................................................
  // ISSUE TO SHIPPING ORDER
  //

  enyo.kind({
    name: "XV.IssueToShippingOrderWidget",
    kind: "XV.OrderWidget",
    query: {parameters: [
      {attribute: "status", value: XM.SalesOrderBase.OPEN_STATUS},
      {attribute: "orderType", operator: "ANY", value: ["SO", "TO"]}
    ]}
  });

  // ..........................................................
  // ITEM
  //

  // Add workbench menu option to item widget.
  var _iProto = XV.ItemWidget.prototype,
    _iCreate = _iProto.create,
    _iMenuItemSelected = _iProto.menuItemSelected,
    _iSetValue = _iProto.setValue;

  _.extend(_iProto, {
    create: function () {
      _iCreate.apply(this, arguments);

      this.$.popupMenu.createComponent({
        kind: "XV.MenuItem",
        name: 'openWorkbench',
        content: "_workbench".loc(),
        disabled: true
      });
    },
    menuItemSelected: function (inSender, inEvent) {
      if (inEvent.originator.name === "openWorkbench") {
        this.doWorkspace({
          workspace: "XV.ItemWorkbenchWorkspace",
          id: this.getValue().id
        });
      } else {
        _iMenuItemSelected.apply(this, arguments);
      }
    },
    setValue: function () {
      var openWorkbench = this.$.popupMenu.$.openWorkbench,
        privs = XT.session.privileges,
        noPriv = !privs.get("ViewItemAvailabilityWorkbench"),
        value;

      _iSetValue.apply(this, arguments);
      value = this.getValue();

      openWorkbench.setDisabled(!value || noPriv);
    }
  });

  // ..........................................................
  // ITEM SITE
  //

  // Add workbench menu option to item widget.
  var _isProto = XV.ItemSiteWidget.prototype,
    _isCreate = _isProto.create;

  _.extend(_isProto, {
    published: {
      canEditItemSite: true
    },
    handlers: {"onModelNotNew": "setCanEditItemSite"},
    create: function () {
      var that = this,
        privs = XT.session.privileges,
        noPriv = !privs.get("ViewItemAvailabilityWorkbench"),
        popupMenu,
        openWorkbench,
        openItem,
        setDisabled,
        widget,
        menuItemSelected,
        setValue;

      _isCreate.apply(this, arguments);

      // Add a new menu item
      popupMenu = this.$.privateItemSiteWidget.$.popupMenu;
      openWorkbench = popupMenu.createComponent({
        kind: "XV.MenuItem",
        name: 'openWorkbench',
        content: "_workbench".loc(),
        disabled: true
      });

      // Over-ride functions to handle new menu item
      widget = this.$.privateItemSiteWidget;
      menuItemSelected = widget.menuItemSelected;
      setValue = widget.setValue;
      /** 
        Handle opening of the Item Workbench (newly added to menu list),
        and the Item Site (can't edit if Sales Order has been saved).
      */
      widget.menuItemSelected = function (inSender, inEvent) {
        // var workspace copied from XV.RelationWidget
        var that = this,
          setReadOnly,
          workspace = this._List ? this._List.prototype.getWorkspace() : null,
          canEditItemSite = this.published.canEditItemSite;

        setReadOnly = function () {
          var canEditItemSite = that.published.canEditItemSite;
          if (this.kind === "XV.ItemSiteWorkspace" && !canEditItemSite) {
            var workspace = this,
              wsAttributes = _.filter(workspace.$, function (attr) {
                if (attr.setDisabled) {return attr; }
              });

            _.each(wsAttributes, function (attr) {
              workspace.value.setReadOnly(attr, true);
            });
          } //else... TODO - handle what went wrong and make sure not allow edit on Item Site.
        };

        if (inEvent.originator.name === "openWorkbench") {
          this.doWorkspace({
            workspace: "XV.ItemWorkbenchWorkspace",
            id: this.getValue().get("item").id
          });
        } else if (inEvent.originator.name === "openItem") {
          this.doWorkspace({
            workspace: workspace,
            id: this.getValue().id,
            allowNew: false,
            success: setReadOnly
          });
        } else {
          menuItemSelected.apply(this, arguments);
        }
      };
      // Handle display of openWorkbench (Item Workbench) menu item
      widget.setValue = function () {
        var privs = XT.session.privileges,
          noPriv = !privs.get("ViewItemAvailabilityWorkbench"),
          value;

        setValue.apply(this, arguments);
        value = this.getValue();

        openWorkbench.setDisabled(!value || noPriv);
      };
    },
    setCanEditItemSite: function (inSender, inEvent) {
      if (this.canEditItemSite !== inSender.canEditItemSite) {
        this.canEditItemSite = inSender.canEditItemSite;
      }
      return true;
    }
  });

  // ..........................................................
  // LOCATION
  //

  enyo.kind({
    name: "XV.LocationWidget",
    kind: "XV.RelationWidget",
    collection: "XM.LocationRelationCollection",
    list: "XV.LocationList",
    keyAttribute: "description",
    nameAttribute: "description",
    handlers: {
      onBarcodeCapture: "captureBarcode"
    },
    orderBy: [
      {attribute: 'description'}
    ],
    captureBarcode: function (inSender, inEvent) {
      if (this.disabled) {
        // do nothing if disabled
        return;
      }
      var that = this,
        locations = new XM.LocationRelationCollection(),
        setValue = function () {
          var modelMatch = _.find(locations.models, function (model) {
            return model.format() === inEvent.data;
          });
          that.setValue(modelMatch);
        };

      locations.fetch({success: setValue});
    }
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
    kind: "XV.OrderWidget",
    query: {parameters: [
      {attribute: "status", value: XM.SalesOrderBase.OPEN_STATUS},
      {attribute: "orderType", operator: "ANY", value: ["PO", "TO"]},
      {attribute: "canReceive", value: true}
    ]}
  });

  enyo.kind({
    name: "XV.TraceSequenceWidget",
    kind: "XV.RelationWidget",
    keyAttribute: "number",
    collection: "XM.TraceSequenceCollection",
    list: "XV.TraceSequenceList"
  });

  enyo.kind({
    name: "XV.ShipmentOrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ShipmentOrderCollection",
    list: "XV.SalesOrderList",
    keyAttribute: "number",
    nameAttribute: "billtoName",
    descripAttribute: "formatShipto",
    descriptionComponents: [
      {name: "billToRow", controlClasses: "enyo-inline", components: [
        {classes: 'xv-description', name: "name", allowHtml: true}
      ]},
      {name: "shipToRow", controlClasses: "enyo-inline", components: [
        {classes: "xv-description", target: '_blank', name: "description", allowHtml: true}
      ]},
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
