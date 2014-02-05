/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true, async:true */

(function () {

  XT.extensions.inventory.initWorkspaces = function () {

    // ..........................................................
    // PREFERENCES
    //

    var salesExtensions, preferencesExtensions;

    // can't guarantee that the sales extension is loaded
    if (XT.extensions.sales) {
      salesExtensions = [
        {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_multiSite".loc()},
        {kind: "XV.ToggleButtonWidget", container: "mainGroup", attr: "MultiWhs",
          label: "_enableMultipleSites".loc() }
      ];
      XV.appendExtension("XV.SalesWorkspace", salesExtensions);
    }

    preferencesExtensions = [
      {kind: "XV.SitePicker", container: "mainGroup", attr: "PreferredWarehouse",
        label: "_defaultSite".loc() }
    ];
    XV.appendExtension("XV.UserPreferenceWorkspace", preferencesExtensions);

    // ..........................................................
    // CHARACTERISTIC
    //

    var extensions = [
      {kind: "XV.ToggleButtonWidget", attr: "isTransferOrders",
        label: "_transferOrders".loc(), container: "rolesGroup"},
    ];

    XV.appendExtension("XV.CharacteristicWorkspace", extensions);

    // ..........................................................
    // CONFIGURE
    //

    enyo.kind({
      name: "XV.InventoryWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_inventory".loc(),
      model: "XM.Inventory",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_changeLog".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "WarehouseChangeLog",
                label: "_postSiteChanges".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "ItemSiteChangeLog",
                label: "_postItemSiteChanges".loc()},
              {kind: "onyx.GroupboxHeader", content: "_costing".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowAvgCostMethod",
                label: "_allowAvgCostMethod".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowStdCostMethod",
                label: "_allowStdCostMethod".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowJobCostMethod",
                label: "_allowJobCostMethod".loc()},
              {kind: "onyx.GroupboxHeader", content: "_options".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "MultiWhs",
                label: "_enableMultipleSites".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "LotSerialControl"},
              {kind: "onyx.GroupboxHeader", content: "_barcodeScanner".loc()},
              {kind: "XV.InputWidget", attr: "BarcodeScannerPrefix",
                label: "_prefix".loc()},
              {kind: "XV.InputWidget", attr: "BarcodeScannerSuffix",
                label: "_suffix".loc()}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "shippingPanel", title: "_shipping".loc(), components: [
            {kind: "XV.ScrollableGroupbox", name: "shippingGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_shipping".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "ShipmentNumberGeneration",
                label: "_shipmentNumberPolicy".loc()},
              {kind: "XV.NumberWidget", attr: "NextShipmentNumber",
                label: "_nextShipmentNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "KitComponentInheritCOS",
                label: "_kitComponentInheritCOS".loc()}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // ENTER RECEIPT
    //

    enyo.kind({
      name: "XV.EnterReceiptWorkspace",
      kind: "XV.Workspace",
      title: "_enterReceipt".loc(),
      model: "XM.EnterReceipt",
      backText: "_cancel".loc(),
      hideApply: true,
      dirtyWarn: false,
      events: {
        onPrevious: "",
        onProcessingChanged: ""
      },
      handlers: {
        onDistributionLineDone: "handleDistributionLineDone"
      },
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_order".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.OrderWidget", attr: "order"},
              {kind: "onyx.GroupboxHeader", content: "_item".loc()},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.QuantityWidget", attr: "unitCost"},
              {kind: "XV.QuantityWidget", attr: "extCost"},
              {kind: "XV.QuantityWidget", attr: "freight"},
              {kind: "XV.DateWidget", attr: "scheduleDate"},
              {kind: "XV.DateWidget", attr: "transactionDate", name: "receiveDate"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "quantityPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
            {kind: "XV.ScrollableGroupbox", name: "quantityGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.QuantityWidget", attr: "ordered"},
              {kind: "XV.QuantityWidget", attr: "received"},
              {kind: "XV.QuantityWidget", attr: "returned"},
              {kind: "XV.QuantityWidget", attr: "balance"},
              {kind: "XV.QuantityWidget", attr: "undistributed", name: "undistributed",
                label: "_undistributed".loc()},
              {kind: "onyx.GroupboxHeader", content: "_receive".loc()},
              {kind: "XV.QuantityWidget", attr: "toReceive", name: "toReceive",
                onValueChange: "toReceiveChanged"}
            ]}
          ]},
          {kind: "XV.ReceiptCreateLotSerialBox", attr: "detail", name: "detail"}
        ]}
      ],
      /**
        Overload: Some special handling for start up.
        */
      attributesChanged: function () {
        this.inherited(arguments);
        var model = this.getValue();

        // Focus and select qty on start up.
        if (!this._started && model &&
          model.getStatus() === XM.Model.READY_CLEAN) {
          this.$.toReceive.setValue(null);
          this.$.toReceive.focus();
          this._started = true;
          this.$.detail.$.newButton.setDisabled(true);
        }
        // Hide detail if not applicable
        if (!model.requiresDetail()) {
          this.$.detail.hide();
          this.$.undistributed.hide();
          this.parent.parent.$.menu.refresh();
        }
      },
      // If there is qty remaining to distribute (undistributed), open a new dist record in editor.
      handleDistributionLineDone: function () {
        var undistributed = this.getValue().undistributed();
        if (undistributed > 0) {
          this.$.detail.newItem();
        } else if (undistributed < 0) {
          this.error(this.getValue(), XT.Error.clone("xt2026"));
        }
      },
      toReceiveChanged: function (inSender, inEvent) {
        var model = this.getValue();
        model.set("toReceive", inSender.value);
        this.handleDistributionLineDone();
      },
      /**
        Overload: This version of save just validates the model and forwards
        on to callback. Designed specifically to work with `XV.EnterReceiptList`.
      */
      save: function () {
        var callback = this.getCallback(),
          model = this.getValue(),
          workspace = this;
        model.validate(function (isValid) {
          if (isValid) { callback(workspace); }
        });
      }
    });

    // ..........................................................
    // INVOICE
    //

    extensions = [
      {kind: "XV.MoneyWidget", container: "invoiceLineItemBox.summaryPanel.summaryColumnTwo",
        addBefore: "taxTotal", attr: {localValue: "freight", currency: "currency"},
        label: "_freight".loc(), currencyShowing: false, defer: true}
    ];

    XV.appendExtension("XV.InvoiceWorkspace", extensions);

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueStockWorkspace",
      kind: "XV.Workspace",
      title: "_issueStock".loc(),
      model: "XM.IssueToShipping",
      backText: "_cancel".loc(),
      saveText: "_issue".loc(),
      hideApply: true,
      hideRefresh: true,
      dirtyWarn: false,
      events: {
        onPrevious: ""
      },
      handlers: {
        onDetailSelectionChanged: "toggleDetailSelection",
        onDistributedTapped: "distributedTapped"
      },
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_order".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.OrderWidget", attr: "order"},
              {kind: "XV.ShipmentWidget", attr: "shipment"},
              {kind: "onyx.GroupboxHeader", content: "_item".loc()},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.InputWidget", attr: "unit.name", label: "_issueUnit".loc()},
              {kind: "XV.QuantityWidget", attr: "ordered"},
              {kind: "XV.QuantityWidget", attr: "shipped"},
              {kind: "XV.QuantityWidget", attr: "returned"},
              {kind: "XV.QuantityWidget", attr: "balance"},
              {kind: "XV.QuantityWidget", attr: "atShipping"},
              {kind: "onyx.GroupboxHeader", content: "_issue".loc()},
              {kind: "XV.QuantityWidget", attr: "toIssue", name: "toIssue"},
            ]}
          ]},
          {kind: "XV.IssueStockDetailRelationsBox",
            attr: "itemSite.detail", name: "detail"}
        ]},
        {kind: "onyx.Popup", name: "distributePopup", centered: true,
          onHide: "popupHidden",
          modal: true, floating: true, components: [
          {content: "_quantity".loc()},
          {kind: "onyx.InputDecorator", components: [
            {kind: "onyx.Input", name: "quantityInput"}
          ]},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "distributeOk",
            classes: "onyx-blue xv-popup-button"},
          {kind: "onyx.Button", content: "_cancel".loc(), ontap: "distributeDone",
            classes: "xv-popup-button"},
        ]}
      ],
      /**
        Overload: Some special handling for start up.
        */
      attributesChanged: function () {
        this.inherited(arguments);
        var model = this.getValue();

        // Focus and select qty on start up.
        if (!this._started && model &&
          model.getStatus() === XM.Model.READY_DIRTY) {
          this.$.toIssue.focus();
          this.$.toIssue.$.input.selectContents();
          this._started = true;
        }

        // Hide detail if not applicable
        if (!model.requiresDetail()) {
          this.$.detail.hide();
          this.parent.parent.$.menu.refresh();
        }
      },
      /**
        Overload to handle callback chain.
      */
      destroy: function () {
        var model = this.getValue(),
          callback = this.getCallback();

        // If there's a callback then call it with false
        // to let it know to cancel process
        if (model.isDirty() && callback) {
          callback(false);
        }
        this.inherited(arguments);
      },

      distributeDone: function () {
        this._popupDone = true;
        delete this._distModel;
        this.$.distributePopup.hide();
      },
      distributeOk: function () {
        var qty = this.$.quantityInput.getValue(),
          dist = this._distModel;
        qty = Globalize.parseFloat(qty);
        dist.set("distributed", qty);
        if (dist._validate(dist.attributes, {})) {
          this.distributeDone();
          this.$.detail.$.list.refresh();
        }
      },
      distributedTapped: function (inSender, inEvent) {
        var input = this.$.quantityInput,
          qty = inEvent.model.get("distributed");
        this._popupDone = false;
        this._distModel = inEvent.model;
        this.$.distributePopup.show();
        qty = Globalize.format(qty, "n" + XT.QTY_SCALE);
        input.setValue(qty);
        input.focus();
        input.selectContents();
      },
      popupHidden: function (inSender, inEvent) {
        if (!this._popupDone) {
          inEvent.originator.show();
        }
      },
      /**
        Overload: This version of save just validates the model and forwards
        on to callback. Designed specifically to work with `XV.IssueToShippingList`.
      */
      save: function () {
        var callback = this.getCallback(),
          model = this.getValue(),
          workspace = this;
        model.validate(function (isValid) {
          if (isValid) { callback(workspace); }
        });
      },
      /**
        If detail has been selected or deselected, handle default distribution.
      */
      toggleDetailSelection: function (inSender, inEvent) {
        var detail = inEvent.model,
          isDistributed = detail.get("distributed") > 0,
          undistributed;
        if (!detail) { return; }
        if (isDistributed) {
          detail.clear();
        } else {
          undistributed = this.getValue().undistributed();
          detail.distribute(undistributed);
        }
      }
    });

    // ..........................................................
    // ITEM
    //

    var _proto = XV.ItemWorkspace.prototype;

    // Add workbench action
    if (!_proto.actions) { _proto.actions = []; }
    _proto.actions.push(
      {name: "openWorkbench", isViewMethod: true,
        label: "_workbench".loc(), privilege: "ViewItemAvailabilityWorkbench",
        prerequisite: "isReadyClean"
    });
    _proto.openWorkbench = function () {
      this.doWorkspace({
        workspace: "XV.ItemWorkbenchWorkspace",
        id: this.getValue().id
      });
    };

    extensions = [
      {kind: "onyx.GroupboxHeader", content: "_inventory".loc(),
        container: "settingsGroup"},
      {kind: "XV.FreightClassPicker", attr: "freightClass",
        container: "settingsGroup"},
      {kind: "XV.InputWidget", attr: "barcode", label: "_upcCode".loc(),
        container: "settingsGroup"},
      {kind: "XV.ItemSiteRelationsBox", attr: "itemSites", container: "panels"}
    ];

    XV.appendExtension("XV.ItemWorkspace", extensions);

    // ..........................................................
    // ITEM SITE
    //

    extensions = [
      {kind: "onyx.GroupboxHeader", name: "createSalesSupplyHeader",
        content: "_createSupplyForSalesOrders".loc(),
        container: "supplyPanel"},
      {kind: "XV.CheckboxWidget", label: "_purchaseOrders".loc(),
        name: "createPurchaseOrders",
        attr: "isCreatePurchaseOrdersForSalesOrders",
        container: "supplyPanel"},
      {kind: "XV.CheckboxWidget", attr: "isDropShip",
        container: "supplyPanel"},
      {kind: "XV.CheckboxWidget", name: "createPurchaseRequestsForSales",
        label: "_purchaseRequests".loc(), fit: true,
        attr: "isCreatePurchaseRequestsForSalesOrders",
        container: "supplyPanel"}
    ];

    XV.appendExtension("XV.ItemSiteWorkspace", extensions);

    // ..........................................................
    // ITEM WORKBENCH
    //

    enyo.kind({
      name: "XV.ItemWorkbenchWorkspace",
      kind: "XV.Workspace",
      title: "_itemWorkbench".loc(),
      model: "XM.ItemWorkbench",
      headerAttrs: ["number", "-", "item.description1"],
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", title: "_selection".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_selection".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.ItemWidget", attr: "item"},
              {kind: "XV.SitePicker", attr: "site", showNone: false},
              {kind: "XV.UnitPicker", attr: "inventoryUnit"},
              {kind: "onyx.GroupboxHeader", content: "_planning".loc()},
              {kind: "XV.QuantityWidget", attr: "selected.onHand",
                label: "_onHand".loc()},
              {kind: "XV.QuantityWidget", attr: "selected.reorderLevel",
                label: "_reorderLevel".loc()},
              {kind: "XV.QuantityWidget", attr: "selected.orderMinimum",
                label: "_orderMinimum".loc()},
              {kind: "XV.QuantityWidget", attr: "selected.orderMultiple",
                label: "_orderMultiple".loc()},
              {kind: "XV.QuantityWidget", attr: "selected.orderMaxmimum",
                label: "_orderMaximum".loc()},
              {kind: "XV.QuantityWidget", attr: "selected.orderTo",
                label: "_orderTo".loc()}
            ]}
          ]},
          {kind: "XV.ItemWorkbenchOrdersBox", attr: "runningAvailability"},
          {kind: "XV.ItemWorkbenchAvailabilityBox", attr: "availability"},
          {kind: "XV.ItemWorkbenchHistoryBox", attr: "item"},
          {kind: "XV.ItemCommentBox", attr: "comments"},
          {kind: "XV.Groupbox", name: "itemPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc(),
              title: "_item".loc()},
            {kind: "XV.ScrollableGroupbox", name: "itemGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.CheckboxWidget", attr: "isActive"},
              {kind: "XV.ItemTypePicker", attr: "itemType", showNone: false},
              {kind: "XV.ClassCodePicker", attr: "classCode"},
              {kind: "XV.CheckboxWidget", attr: "isFractional"},
              {kind: "onyx.GroupboxHeader",
                content: "_extendedDescription".loc()},
              {kind: "XV.TextArea", attr: "extendedDescription"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "itemSettingsPanel", title: "_itemSettings".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_settings".loc()},
            {kind: "XV.ScrollableGroupbox", name: "itemSettingsGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.CheckboxWidget", attr: "isSold"},
              {kind: "XV.ProductCategoryPicker", attr: "productCategory",
                label: "_category".loc()},
              {kind: "XV.SalesPriceWidget", attr: "listPrice"},
              {kind: "XV.SalesPriceWidget", attr: "wholesalePrice"},
              {kind: "XV.UnitPicker", attr: "priceUnit"},
              {kind: "onyx.GroupboxHeader", content: "_purchasing".loc()},
              {kind: "XV.PurchasePriceWidget", attr: "maximumDesiredCost"},
              {kind: "onyx.GroupboxHeader", content: "_inventory".loc()},
              {kind: "XV.FreightClassPicker", attr: "freightClass"},
              {kind: "XV.InputWidget", attr: "barcode", label: "_upcCode".loc()}
            ]}
          ]},
          {kind: "XV.ItemAliasBox", attr: "aliases"}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        // The options never end....
        this.parent.parent.$.applyButton.hide();
        this.parent.parent.$.saveButton.hide();
      }
    });

    XV.registerModelWorkspace("XM.ItemWorkbench", "XV.ItemWorkbenchWorkspace");

    // ..........................................................
    // INVENTORY HISTORY
    //

    enyo.kind({
      name: "XV.InventoryHistoryWorkspace",
      kind: "XV.Workspace",
      title: "_inventoryHistory".loc(),
      model: "XM.InventoryHistory",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.DateWidget", attr: "transactionDate",
                label: "_transDate".loc()},
              {kind: "XV.ItemSiteWidget",
                attr: {item: "itemSite.item", site: "itemSite.site"}},
              {kind: "XV.QuantityWidget", attr: "quantity"},
              {kind: "XV.UnitPicker", attr: "unit"},
              {kind: "XV.NumberWidget", attr: "value",
                scale: XT.MONEY_SCALE},
              {kind: "onyx.GroupboxHeader", content: "_source".loc()},
              {kind: "XV.InputWidget", attr: "getTransactionTypeString",
                label: "_transType".loc()},
              {kind: "XV.InputWidget", attr: "documentNumber"},
              {kind: "XV.InputWidget", attr: "getOrderTypeString",
                label: "_orderType".loc()},
              {kind: "XV.InputWidget", attr: "orderNumber"}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "auditPanel", title : "_audit".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_audit".loc()},
            {kind: "XV.ScrollableGroupbox", name: "auditGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.CostWidget", attr: "unitCost"},
              {kind: "XV.PickerWidget", attr: "costMethod",
                collection: "XM.costMethods", valueAttribute: "id"},
              {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
              {kind: "XV.QuantityWidget", attr: "quantityBefore",
                label: "_before".loc()},
              {kind: "XV.QuantityWidget", attr: "quantityAfter",
                label: "_after".loc()},
              {kind: "onyx.GroupboxHeader", content: "_value".loc()},
              {kind: "XV.NumberWidget", attr: "valueBefore",
                scale: XT.MONEY_SCALE, label: "_before".loc()},
              {kind: "XV.NumberWidget", attr: "valueAfter",
                scale: XT.MONEY_SCALE, label: "_after".loc()},
              {kind: "onyx.GroupboxHeader", content: "_created".loc()},
              {kind: "XV.InputWidget", attr: "formatCreateDate", label: "_date".loc()},
              {kind: "XV.InputWidget", attr: "formatCreateTime", label: "_time".loc()},
              {kind: "XV.InputWidget", attr: "createdBy", label: "_user".loc()},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.InventoryHistoryDetailBox", attr: "detail"}
        ]}
      ],
      statusChanged: function () {
        this.inherited(arguments);
        var model = this.getValue(),
          hasDetail;

        if (model) {
          hasDetail = model.get("detail").length > 0;
          this.$.inventoryHistoryDetailBox.setShowing(hasDetail);
          this.parent.parent.$.menu.render(); // hack
        }
      }
    });

    XV.registerModelWorkspace("XM.InventoryHistory", "XV.InventoryHistoryWorkspace");

    // ..........................................................
    // LOCATION
    //

    enyo.kind({
      name: "XV.LocationWorkspace",
      kind: "XV.Workspace",
      title: "_location".loc(),
      model: "XM.Location",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_location".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.SiteZonePicker", attr: "siteZone"},
              {kind: "XV.CheckboxWidget", attr: "isNetable"},
              {kind: "XV.CheckboxWidget", attr: "isRestricted"},
              {kind: "XV.InputWidget", attr: "aisle"},
              {kind: "XV.InputWidget", attr: "rack"},
              {kind: "XV.InputWidget", attr: "bin"},
              {kind: "XV.InputWidget", attr: "location"},
              {kind: "XV.TextArea", fit: true, attr: "description"},
            ]}
          ]},
          {kind: "XV.LocationItemRelationBox", attr: "items"}
        ]}
      ],
      //TODO get the following working
      isRestrictedDidChange: function () {
        var model = this.getValue(),
          isRestricted = model ? model.get("isRestricted") : false;
        if (!isRestricted) {
          this.$.locationItemRelationBox.setDisabled(true);
        }
      }
    });

    XV.registerModelWorkspace("XM.Location", "XV.LocationWorkspace");
    XV.registerModelWorkspace("XM.LocationItem", "XV.LocationWorkspace");

    // ..........................................................
    // PURCHASE ORDER
    //

    /**
      This checkbox hides itself if drop shipments are not enabled.
    */
    enyo.kind({
      name: "XV.DropShipCheckboxWidget",
      kind: "XV.CheckboxWidget",
      create: function () {
        this.inherited(arguments);
        this.setShowing(this.showing);
      },
      setShowing: function (showing) {
        showing = showing !== false && XT.session.settings.get("EnableDropShipments");
        if (this.showing !== showing) {
          this.showing = showing;
          this.showingChanged();
        }
      }
    });

    extensions = [
      {kind: "onyx.GroupboxHeader", content: "_sales".loc(),
        container: "settingsControl", addBefore: "purchaseOrderCharacteristicsWidget"},
      {kind: "XV.DropShipCheckboxWidget", attr: "isDropShip",
        container: "settingsControl", addBefore: "purchaseOrderCharacteristicsWidget"},
      {kind: "XV.SalesOrderWidget", attr: "salesOrder",
        container: "settingsControl", addBefore: "purchaseOrderCharacteristicsWidget"}
    ];

    XV.appendExtension("XV.PurchaseOrderWorkspace", extensions);

    // ..........................................................
    // BILLING
    //

    if (XT.extensions.billing) {
      var returnLineExtensions = [
        {kind: "XV.CheckboxWidget", attr: "updateInventory", container: "mainGroup"}
      ];
      XV.appendExtension("XV.ReturnLineWorkspace", returnLineExtensions);

      var returnExtensions = [
        {kind: "onyx.GroupboxHeader", content: "_shipTo".loc(), container: "mainSubgroup",
          addBefore: "notesHeader"},
        {kind: "XV.CustomerShiptoWidget", attr: "shipto",
          name: "customerShiptoWidget",
          showAddress: true, label: "_number".loc(),
          nameAttribute: "", container: "mainSubgroup", addBefore: "notesHeader"},
        {kind: "XV.AddressFieldsWidget",
          name: "shiptoAddress",
          disabled: true,
          attr: {name: "shiptoName", line1: "shiptoAddress1",
            line2: "shiptoAddress2", line3: "shiptoAddress3",
            city: "shiptoCity", state: "shiptoState",
            postalCode: "shiptoPostalCode", country: "shiptoCountry"},
          container: "mainSubgroup", addBefore: "notesHeader"},
        {
          kind: "onyx.Button",
          content: "_copyToShipTo".loc(),
          name: "copyAddressButton",
          ontap: "copyBilltoToShipto",
          container: "addressWidget.buttonColumns"
        }
      ];
      XV.appendExtension("XV.ReturnWorkspace", returnExtensions);

      // #refactor use an enyo augments() or perhaps some new enyo 2.3 feature
      var oldAttributesChanged = XV.ReturnWorkspace.prototype.attributesChanged;
      var oldControlValueChanged = XV.ReturnWorkspace.prototype.controlValueChanged;
      _.extend(XV.ReturnWorkspace.prototype, {
        customerChanged: function () {
          var customer = this.$.customerWidget.getValue();

          if (customer) {
            this.$.customerShiptoWidget.setDisabled(false);
            this.$.customerShiptoWidget.addParameter({
              attribute: "customer",
              value: customer.id
            });
            this.$.shiptoAddress.setAccount(customer.id);
          } else {
            this.$.customerShiptoWidget.setDisabled(true);
          }
        },
        attributesChanged: function () {
          oldAttributesChanged.apply(this, arguments);
          var model = this.getValue(),
            customer = model ? model.get("customer") : false,
            isFreeFormShipto = customer ? customer.get("isFreeFormShipto") : true,
            button = this.$.copyAddressButton;

          button.setDisabled(!isFreeFormShipto);
          this.customerChanged();
        },
        controlValueChanged: function (inSender, inEvent) {
          oldControlValueChanged.apply(this, arguments);
          if (inEvent.originator.name === 'customerWidget') {
            this.customerChanged();
          }
        },
        copyBilltoToShipto: function (inSender, inEvent) {
          if (inEvent.originator.name === "copyAddressButton") {
            this.getValue().copyBilltoToShipto();
            return true;
          }
        }

      });
    }

    // ..........................................................
    // QUOTE LINE
    //

    var orderLineExts = [
      {kind: "XV.Groupbox", name: "supplyPanel", container: "salesLinePanels",
        addBefore: "comments", title: "_supply".loc(), components: [
        {kind: "onyx.GroupboxHeader", content: "_supply".loc()},
        {kind: "XV.ScrollableGroupbox", name: "supplyGroup",
          classes: "in-panel", fit: true, components: [
          {kind: "XV.QuantityWidget", attr: "availability.onHand",
            label: "_onHand".loc()},
          {kind: "XV.QuantityWidget", attr: "availability.allocated",
            label: "_allocated".loc()},
          {kind: "XV.QuantityWidget", attr: "availability.unallocated",
            label: "_unallocated".loc()},
          {kind: "XV.QuantityWidget", attr: "availability.ordered",
            label: "_ordered".loc()},
          {kind: "XV.QuantityWidget", attr: "availability.available",
            label: "_available".loc()}
        ]}
      ]}
    ];

    XV.appendExtension("XV.QuoteLineWorkspace", orderLineExts);

    // ..........................................................
    // SALES ORDER
    //

    var _soproto = XV.SalesOrderWorkspace.prototype;

    // Add actions
    if (!_soproto.actions) { _soproto.actions = []; }
    _soproto.actions.push(
      {name: "issueToShipping", isViewMethod: true,
        privilege: "IssueStockToShipping",
        prerequisite: "canIssueStockToShipping"}
    );

    if (!_soproto.actionButtons) { _soproto.actionButtons = []; }
    _soproto.actionButtons.push(
      {name: "expressCheckout", label: "_expressCheckout".loc(),
        isViewMethod: true,
        privilege: "IssueStockToShipping",
        prerequisite: "canCheckout"}
    );

    // Add methods
    _.extend(_soproto, {
      issueToShipping: function () {
        var model = this.getValue(),
          afterClose = function () {
            model.fetch();
          };

        this.doTransactionList({
          kind: "XV.IssueToShipping",
          key: model.get("uuid"),
          callback: afterClose
        });
      },

      expressCheckout: function () {
        var that = this,
          model = this.getValue(),
          message = "_unsavedChanges".loc() + " " + "_saveYourWork?".loc(),
          ids = _.map(this.value.get("lineItems").models, function (model) {
            return model.id;
          }),
          checkout = function () {
            async.map(ids, getIssueToShippingModel, function (err, res) {
              that.parent.parent.doPrevious();
              // res should be an array of READY_CLEAN IssueToShipping models
              that.issue(res);
            });
          },
          getIssueToShippingModel = function (id, done) {
            var model = new XM.IssueToShipping();
            model.fetch({id: id, success: function () {
              done(null, model);
            }, error: function () {
              done(null);
            }
            });
          };

        if (model.isDirty()) {
          model.save(null, {success: checkout});
        } else {
          checkout();
        }
      }
    });

    /**
        Refactor - copied/modified from TransactionList
    */
    XV.SalesOrderWorkspace.prototype.issue = function (models) {
      // Should we go here first to be there in case of error?
      //this.issueToShipping();
      var that = this,
        i = -1,
        callback,
        data = [];
      // Recursively transact everything we can
      // #refactor see a simpler implementation of this sort of thing
      // using async in inventory's ReturnListItem stomp
      callback = function (workspace) {
        var model,
          options = {},
          toTransact,
          transDate,
          params,
          dispOptions = {},
          wsOptions = {},
          wsParams,
          transFunction = "issueToShipping",
          transWorkspace = "XV.IssueStockWorkspace",
          shipment;

        // If argument is false, this whole process was cancelled
        if (workspace === false) {
          return;

        // If a workspace brought us here, process the information it obtained
        } else if (workspace) {
          model = workspace.getValue();
          toTransact = model.get(model.quantityAttribute);
          transDate = model.transactionDate || new Date();

          if (toTransact) {
            wsOptions.detail = model.formatDetail();
            wsOptions.asOf = transDate;
            wsOptions.expressCheckout = true;
            wsParams = {
              orderLine: model.id,
              quantity: toTransact,
              options: wsOptions
            };
            data.push(wsParams);
          }
          workspace.doPrevious();
        }

        i++;
        // If we've worked through all the models then forward to the server
        if (i === models.length) {
          if (data[0]) {
            /* TODO - add spinner and confirmation message.
                Also, refresh Sales Order List so that the processed order drops off list.

            that.doProcessingChanged({isProcessing: true});
            dispOptions.success = function () {
              that.doProcessingChanged({isProcessing: false});
            };*/
            dispOptions.success = function () {
              var callback = function (response) {
                if (response) {
                  // XXX - refactor.
                  XT.app.$.postbooks.$.navigator.$.contentPanels.getActive().fetch();
                }
              };
              XT.app.$.postbooks.$.navigator.doNotify({
                message: "_expressCheckout".loc() + " " + "_success".loc(),
                callback: callback
              });
            };
            XM.Inventory.transactItem(data, dispOptions, transFunction);
          } else {
            return;
          }

        // Else if there's something here we can transact, handle it
        } else {
          model = models[i];
          toTransact = model.get(model.quantityAttribute);
          if (toTransact === null) {
            toTransact = model.get("balance");
          }
          transDate = model.transactionDate || new Date();

          // See if there's anything to transact here
          if (toTransact) {

            // If prompt or distribution detail required,
            // open a workspace to handle it
            if (model.undistributed()) {
              // XXX - Refactor. Currently can't do that.doWorkspace
              // or send an event because we are navigating back further up.
              // Need to navigate back to list after success.
              XT.app.$.postbooks.$.navigator.doWorkspace({
                workspace: transWorkspace,
                id: model.id,
                callback: callback,
                allowNew: false,
                success: function (model) {
                  model.transactionDate = transDate;
                }
              });

            // Otherwise just use the data we have
            } else {
              options.asOf = transDate;
              options.detail = model.formatDetail();
              options.expressCheckout = true;
              params = {
                orderLine: model.id,
                quantity: toTransact,
                options: options
              };
              data.push(params);
              callback();
            }

          // Nothing to transact, move on
          } else {
            callback();
          }
        }
      };
      callback();
    };

    extensions = [
      {kind: "XV.MoneyWidget", container: "invoiceLineItemBox.summaryPanel.summaryColumnTwo",
        addBefore: "taxTotal", attr: {localValue: "freight", currency: "currency"},
        label: "_freight".loc(), currencyShowing: false, defer: true},
    ];

    XV.appendExtension("XV.SalesOrderWorkspace", extensions);

    // ..........................................................
    // SALES ORDER LINE
    //

    XV.appendExtension("XV.SalesOrderLineWorkspace", orderLineExts);

    var soLineExts = [
      {kind: "onyx.GroupboxHeader", content: "_order".loc()},
      {kind: "XV.CheckboxWidget", attr: "createOrder",
        container: "supplyGroup"},
      /*
      {kind: "XV.InputWidget", attr: "formatChildOrderNumber",
        container: "supplyGroup", label: "_number".loc()},
      {kind: "XV.InputWidget", attr: "childOrder.status",
        container: "supplyGroup", label: "_status".loc()},
      {kind: "XV.InputWidget", attr: "childOrder.quantity",
        container: "supplyGroup", label: "_quantity".loc()},
      {kind: "XV.DateWidget", attr: "getChildOrderDueDate",
        container: "supplyGroup"},
      */
      {kind: "onyx.GroupboxHeader", content: "_shipping".loc(),
        container: "supplyGroup"},
      {kind: "XV.QuantityWidget", attr: "shipped",
        container: "supplyGroup"},
      {kind: "XV.QuantityWidget", attr: "atShipping",
        container: "supplyGroup"}
    ];

    XV.appendExtension("XV.SalesOrderLineWorkspace", soLineExts);

    // ..........................................................
    // SHIPMENT
    //

    enyo.kind({
      name: "XV.ShipmentWorkspace",
      kind: "XV.Workspace",
      title: "_shipment".loc(),
      model: "XM.Shipment",
      allowPrint: true,
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "shipDate"},
              {kind: "XV.CheckboxWidget", attr: "isShipped"},
              {kind: "XV.ShipmentOrderWidget", attr: "order"},
              {kind: "XV.ShipViaCombobox", attr: "shipVia"},
              {kind: "XV.InputWidget", attr: "trackingNumber"},
              {kind: "XV.MoneyWidget",
                attr: {localValue: "freight", currency: "currency"},
                label: "_freight".loc()},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.ShipmentLineRelationsBox", attr: "lineItems"}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.ShipmentLine", "XV.ShipmentWorkspace");
    XV.registerModelWorkspace("XM.ShipmentListItem", "XV.ShipmentWorkspace");

    enyo.kind({
      name: "XV.ShipShipmentWorkspace",
      kind: "XV.Workspace",
      title: "_shipShipment".loc(),
      model: "XM.ShipShipment",
      reportModel: "XM.Shipment",
      saveText: "_ship".loc(),
      allowNew: false,
      hideApply: true,
      dirtyWarn: false,
      events: {
        onPrint: ""
      },
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "shipDate"},
              {kind: "XV.ShipmentOrderWidget", attr: "order"},
              {kind: "XV.MoneyWidget", label: "_value".loc(),
                attr: {localValue: "value", currency: "currency"}},
              {kind: "XV.ShipViaCombobox", attr: "shipVia"},
              {kind: "XV.InputWidget", attr: "trackingNumber"},
              {kind: "XV.MoneyWidget", label: "_freight".loc(),
                attr: {localValue: "freight", currency: "order.currency"}},
              {kind: "onyx.GroupboxHeader", content: "_options".loc()},
              {kind: "XV.StickyCheckboxWidget", label: "_printPacklist".loc(),
                name: "printPacklist"},
              {kind: "XV.StickyCheckboxWidget", name: "approveForBillingCheckbox",
                label: '_approveForBilling'.loc(), checked: false,
                onchange: 'handleApproveCheckboxChange'},
              {kind: "XV.StickyCheckboxWidget", name: "createInvoiceCheckbox",
                label: '_createAndPrintInvoice'.loc(), checked: false},
            ]}
          ]},
          {kind: "XV.ShipmentLineRelationsBox", attr: "lineItems"}
        ]}
      ],
      handleApproveCheckboxChange: function (inSender, inEvent) {
        var createInvoice = this.$.createInvoiceCheckbox.isChecked(),
          approveForBilling = this.$.approveForBillingCheckbox.isChecked();

        this.$.createInvoiceCheckbox.setDisabled(!approveForBilling);
        this.$.createInvoiceCheckbox.setChecked(approveForBilling && createInvoice);

        return true;
      },
      create: function (options) {
        this.inherited(arguments);
        var canPrint = this.getPrintAvailable(),
          canBill = XT.session.privileges.get('SelectBilling'),
          autoBill = canBill && XT.session.settings.get('AutoSelectForBilling');

        this.$.printPacklist.setDisabled(!canPrint);
        this.$.printPacklist.setChecked(canPrint);

        // XXX approveForBillingCheckbox for some reason cannot be called 'approveForBilling'.
        // The checkbox won't work. same goes for 'createInvoice'.
        // #refactor ?
        this.$.approveForBillingCheckbox.setDisabled(!canBill);
        this.$.approveForBillingCheckbox.setChecked(autoBill);

        this.$.createInvoiceCheckbox.setDisabled(!canBill || !autoBill);

        // XXX not sure what default value should be. setting to false
        this.$.createInvoiceCheckbox.setChecked(autoBill);
      },
      save: function (options) {
        var that = this;

        _.extend(options, {
          approveForBilling: this.$.approveForBillingCheckbox.isChecked(),
          createInvoice: this.$.createInvoiceCheckbox.isChecked(),
          success: function (model, resp, options) {
            if (options.createInvoice) {
              that.doPrint({ invoiceNumber: resp.invoiceNumber });
            }
          }
        });

        this.inherited(arguments);
      }
    });

    // ..........................................................
    // ITEM SITE
    //

    extensions = [
      {kind: "XV.Groupbox", name: "inventoryPanel", title: "_inventory".loc(),
        container: "panels", components: [
        {kind: "onyx.GroupboxHeader", content: "_inventory".loc()},
        {kind: "XV.ScrollableGroupbox", name: "inventoryGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.ControlMethodPicker", attr: "controlMethod"},
          {kind: "XV.CostMethodPicker", attr: "costMethod"},
          {kind: "XV.CheckboxWidget", attr: "isStocked"},
          {kind: "XV.AbcClassPicker", attr: "abcClass"},
          {kind: "XV.ToggleButtonWidget", attr: "isAutomaticAbcClassUpdates"},
          {kind: "XV.NumberWidget", attr: "cycleCountFrequency", scale: 0}
        ]}
      ]},
      {kind: "XV.Groupbox", name: "planningPanel", title: "_planning".loc(),
        container: "panels", components: [
        {kind: "onyx.GroupboxHeader", content: "_planning".loc()},
        {kind: "XV.ScrollableGroupbox", name: "planningGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.QuantityWidget", attr: "safetyStock"},
          {kind: "XV.NumberWidget", attr: "leadTime", scale: 0},
          {kind: "onyx.GroupboxHeader", content: "_parameters".loc() },
          {kind: "XV.ToggleButtonWidget", attr: "useParameters"},
          {kind: "XV.QuantityWidget", attr: "reorderLevel"},
          {kind: "XV.QuantityWidget", attr: "orderToQuantity"},
          {kind: "XV.QuantityWidget", attr: "minimumOrderQuantity"},
          {kind: "XV.QuantityWidget", attr: "maximumOrderQuantity"},
          {kind: "XV.QuantityWidget", attr: "multipleOrderQuantity"},
          {kind: "XV.ToggleButtonWidget", attr: "useParametersManual"}
        ]}
      ]},
      {kind: "XV.Groupbox", name: "locationPanel", title: "_locationControl".loc(),
        container: "panels", components: [
        {kind: "onyx.GroupboxHeader", content: "_locationControl".loc()},
        {kind: "XV.ScrollableGroupbox", name: "locationGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.ToggleButtonWidget", attr: "isLocationControl",
            label: "_multipleLocationControl".loc()},
          {kind: "XV.InputWidget", attr: "locationComment"},
          {kind: "XV.CheckboxWidget", attr: "useDefaultLocation"},
          {kind: "XV.InputWidget", attr: "userDefinedLocation"},
          {kind: "XV.LocationPicker", attr: "receiveLocation"},
          {kind: "XV.ToggleButtonWidget", attr: "isReceiveLocationAuto"},
          {kind: "XV.LocationPicker", attr: "stockLocation"},
          {kind: "XV.ToggleButtonWidget", attr: "isStockLocationAuto"}
        ]}
      ]},
      {kind: "XV.Groupbox", name: "restrictedPanel", title: "_restrictedLocations".loc(),
        container: "panels", components: [
        {kind: "onyx.GroupboxHeader", content: "_restrictedLocationsAllowed".loc()},
        {kind: "XV.ScrollableGroupbox", name: "restrictedGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.ItemSiteRestrictedLocationAssignmentBox",
            attr: "restrictedLocationsAllowed", name: "restrictedLocations" }
        ]}
      ]},
      {kind: "onyx.GroupboxHeader", container: "inventoryGroup", content: "_traceOptions".loc() },
      {kind: "XV.TraceSequenceWidget", container: "inventoryGroup", attr: "traceSequence"},
      {kind: "XV.ToggleButtonWidget", container: "inventoryGroup", attr: "isPerishable"},
      {kind: "XV.ToggleButtonWidget", container: "inventoryGroup", attr: "isPurchaseWarrantyRequired"},
      {kind: "XV.ToggleButtonWidget", container: "inventoryGroup", attr: "isAutoRegister"},
      {kind: "onyx.GroupboxHeader", container: "planningGroup", content: "_advanced".loc() },
      {kind: "XV.PlanningSystemPicker", container: "planningGroup", attr: "planningSystem"},
      {kind: "XV.NumberWidget", container: "planningGroup", attr: "orderGroup"},
      {kind: "XV.CheckboxWidget", container: "planningGroup", attr: "groupLeadtimeFirst"},
      {kind: "XV.ToggleButtonWidget", container: "planningGroup", attr: "isPlannedTransferOrders"},
      {kind: "XV.SupplySitePicker", container: "planningGroup", attr: "supplySite"}
    ];

    XV.appendExtension("XV.ItemSiteWorkspace", extensions);

    // Add in handling for cost methods
    var _isproto = XV.ItemSiteWorkspace.prototype,
      _recordIdChanged = _isproto.recordIdChanged,
      _newRecord = _isproto.newRecord,
      _statusChanged = _isproto.statusChanged,
      _setupPicker = _isproto.setupPicker;

    _.extend(_isproto, {
      newRecord: function () {
        _newRecord.apply(this, arguments);
        this.setupPicker();
        this.setupRestricted();
      },
      recordIdChanged: function () {
        _recordIdChanged.apply(this, arguments);
        this.setupPicker();
      },
      refreshCostMethods: function () {
        this.$.costMethodPicker.buildList();
      },
      refreshRestricted: function () {
        this.$.restrictedLocations.setSite(this.getValue().get("site"));
      },
      refreshSupplySites: function () {
        this.$.supplySitePicker.buildList();
        this.attributesChanged(this.getValue());
      },
      statusChanged: function () {
        _statusChanged.apply(this, arguments);
        var value = this.getValue(),
          status = value ? value.getStatus() : false;

        if (status === XM.Model.READY_CLEAN) {
          this.refreshRestricted();
        }
      },
      setupPicker: function () {
        var picker = this.$.costMethodPicker,
          model = this.getValue();

        // Remove any binding
        if (picker._model) {
          picker._model.off("costMethodsChange", this.refreshCostMethods, this);
          picker._model.off("supplySitesChange", this.refreshSupplySites, this);
          delete picker._model;
        }

        // Add a new one
        if (model && model.id) {
          model.on("costMethodsChange", this.refreshCostMethods, this);
          model.on("supplySitesChange", this.refreshSupplySites, this);
          picker._model = model; // Cache for future reference
          this.refreshCostMethods();
          this.refreshSupplySites();
        }
      },
      setupRestricted: function () {
        var restricted = this.$.restrictedLocations,
          model = this.getValue();

        // Remove any binding
        if (restricted._model) {
          restricted._model.off("change:site", this.refreshRestricted, this);
          delete restricted._model;
        }

        // Add a new one
        if (model && model.id) {
          model.on("change:site", this.refreshRestricted, this);
          restricted._model = model; // Cache for future reference
        }
      }
    });

    // ..........................................................
    // SITE EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.SiteEmailProfileWorkspace",
      kind: "XV.EmailProfileWorkspace",
      title: "_siteEmailProfile".loc(),
      model: "XM.SiteEmailProfile",
    });

    XV.registerModelWorkspace("XM.SiteEmailProfile", "XV.SiteEmailProfileWorkspace");

    // ..........................................................
    // SITE TYPE
    //

    extensions = [
      {kind: "XV.SiteEmailProfilePicker", attr: "emailProfile",
        container: "mainGroup"},
      {kind: "XV.SiteTypeCharacteristicsWidget", attr: "characteristics",
        container: "mainGroup"},
      {kind: "XV.SiteTypeWorkflowBox", attr: "workflow",
        container: "panels"}
    ];

    XV.appendExtension("XV.SiteTypeWorkspace", extensions);

    // ..........................................................
    // TRANSFER ORDER
    //

    enyo.kind({
      name: "XV.TransferOrderWorkspace",
      kind: "XV.Workspace",
      title: "_transferOrder".loc(),
      model: "XM.TransferOrder",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
                classes: "in-panel", fit: true, components: [
              {name: "overviewControl", components: [
                {kind: "XV.InputWidget", attr: "number"},
                {kind: "XV.DateWidget", attr: "orderDate"},
                {kind: "XV.DateWidget", attr: "packDate"},
                {kind: "XV.DateWidget", attr: "scheduleDate"},
                {kind: "XV.TransferOrderStatusPicker", attr: "status"},
                {kind: "onyx.GroupboxHeader", content: "_shipFrom".loc()},
                {kind: "XV.SitePicker", attr: "sourceSite", label: "_site".loc(),
                  showNone: false},
                {kind: "XV.AddressFieldsWidget",
                  name: "sourceAddressWidget", attr:
                  {name: "sourceName", line1: "sourceAddress1",
                    line2: "sourceAddress2", line3: "sourceAddress3",
                    city: "sourceCity", state: "sourceState",
                    postalCode: "sourcePostalCode", country: "sourceCountry"}
                },
                {kind: "XV.ContactWidget", attr: "sourceContact"},
                {kind: "onyx.GroupboxHeader", content: "_shipTo".loc()},
                {kind: "XV.SitePicker", attr: "destinationSite", label: "_site".loc(),
                  showNone: false},
                {kind: "XV.AddressFieldsWidget",
                  name: "destinationAddressWidget", attr:
                  {name: "destinationName", line1: "destinationAddress1",
                    line2: "destinationAddress2", line3: "destinationAddress3",
                    city: "destinationCity", state: "destinationState",
                    postalCode: "destinationPostalCode", country: "destinationCountry"}
                },
                {kind: "XV.ContactWidget", attr: "destinationContact"},
                {kind: "XV.TransferOrderCharacteristicsWidget", attr: "characteristics"},
                {kind: "onyx.GroupboxHeader", content: "_settings".loc()},
                {kind: "XV.AgentPicker", attr: "agent"},
                {kind: "XV.SitePicker", attr: "transitSite", showNone: false},
                {kind: "XV.ShipViaCombobox", attr: "shipVia"},
                {kind: "XV.CheckboxWidget", attr: "shipComplete"},
                {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
                {kind: "XV.TextArea", attr: "notes", fit: true}
              ]}
            ]}
          ]},
          {kind: "FittableRows", title: "_lineItems".loc(), name: "lineItemsPanel"},
          {kind: "FittableRows", title: "_workflow".loc(), name: "workflowPanel"},
          {kind: "XV.TransferOrderCommentBox", attr: "comments"},
          {kind: "XV.TransferOrderDocumentsBox", attr: "documents"}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        if (enyo.platform.touch) {
          this.$.lineItemsPanel.createComponents([
            {kind: "XV.TransferOrderLineItemBox", name: "transferOrderLineItemBox",
              attr: "lineItems", fit: true}
          ], {owner: this});
          this.$.workflowPanel.createComponents([
            {kind: "XV.TransferOrderWorkflowBox", attr: "workflow", fit: true}
          ], {owner: this});
        } else {
          this.$.lineItemsPanel.createComponents([
            {kind: "XV.TransferOrderLineGridBox", name: "transferOrderLineBox",
              attr: "lineItems", fit: true}
          ], {owner: this});
          this.$.workflowPanel.createComponents([
            {kind: "XV.TransferOrderWorkflowGridBox", attr: "workflow", fit: true}
          ], {owner: this});
        }
        this.processExtensions(true);
      }
    });

    XV.registerModelWorkspace("XM.TransferOrder", "XV.TransferOrderWorkspace");
    XV.registerModelWorkspace("XM.TransferOrderWorkflow", "XV.TransferOrderWorkspace");
    XV.registerModelWorkspace("XM.TransferOrderListItem", "XV.TransferOrderWorkspace");

    // ..........................................................
    // TRANSFER ORDER WORKFLOW
    //

    enyo.kind({
      name: "XV.TransferOrderWorkflowWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_transferOrderWorkflow".loc(),
      model: "XM.TransferOrderWorkflow",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          classes: "xv-top-panel", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.TransferOrderWorkflowTypePicker", attr: "workflowType"},
              {kind: "XV.WorkflowStatusPicker", attr: "status"},
              {kind: "XV.PriorityPicker", attr: "priority", showNone: false},
              {kind: "XV.NumberSpinnerWidget", attr: "sequence"},
              {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.DateWidget", attr: "startDate"},
              {kind: "XV.DateWidget", attr: "assignDate"},
              {kind: "XV.DateWidget", attr: "completeDate"},
              {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
              {kind: "XV.UserAccountWidget", attr: "owner"},
              {kind: "XV.UserAccountWidget", attr: "assignedTo"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "onCompletedPanel", title: "_completionActions".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
            {kind: "XV.ScrollableGroupbox", name: "completionGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.TransferOrderStatusPicker", attr: "completedParentStatus",
                noneText: "_noChange".loc(), label: "_nextStatus".loc()},
              {kind: "XV.DependenciesWidget",
                attr: {workflow: "parent.workflow", successors: "completedSuccessors"}}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "onDeferredPanel", title: "_deferredActions".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
            {kind: "XV.ScrollableGroupbox", name: "deferredGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.TransferOrderStatusPicker", attr: "deferredParentStatus",
                noneText: "_noChange".loc(), label: "_nextStatus".loc()},
              {kind: "XV.DependenciesWidget",
                attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}}
            ]}
          ]}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.TransferOrderLineWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_transferOrderLine".loc(),
      model: "XM.TransferOrderLine",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          classes: "xv-top-panel", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "lineNumber"},
              {kind: "XV.TransferOrderItemWidget", label: "_item".loc(),
                attr: {item: "item", transferOrder: "transferOrder"}},
              {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
              {kind: "XV.QuantityWidget", attr: "quantity", label: "_ordered".loc()},
              {kind: "XV.QuantityWidget", attr: "shipped"},
              {kind: "XV.QuantityWidget", attr: "received"},
              {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
              {kind: "XV.DateWidget", attr: "scheduleDate"},
              {kind: "XV.DateWidget", attr: "promiseDate"},
              {kind: "onyx.GroupboxHeader", content: "_cost".loc()},
              {kind: "XV.MoneyWidget",
                attr: {localValue: "unitCost"},
                label: "_unitCost".loc(), currencyShowing: false},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.TransferOrderLineCommentBox", attr: "comments"}
        ]}
      ]
    });

  };
}());
