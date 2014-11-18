/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true, async:true,
  window:true, setTimeout:true, SignaturePad:true, FileReader:true */

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
              {kind: "XV.ToggleButtonWidget", attr: "TransferOrderChangeLog",
                label: "_postTransferOrderChanges".loc()},
              {kind: "onyx.GroupboxHeader", content: "_costing".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowAvgCostMethod",
                label: "_allowAvgCostMethod".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowStdCostMethod",
                label: "_allowStdCostMethod".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowJobCostMethod",
                label: "_allowJobCostMethod".loc()},

              {kind: "onyx.GroupboxHeader", content: "_multipleSites".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "MultiWhs",
                label: "_enableMultipleSites".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "TONumberGeneration",
                label: "_transferOrderNumberPolicy".loc()},
              {kind: "XV.NumberWidget", attr: "NextToNumber",
                label: "_nextTransferOrderNumber".loc(), formatting: false},
              {kind: "XV.TransitSitePicker", attr: "DefaultTransitWarehouse",
                label: "_defaultTransitSite".loc()},

              {kind: "onyx.GroupboxHeader", content: "_options".loc()},
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
                onValueChange: "toReceiveChanged"},
              {kind: "XV.StickyCheckboxWidget", label: "_printLabel".loc(),
                name: "printEnterReceiptTraceLabel", showing: XT.session.config.printAvailable
              }
            ]}
          ]},
          {kind: "XV.ReceiptCreateLotSerialBox", attr: "detail", name: "detail"}
        ]}
      ],
      /**
        Overload: Some special handling for start up.

        On startup
        */
      attributesChanged: function () {
        this.inherited(arguments);
        var model = this.getValue();
        // Focus and select qty on start up.
        if (!this._started && model &&
          model.getStatus() === XM.Model.READY_CLEAN &&
          // If a qty was passed in, don't do the following because the user should distribute and move on.
          // Use case: Return Items that require detail distribution
          (model.get("toReceive") === null || model.get("toReceive") === 0)) {
          this.$.toReceive.setValue(null);
          this.$.toReceive.focus();
          this._started = true;
          this.$.detail.$.newButton.setDisabled(true);
        }
        // For Returns,
        if (model.get("toReceive") > 0) {
          this.handleDistributionLineDone();
        }
        // Hide detail if not applicable
        if (!model.requiresDetail()) {
          this.$.detail.hide();
          this.$.printEnterReceiptTraceLabel.hide();
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

        // XXX the $.input will be removable after the widget refactor
        if (XT.session.config.printAvailable &&
            model.requiresDetail() &&
            this.$.printEnterReceiptTraceLabel.$.input.getValue()) {
          this._printAfterPersist = true;
          // ultimately we're going to want to use meta to handle this throughout
          // XXX I'd prefer not to have to stringify this but it seems that enyo.ajax
          // trips up with nested objects, which get sent over the wire as "[Object object]"
          model._auxilliaryInfo = JSON.stringify({
            detail: _.map(model.get("detail").models, function (model) {
              return {
                quantity: model.get("quantity"),
                trace: model.get("trace"),
                location: model.get("location"),
                expireDate: Globalize.format(model.get("expireDate"), "d")
              };
            })
          });
        }

        model.validate(function (isValid) {
          if (isValid) { callback(workspace); }
        });
      }
    });

    // ..........................................................
    // INVOICE
    //

    extensions = [
      {kind: "XV.MoneyWidget", container: "lineItemBox.summaryPanel.summaryColumnTwo",
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
            {kind: "onyx.GroupboxHeader", content: "_issue".loc()},
            {kind: "XV.QuantityWidget", attr: "toIssue", name: "toIssue"},
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
              {kind: "XV.QuantityWidget", attr: "atShipping"}
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
        - Why?!? This was breaking InvoiceListItem-addWorkspace-callback-doPrevious
      destroy: function () {
        var model = this.getValue(),
          callback = this.getCallback();

        // If there's a callback then call it with false
        // to let it know to cancel process
        // Why?!? This was breaking InvoiceListItem-addWorkspace-callback-doPrevious
        if (model.isDirty() && callback) {
          callback(false);
        }
        this.inherited(arguments);
      }, */
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
        if (this.parent && this.parent.parent) { // hack to make tests pass. parent.parent is a bad habit
          this.parent.parent.$.applyButton.hide();
          this.parent.parent.$.saveButton.hide();
        }
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
    // PLANNED ORDER
    //

    enyo.kind({
      name: "XV.PlannedOrderWorkspace",
      kind: "XV.Workspace",
      title: "_plannedOrder".loc(),
      model: "XM.PlannedOrder",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.InputWidget", attr: "formatNumber",
                label: "_number".loc()},
              {kind: "XV.ItemSiteWidget",
                attr: {item: "item", site: "site"}},
              {kind: "XV.PickerWidget",
                attr: {value: "plannedOrderType", collection: "plannedOrderTypes"},
                label: "_orderType".loc(), valueAttribute: "id", showNone: false},
              {kind: "XV.SitePicker",
                attr: {value: "supplySite", collection: "supplySites"}},
              {kind: "XV.NumberSpinnerWidget", attr: "leadTime"},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.DateWidget", attr: "startDate"},
              {kind: "XV.QuantityWidget", attr: "quantity"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes"}
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.PlannedOrder", "XV.PlannedOrderWorkspace");
    XV.registerModelWorkspace("XM.PlannedOrderListItem", "XV.PlannedOrderWorkspace");
    XV.registerModelWorkspace("XM.PlannedOrderRelation", "XV.PlannedOrderWorkspace");

    if (XT.extensions.purchasing) {
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
      // PURCHASE REQUEST
      //

      enyo.kind({
        name: "XV.PurchaseRequestWorkspace",
        kind: "XV.Workspace",
        title: "_purchaseRequest".loc(),
        model: "XM.PurchaseRequest",
        components: [
          {kind: "Panels", arrangerKind: "CarouselArranger",
            fit: true, components: [
            {kind: "XV.Groupbox", name: "mainPanel", components: [
              {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
              {kind: "XV.ScrollableGroupbox", name: "mainGroup",
                classes: "in-panel", fit: true, components: [
                {kind: "XV.InputWidget", attr: "formatNumber",
                  label: "_number".loc()},
                {kind: "XV.ItemSiteWidget",
                  attr: {item: "item", site: "site"}},
                {kind: "XV.DateWidget", attr: "dueDate"},
                {kind: "XV.QuantityWidget", attr: "quantity"},
                {kind: "XV.ProjectWidget", attr: "project"},
                {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
                {kind: "XV.TextArea", attr: "notes"}
              ]}
            ]}
          ]}
        ]
      });

      XV.registerModelWorkspace("XM.PurchaseRequest", "XV.PurchaseRequestWorkspace");
      XV.registerModelWorkspace("XM.PurchaseRequestListItem", "XV.PurchaseRequestWorkspace");
      XV.registerModelWorkspace("XM.PurchaseRequestRelation", "XV.PurchaseRequestWorkspace");
    }

    // ..........................................................
    // BILLING (INVOICE AND RETURN)
    //

    if (XT.extensions.billing) {
      var lineExtensions = [
        {kind: "XV.CheckboxWidget", attr: "updateInventory", container: "mainGroup"}
      ];
      XV.appendExtension("XV.InvoiceLineWorkspace", lineExtensions);
      XV.appendExtension("XV.ReturnLineWorkspace", lineExtensions);

      var headerExtensions = [
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
        },
        {kind: "XV.MoneyWidget", container: "lineItemBox.summaryPanel.summaryColumnTwo",
          addBefore: "taxTotal", attr: {localValue: "freight", currency: "currency"},
          label: "_freight".loc(), currencyShowing: false, defer: true},
        {kind: "onyx.GroupboxHeader", content: "_shipping".loc(), container: "settingsPanel"},
        {kind: "XV.ShipZonePicker", attr: "shipZone", container: "settingsPanel"},
      ];
      XV.appendExtension("XV.InvoiceWorkspace", headerExtensions);
      XV.appendExtension("XV.ReturnWorkspace", headerExtensions);

      var invoiceHeaderExtensions = [
        {kind: "XV.ShippingChargePicker", attr: "shipCharge", container: "settingsPanel"}
      ];
      XV.appendExtension("XV.InvoiceWorkspace", invoiceHeaderExtensions);

      // #refactor use an enyo augments() or perhaps some new enyo 2.3 feature
      // Invoice
      var oldAttributesChanged = XV.InvoiceWorkspace.prototype.attributesChanged;
      var oldControlValueChanged = XV.InvoiceWorkspace.prototype.controlValueChanged;
      _.extend(XV.InvoiceWorkspace.prototype, {
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

      // #refactor use an enyo augments() or perhaps some new enyo 2.3 feature
      oldAttributesChanged = XV.ReturnWorkspace.prototype.attributesChanged;
      oldControlValueChanged = XV.ReturnWorkspace.prototype.controlValueChanged;
      _.extend(XV.ReturnWorkspace.prototype, {
        customerChanged: function () {
          var customer = this.$.customerWidget.getValue();

          if (customer) {
            this.$.customerShiptoWidget.setDisabled(false);
            this.$.customerShiptoWidget.addParameter({
              attribute: "customer.number",
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
      {kind: "XV.Groupbox", container: "panels",
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

    var _soproto = XV.SalesOrderWorkspace.prototype,
      _attributesChanged = _soproto.attributesChanged;

    // Add methods
    _.extend(_soproto, {
      attributesChanged: function () {
        _attributesChanged.apply(this, arguments);
        //  This Order has been saved, send event to be handled by the ItemSite Widget
        //  and have it's published value, 'canEditItemSite' set to false.
        var model = this.getValue();
        if (model.status !== XM.Model.READY_NEW) {
          this.waterfallDown("onModelNotNew", {canEditItemSite: false});
        }
      }
    });

    extensions = [
      {kind: "XV.MoneyWidget", container: "salesOrderLineItemBox.summaryPanel.summaryColumnTwo",
        addBefore: "taxTotal", attr: {localValue: "freight", currency: "currency"},
        label: "_freight".loc(), currencyShowing: false, defer: true},
    ];

    XV.appendExtension("XV.SalesOrderWorkspace", extensions);

    //
    // SIGNATURE CAPTURE ON SALES ORDER WORKSPACE
    //

    var signaturePad;
    var enableSignaturePad = function () {
      var canvas = window.document.getElementById("signature-canvas");

      // Adjust canvas coordinate space taking into account pixel ratio,
      // to make it look crisp on mobile devices.
      // This also causes canvas to be cleared.
      var resizeCanvas = function () {
        var ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
      };

      var oldResize = window.onresize;
      window.onresize = function () {
        if (oldResize) {
          oldResize.apply(this, arguments);
        }
        resizeCanvas();
      };
      setTimeout(function () {
        // wait for... something
        resizeCanvas();
      }, 1);

      signaturePad = new SignaturePad(canvas);
    };

    var thePad = {
      components: [
        {classes: "m-signature-pad--body", components: [
          {tag: "canvas", id: "signature-canvas", style: "width:500px;"}
        ]}
      ],
      accessSignaturePad: function () {
        return signaturePad;
      },
      rendered: function () {
        enableSignaturePad();
      },
      getValueAsync: function (callback) {
        return signaturePad.isEmpty() ? null : signaturePad._canvas.toBlob(callback, "png", true);
      }
    };

    var createFile = function (data, salesOrder, callback) {
      var reader = new FileReader(),
        file = new XM.File(),
        fileRelation = new XM.FileRelation(),
        readBlob = function (done) {
          reader.onload = function () {
            done();
          };
          reader.readAsBinaryString(data); // async
        },
        saveFile = function (done) {
          var filename =  "_salesOrder".loc().replace(/ /g, "") + salesOrder.id + "_signature".loc();

          file.initialize(null, {isNew: true});
          file.set({
            data: reader.result,
            name: filename,
            description: filename.toLowerCase() + ".png"
          });
          file.once("status:READY_CLEAN", function () {
            done();
          });
          file.save();
        },
        fetchFileRelation = function (done) {
          fileRelation.fetch({id: file.id, success: function () {
            done();
          }});
        },
        createDocumentAssociation = function (done) {
          var docAss = new XM.DocumentAssociation();
          docAss.initialize(null, {isNew: true});
          docAss.set({
            sourceType: "S",
            targetType: "FILE",
            target: fileRelation,
            purpose: "S"
          });
          salesOrder.get("documents").add(docAss);
          done();
        };

      async.series([
        readBlob,
        saveFile,
        fetchFileRelation,
        createDocumentAssociation
      ], callback);
    };

    _soproto.popupSignature = function () {
      var that = this;

      this.doNotify({
        message: "_signHere".loc(),
        type: XM.Model.OK_CANCEL,
        component: thePad,
        callback: function (response) {
          if (response.answer === null) {
            // CANCEL
            signaturePad.clear();
            return;
          }
          createFile(response.componentValue, that.value, function () {
            // The document has been created and associated
          });

        }
      });
    };
    _soproto.actions.push(
      {name: "signature", method: "popupSignature", isViewMethod: true}
    );


    // ..........................................................
    // SALES ORDER LINE
    //

    XV.appendExtension("XV.SalesOrderLineWorkspace", orderLineExts);

    _.extend(XV.SalesOrderLineWorkspace.prototype, {
      /**
        Intercept notifications to see if there's
        a request for an item source
      */
      notify: XV.SalesOrderNotify
    });

    var soLineExts = [
      {kind: "onyx.GroupboxHeader", content: "_order".loc(),
        container: "supplyGroup"},
      {kind: "XV.CheckboxWidget", attr: "createOrder",
        container: "supplyGroup"},
      {kind: "XV.InputWidget", attr: "formatOrderType",
        container: "supplyGroup", label: "_type".loc()},
      {kind: "XV.InputWidget", attr: "childOrder.orderNumber",
        container: "supplyGroup", label: "_number".loc()},
      {kind: "XV.InputWidget", attr: "childOrder.formatStatus",
        container: "supplyGroup", label: "_status".loc()},
      {kind: "XV.InputWidget", attr: "childOrder.quantity",
        container: "supplyGroup", label: "_quantity".loc()},
      {kind: "XV.DateWidget", attr: "childOrder.dueDate",
        container: "supplyGroup", label: "_dueDate".loc()},
      {kind: "XV.CheckboxWidget", attr: "isDropShip",
       container: "supplyGroup"},
      {kind: "XV.PurchasePriceWidget", attr: "purchaseCost",
       container: "supplyGroup"},
      {kind: "onyx.GroupboxHeader", content: "_shipping".loc(),
        container: "supplyGroup"},
      {kind: "XV.QuantityWidget", attr: "shipped",
        container: "supplyGroup"},
      {kind: "XV.QuantityWidget", attr: "atShipping",
        container: "supplyGroup"}
    ];

    XV.appendExtension("XV.SalesOrderLineWorkspace", soLineExts);
    
    // ..........................................................
    // SCRAP TRANSACTION
    //

    enyo.kind({
      name: "XV.ScrapTransactionWorkspace",
      kind: "XV.Workspace",
      title: "_scrapTransaction".loc(),
      model: "XM.ScrapTransaction",
      backText: "_cancel".loc(),
      saveText: "_post".loc(),
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
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.DateWidget", attr: "transactionDate",
                label: "_date".loc()},
              {kind: "XV.ItemSiteWidget",
                attr: {item: "item", site: "site"}},
              {kind: "XV.InputWidget", attr: "documentNumber"},
              {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
              {kind: "XV.QuantityWidget", attr: "toScrap", label: "_scrap".loc()},
              {kind: "XV.QuantityWidget", attr: "quantityBefore"},
              {kind: "XV.QuantityWidget", attr: "quantityAfter"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true},
            ]}
          ]},
          {kind: "XV.ScrapItemDetailRelationsBox", attr: "detail", name: "detail"}
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
      
      attributesChanged: function () {
        this.inherited(arguments);
        var model = this.getValue();

        // Hide detail if not applicable
        if (!model.requiresDetail()) {
          this.$.detail.hide();
          this.parent.parent.$.menu.refresh();
        }
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
    // RELOCATE INVENTORY TRANSACTION
    //

    enyo.kind({
      name: "XV.RelocateInventoryWorkspace",
      kind: "XV.Workspace",
      title: "_relocateInventory".loc(),
      model: "XM.RelocateInventory",
      backText: "_cancel".loc(),
      saveText: "_post".loc(),
      hideApply: true,
      hideRefresh: true,
      dirtyWarn: false,
      events: {
        onPrevious: ""
      },
      handlers: {
        onSourceSelectionChanged: "toggleSelection",
        onTargetSelectionChanged: "toggleSelection"
      },
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.DateWidget", attr: "transactionDate",
                label: "_date".loc()},
              {kind: "XV.ItemSiteWidget", attr: {item: "item", site: "site"},
                query: {parameters: [ {attribute: "isActive", value: true },
                  {attribute: "locationControl", value: true}
              ]}
              },
              {kind: "XV.QuantityWidget", attr: "quantity"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true},
              {kind: "XV.CheckboxWidget", attr: "defaultToTarget", name: "defaultToTarget"}
            ]}
          ]},
          {kind: "XV.LocationInventoryRelationsBox", attr: "source", name: "source"},
          {kind: "XV.LocationTargetRelationsBox", attr: "target", name: "target"}
        ]}
      ],
      
      attributesChanged: function () {
        this.inherited(arguments);
        var model = this.getValue();

        // Hide defaultToTarget checkbox if not applicable
        if (!model.showDefaultToTarget()) {
          this.$.defaultToTarget.hide();
          this.parent.parent.$.menu.refresh();
        }
      },
      
      /**
        When Source/Target has been selected or deselected, handle marking item as selected.
      */
      toggleSelection: function (inSender, inEvent) {
        var model = inEvent.model,
          isSelected = inEvent.isSelected;
        if (!model) { return; }
        if (isSelected) {
          model.setValue("isSelected", true);
        } else {
          model.setValue("isSelected", false);
        }
      }

    });
        
    // ..........................................................
    // SHIPMENT
    //

    enyo.kind({
      name: "XV.ShipmentWorkspace",
      kind: "XV.Workspace",
      title: "_shipment".loc(),
      model: "XM.Shipment",
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
        onPrint: "",
        onPrevious: ""
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
          {kind: "XV.ShipmentLineRelationsBox", attr: "lineItems", name: "lineItems"}
        ]}
      ],
      attributesChanged: function (model, options) {
        this.inherited(arguments);
        // If Tranfer Order remove irrelevant options
        if (model.getValue("order.type") === XM.Order.TRANSFER_ORDER) {
          this.$.approveForBillingCheckbox.setChecked(false);
          this.$.createInvoiceCheckbox.setChecked(false);
          this.$.approveForBillingCheckbox.hide();
          this.$.createInvoiceCheckbox.hide();
        }
      },
      handleApproveCheckboxChange: function (inSender, inEvent) {
        var createInvoice = this.$.createInvoiceCheckbox.isChecked(),
          approveForBilling = this.$.approveForBillingCheckbox.isChecked();

        this.$.createInvoiceCheckbox.setDisabled(!approveForBilling);
        this.$.createInvoiceCheckbox.setChecked(approveForBilling && createInvoice);

        return true;
      },
      create: function (options) {
        this.inherited(arguments);
        var canBill = XT.session.privileges.get('SelectBilling'),
          autoBill = canBill && XT.session.settings.get('AutoSelectForBilling');

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
            that.doPrevious();
          }
        });

        this.inherited(arguments);
        if (this.$.printPacklist.$.input.checked) {
          this.print();
        }
      }
    });


    // ..........................................................
    // SITE
    //
    XV.SiteWorkspace.prototype.actions = XV.SiteWorkspace.prototype.actions || [];
    XV.SiteWorkspace.prototype.actions.push(
      {name: "printLocations", method: "printLocations", isViewMethod: true}
    );
    XV.SiteWorkspace.prototype.printLocations = function (done) {
      var that = this,
        siteId = this.value.id,
        locations = new XM.LocationCollection(),
        siteLocations,
        i = 0,
        print = function () {
          siteLocations = locations.filter(function (model) {
            return model.get("site").id === siteId;
          });

          if (siteLocations.length === 0) {
            that.doNotify({message: "_noLocationsForSite".loc(), type: XM.Model.WARNING });
          }

          _.each(siteLocations, function (model) {
            if (XT.session.config.printAvailable) {
              // send it to be printed silently by the server
              model.doPrint();
              done();
            } else {
              // no print server set up: just pop open a tab
              i++;
              // a hack to ensure that all these reports get downloaded
              // hopefully people will do this from silent-print
              setTimeout(function () {
                window.open(XT.getOrganizationPath() + model.getReportUrl("download"),
                  "_newtab");
              }, i * 100);
            }
          });
        };
      locations.fetch({success: print});
    };

    XV.SiteWorkspace.prototype.isTransitSiteChange = function (inSender, inEvent) {
      var isTransitSite = inEvent.value;
      if (!_.isNull(inEvent.value)) {
        // Hide irrelevant settings depending on transit vs. inventory site.
        this.$.inventorySiteGroup.setShowing(!isTransitSite);
        this.$.transitSiteGroup.setShowing(isTransitSite);
      }
    };

    extensions = [
      {kind: "XV.CheckboxWidget", container: "mainSubgroup", addBefore: "contactWidget",
        attr: "isTransitSite", onValueChange: "isTransitSiteChange"},
      {kind: "XV.Groupbox", name: "settingsPanel", title: "_settings".loc(),
        container: "panels", addBefore: "commentsPanel", components: [
        {kind: "XV.ScrollableGroupbox", name: "inventorySiteGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "onyx.GroupboxHeader", content: "_inventorySiteSettings".loc()},
          {kind: "XV.CheckboxWidget", attr: "isShippingSite"},
          {kind: "XV.TaxZonePicker", attr: "taxZone"},
          {kind: "XV.InputWidget", attr: "incoterms"},
          {kind: "XV.MoneyWidget", currencyDisabled: true,
            attr: {localValue: "shippingCommission", currency: "wageCurrency"}},
          {kind: "XV.CheckboxWidget", attr: "isUseSlips"},
          {kind: "XV.CheckboxWidget", attr: "isUseZones"},
          {kind: "XV.NumberSpinnerWidget", attr: "schedulingSequence"}
        ]},
        {kind: "XV.ScrollableGroupbox", name: "transitSiteGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "onyx.GroupboxHeader", content: "_transitSiteSettings".loc()},
          {kind: "XV.CheckboxWidget", attr: "isDefaultTransitSite"},
          {kind: "XV.ShipViaCombobox", attr: "shipVia"},
          {kind: "XV.CostCategoryPicker", attr: "costCategory"},
          // TODO - Add Default Shipping Form picker
          {kind: "onyx.GroupboxHeader", content: "_shipping".loc() + " " + "_notes".loc()},
          {kind: "XV.TextArea", attr: "shippingNotes", fit: true}
        ]}
      ]}
    ];

    XV.appendExtension("XV.SiteWorkspace", extensions);

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
          {kind: "XV.LocationWidget", attr: "receiveLocation"},
          {kind: "XV.ToggleButtonWidget", attr: "isReceiveLocationAuto"},
          {kind: "XV.LocationWidget", attr: "stockLocation"},
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
                {kind: "XV.TransitSitePicker", attr: "transitSite", showNone: false},
                {kind: "XV.ShipViaCombobox", attr: "shipVia"},
                {kind: "XV.CheckboxWidget", attr: "shipComplete"},
                {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
                {kind: "XV.TextArea", attr: "notes", fit: true}
              ]}
            ]}
          ]},
          {kind: "XV.TransferOrderCommentBox", name: "commentsPanel", attr: "comments"},
          {kind: "XV.TransferOrderDocumentsBox", attr: "documents"}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        if (enyo.platform.touch) {
          this.$.panels.createComponents([
            {kind: "XV.TransferOrderLineItemBox", name: "transferOrderLineItemBox",
              title: "_lineItems".loc(), attr: "lineItems",
                addBefore: this.$.commentsPanel, classes: "medium-panel"}
          ], {owner: this});
          this.$.panels.createComponents([
            {kind: "XV.TransferOrderWorkflowBox", attr: "workflow",
              title: "_workflow".loc(), addBefore: this.$.commentsPanel, classes: "medium-panel"}
          ], {owner: this});
        } else {
          this.$.panels.createComponents([
            {kind: "XV.TransferOrderLineGridBox", name: "transferOrderLineBox",
              title: "_lineItems".loc(), attr: "lineItems", addBefore: this.$.commentsPanel}
          ], {owner: this});
          this.$.panels.createComponents([
            {kind: "XV.TransferOrderWorkflowGridBox", attr: "workflow",
              title: "_workflow".loc(), addBefore: this.$.commentsPanel}
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
