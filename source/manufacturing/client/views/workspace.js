/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, _:true, Globalize: true, async:true*/

(function () {

  XV.WorkOrderOperationMixin = {
    headerAttrs: ["workOrder.name", " - #", "sequence", " ", "workCenter.code"],
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger", fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "sequence"},
            {kind: "XV.WorkCenterPicker", attr: "workCenter"},
            {kind: "XV.StandardOperationPicker", attr: "standardOperation"},
            {kind: "XV.OperationTypePicker", attr: "operationType"},
            {kind: "onyx.GroupboxHeader", content: "_production".loc()},
            {kind: "XV.QuantityWidget", attr: "workOrder.quantity",
              label: "_orderQuantity".loc()},
            {kind: "XV.UnitPicker", attr: "workOrder.item.inventoryUnit",
              label: "_orderUnit".loc()},
            {kind: "XV.UnitCombobox", attr: "productionUnit",
              label: "_operationUnit".loc(), showLabel: true},
            {kind: "XV.UnitRatioWidget", attr: "productionUnitRatio",
              label: "_unitRatio".loc()},
            {kind: "XV.QuantityWidget", attr: "operationQuantity",
              label: "_totalQuantity".loc()},
            {kind: "XV.NumberSpinnerWidget", attr: "executionDay"},
            {kind: "XV.DateWidget", attr: "scheduled", label: "_scheduled".loc()},
            {kind: "onyx.GroupboxHeader", content: "_inventory".loc()},
            {kind: "XV.CheckboxWidget", attr: "isAutoIssueComponents"},
            {kind: "XV.CheckboxWidget", attr: "isReceiveInventory"},
            {kind: "XV.LocationWidget", attr: "wipLocation"}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "throughputPanel",
          title: "_throughput".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_throughput".loc()},
          {kind: "XV.ScrollableGroupbox", name: "throughputGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "unitsPerMinute", showLabel: false},
            {kind: "XV.InputWidget", attr: "minutesPerUnit", showLabel: false},
            {kind: "onyx.GroupboxHeader", content: "_setup".loc()},
            {kind: "XV.NumberWidget", attr: "setupTime", scale: XT.MINUTES_SCALE,
              label: "_time".loc()},
            {kind: "XV.CheckboxWidget", attr: "isSetupReport",
              label: "_report".loc()},
            {kind: "XV.NumberWidget", attr: "setupConsumed",
              label: "_consumed".loc(),
              scale: XT.MINUTES_SCALE},
            {kind: "XV.NumberWidget", attr: "setupRemaining",
              label: "_remaining".loc(),
              scale: XT.MINUTES_SCALE},
            {kind: "onyx.GroupboxHeader", content: "_run".loc()},
            {kind: "XV.NumberWidget", attr: "runTime", scale: XT.MINUTES_SCALE,
              label: "_time".loc()},
            {kind: "XV.CheckboxWidget", attr: "isRunReport",
              label: "_report".loc()},
            {kind: "XV.NumberWidget", attr: "runConsumed",
              label: "_consumed".loc(),
              scale: XT.MINUTES_SCALE},
            {kind: "XV.NumberWidget", attr: "runRemaining",
              label: "_remaining".loc(),
              scale: XT.MINUTES_SCALE}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "descriptionPanel",
          title: "_description".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_description".loc()},
          {kind: "XV.ScrollableGroupbox", name: "descriptionGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "description1"},
            {kind: "XV.InputWidget", attr: "description2"},
            {kind: "XV.InputWidget", attr: "toolingReference"},
            {kind: "onyx.GroupboxHeader", content: "_instructions".loc()},
            {kind: "XV.TextArea", attr: "instructions", fit: true,
              name: "instructions"}
          ]}
        ]},
        {kind: "FittableRows", title: "_materials".loc(), name: "materialsPanel"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      var touch = enyo.platform.touch,
        materialKind = touch ? "XV.WorkOrderOperationMaterialBox" :
          "XV.WorkOrderOperationMaterialGridBox";
      this.$.materialsPanel.createComponents([
        {kind: materialKind, attr: "materials", fit: true}
      ], {owner: this});
    }
  };

  XT.extensions.manufacturing.initWorkspaces = function () {

    // ..........................................................
    // CONFIGURE
    //

    enyo.kind({
      name: "XV.ManufacturingWorkspace",
      kind: "XV.Workspace",
      title: "_manufacturing".loc(),
      model: "XM.Manufacturing",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_workOrder".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "WONumberGeneration",
                label: "_number".loc() + " " + "_policy".loc(),
                showNone: false},
              {kind: "XV.NumberWidget", attr: "NextWorkOrderNumber",
                label: "_nextNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "Routings",
                label: "_routings".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "WorkOrderChangeLog",
                label: "_workOrderChangeLog".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "PostMaterialVariances",
                label: "_postMaterialVariances".loc()},
              {kind: "XV.CostRecognitionPicker", attr: "JobItemCosDefault",
                label: "_jobItemCosDefault".loc(),
                showNone: false},
              {kind: "onyx.GroupboxHeader", content: "_explosion".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AutoExplodeWO",
                label: "_autoExplodeWO".loc()},
              {kind: "XV.PickerWidget", attr: "ExplodeWOEffective",
                label: "_explodeWorkOrderEffective".loc(),
                showNone: false,
                collection: "XM.explodeWoEffectives"},
              {kind: "XV.PickerWidget", attr: "woExplosionLevel",
                label: "_woExplosionLevel".loc(),
                showNone: false,
                collection: "XM.woExplosionLevels"},
              {kind: "onyx.GroupboxHeader", content: "_scheduling".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "UseSiteCalendar",
                label: "_siteCalendar".loc()}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // ISSUE MATERIAL
    //

    enyo.kind({
      name: "XV.IssueMaterialWorkspace",
      kind: "XV.IssueStockWorkspace",
      title: "_issueMaterial".loc(),
      model: "XM.IssueMaterial",
      saveText: "_issue".loc(),
      events: {
        onPrevious: "",
        onProcessingChanged: ""
      },
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_order".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.WorkOrderWidget", attr: "order"},
              {kind: "onyx.GroupboxHeader", content: "_item".loc()},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.InputWidget", attr: "unit.name", label: "_materialUnit".loc()},
              {kind: "XV.QuantityWidget", attr: "itemSite.quantityOnHand", label: "_qoh".loc()},
              {kind: "XV.QuantityWidget", attr: "qohOtherWhs", label: "_qohOther".loc()},
              {kind: "XV.QuantityWidget", attr: "required"},
              {kind: "XV.QuantityWidget", attr: "issued"},
              {kind: "onyx.GroupboxHeader", content: "_issue".loc()},
              {kind: "XV.QuantityWidget", attr: "toIssue", name: "toIssue", classes: "bold"},
              {kind: "XV.StickyCheckboxWidget", label: "_printLabel".loc(),
                name: "printLabel"
              }
            ]}
          ]},
          {kind: "XV.IssueStockDetailRelationsBox", attr: "itemSite.detail", name: "detail"}
        ]},
        {kind: "onyx.Popup", name: "distributePopup", centered: true, onHide: "popupHidden",
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
      ]
    });

    // ..........................................................
    // ITEM
    //

    var extensions = [
      {kind: "onyx.GroupboxHeader", content: "_manufacturing".loc(),
        container: "settingsGroup"},
      {kind: "XV.CheckboxWidget", attr: "isConfigured",
        container: "settingsGroup"},
      {kind: "XV.CheckboxWidget", attr: "isPicklist",
        container: "settingsGroup"}
    ];

    XV.appendExtension("XV.ItemWorkspace", extensions);

    // ..........................................................
    // ITEM SITE
    //

    extensions = [
      {kind: "XV.CheckboxWidget", attr: "isCreateWorkOrdersForSalesOrders",
        label: "_workOrders".loc(), container: "supplyPanel",
        addBefore: "createPurchaseOrders"},
      {kind: "XV.CheckboxWidget", attr: "isManufactured",
        label: "_manufactured".loc(),
        container: "supplyPanel", addBefore: "isPurchased"},
      {kind: "onyx.GroupboxHeader", content: "_createSupplyForWorkOrders".loc(),
        container: "supplyPanel", addBefore: "createSalesSupplyHeader"},
      {kind: "XV.CheckboxWidget", name: "createPurchaseRequestsForManufacturing",
        label: "_purchaseRequests".loc(),
        attr: "isCreatePurchaseRequestsForWorkOrders",
        container: "supplyPanel", addBefore: "createSalesSupplyHeader"}
    ];

    XV.appendExtension("XV.ItemSiteWorkspace", extensions);

    // ..........................................................
    // PLANNER CODE
    //

    extensions = [
      {kind: "XV.WorkOrderEmailProfilePicker", attr: "emailProfile",
        container: "mainGroup"},
      {kind: "XV.PlannerCodeWorkOrderWorkflowBox", attr: "workflow",
        container: "panels"}
    ];

    XV.appendExtension("XV.PlannerCodeWorkspace", extensions);

    // ..........................................................
    // POST PRODUCTION
    //

    enyo.kind({
      name: "XV.PostProductionWorkspace",
      kind: "XV.Workspace",
      title: "_postProduction".loc(),
      model: "XM.PostProduction",
      saveText: "_post".loc(),
      hideApply: true,
      hideSaveAndNew: true,
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
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.DateWidget", attr: "transactionDate",
                label: "_date".loc()},
              {kind: "XV.IssuableWorkOrderWidget", attr: "workOrder"},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
              {kind: "XV.QuantityWidget", attr: "ordered"},
              {kind: "XV.QuantityWidget", attr: "received"},
              {kind: "XV.QuantityWidget", attr: "balance"},
              {kind: "XV.QuantityWidget", attr: "undistributed", name: "undistributed",
                label: "_remainingToDistribute".loc()},
              {kind: "XV.QuantityWidget", attr: "toPost", name: "toPost",
                onValueChange: "toPostChanged"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true},
              {kind: "onyx.GroupboxHeader", content: "_options".loc()},
              {kind: "XV.CheckboxWidget", attr: "isBackflushMaterials"},
              // TODO - Should be StickyCheckboxWidget
              {kind: "XV.CheckboxWidget", attr: "isCloseOnPost", name: "isCloseOnPost"}
              /*{kind: "XV.StickyCheckboxWidget", name: "printPostProductionLabel",
                label: "_printLabelOnPost".loc()}*/
              /*
              {kind: "XV.StickyCheckboxWidget",
                label: "_scrapOnPost".loc(),
                name: "postProductionScrap",
                disabled: true} */
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

        // Hide detail if not applicable
        if (!model.requiresDetail()) {
          this.$.detail.hide();
          this.$.undistributed.hide();
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
      toPostChanged: function (inSender, inEvent) {
        var model = this.getValue();
        model.set("toPost", inSender.value);
        this.parent.parent.$.saveButton.setDisabled(false);
        this.handleDistributionLineDone();
      }
    });

    // ..........................................................
    // PRINT WORK ORDER FORM WORKSPACE
    //

    enyo.kind({
      name: "XV.PrintWorkOrderFormWorkspace",
      kind: "XV.PrintFormWorkspace",
      title: "_printWorkOrderForm".loc(),
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", classes: "in-panel", components: [
              {kind: "XV.WorkOrderWidget", attr: "order", label: "_workOrder".loc()},
              {kind: "XV.FormPicker", name: "formPicker", attr: "reportName"},
              {kind: "XV.PrinterPicker", name: "printer", attr: "printer",
                label: "_printer".loc(), onValueChange: "metaChanged"}
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.PrintForm", "XV.PrintWorkOrderFormWorkspace");

    // ..........................................................
    // PRINT WORK ORDER TRAVELER WORKSPACE
    //

    enyo.kind({
      name: "XV.PrintWorkOrderTravelerWorkspace",
      kind: "XV.PrintFormWorkspace",
      title: "_printWorkOrderTraveler".loc(),
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", classes: "in-panel", components: [
              {kind: "XV.WorkOrderWidget", attr: "order", name: "order",
                label: "_workOrder".loc()},
              {kind: "XV.CheckboxWidget", name: "releaseWorkOrder", attr: "releaseWorkOrder",
                label: "_releaseWorkOrder".loc(), onValueChange: "metaChanged"},
              {kind: "XV.CheckboxWidget", name: "printPickList", attr: "printPickList",
                label: "_printPickList".loc(), onValueChange: "metaChanged"},
              {kind: "XV.CheckboxWidget", name: "printRouting", attr: "printRouting",
                label: "_printRouting".loc(), onValueChange: "metaChanged"},
              {kind: "XV.CheckboxWidget", name: "printPackingList", attr: "printPackingList",
                label: "_printPackingList".loc(), onValueChange: "metaChanged"},
              {kind: "XV.CheckboxWidget", name: "printWorkOrderLabel", attr: "printWorkOrderLabel",
                label: "_printWorkOrderLabel".loc(), onValueChange: "metaChanged"},
              {kind: "XV.PrinterPicker", name: "printer", attr: "printer",
                label: "_printer".loc(), onValueChange: "metaChanged"}
            ]}
          ]}
        ]}
      ],
      /**
        If Printer and at least 1 print option selected, enable Save (Print) button.
      */
      attributesChanged: function (model, options) {
        this.inherited(arguments);
        if (this.$.printer.value && (
          this.$.printPickList.value || this.$.printRouting.value ||
          this.$.printPackingList.value || this.$.printWorkOrderLabel.value
          )) {
          this.parent.parent.$.saveButton.setDisabled(false);
        }
      },
      /**
        Special async handling for printing more than 1 report
      */
      save: function () {
        var that = this,
          orderModel = this.value.getValue("order"),
          printer = this.$.printer.value.id,
          printObj = [],
          printRpt = function (report, done) {
            var printSuccess = function (resp) {
              done();
            };
            that.print({model: orderModel, reportName: report, printer: printer, success: printSuccess});
          },
          finish = function (err, results) {
            that.doPrevious();
          };

        if (orderModel) {
          orderModel.releaseOrder();
        }
        if (this.$.printPickList.value) {
          printObj.push("PickList");
        }
        if (this.$.printRouting.value) {
          printObj.push("Routing");
        }
        if (this.$.printPackingList.value) {
          printObj.push("PackingList");
        }
        if (this.$.printWorkOrderLabel.value) {
          printObj.push("WOLabel");
        }

        async.mapSeries(printObj, printRpt, finish);
      }
    });

    XV.registerModelWorkspace("XM.PrintForm", "XV.PrintWorkOrderTravelerWorkspace");

    // ..........................................................
    // RETURN MATERIAL
    //

    enyo.kind({
      name: "XV.ReturnMaterialWorkspace",
      kind: "XV.Workspace",
      title: "_returnMaterial".loc(),
      model: "XM.ReturnMaterial",
      saveText: "_return".loc(),
      hideApply: true,
      hideSaveAndNew: true,
      dirtyWarn: false,
      events: {
        onPrevious: "",
        onProcessingChanged: ""
      },
      handlers: {
        onDistributionLineDone: "undistributed"
      },
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_order".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.WorkOrderWidget", attr: "order"},
              {kind: "onyx.GroupboxHeader", content: "_item".loc()},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.InputWidget", attr: "unit.name", label: "_materialUnit".loc()},
              {kind: "XV.QuantityWidget", attr: "itemSite.quantityOnHand", label: "_qoh".loc()},
              {kind: "XV.QuantityWidget", attr: "qohOtherWhs", label: "_qohOther".loc()},
              {kind: "XV.QuantityWidget", attr: "required"},
              {kind: "XV.QuantityWidget", attr: "issued"},
              {kind: "XV.QuantityWidget", attr: "undistributed", name: "undistributed",
                label: "_remainingToDistribute".loc()},
              {kind: "onyx.GroupboxHeader", content: "_issue".loc()},
              {kind: "XV.QuantityWidget", attr: "toIssue", name: "toIssue",
                label: "_toReturn".loc()},
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
          model.getStatus() === XM.Model.READY_DIRTY) {
          this.$.toIssue.focus();
          this.$.toIssue.$.input.selectContents();
          this._started = true;
        }

        // Hide detail if not applicable
        if (!model.requiresDetail()) {
          this.$.detail.hide();
          this.$.undistributed.hide();
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
      /**
        Overload: This version of save just validates the model and forwards
        on to callback. Designed specifically to work with `XV.TransactionList`.
      */
      save: function () {
        var callback = this.getCallback(),
          model = this.getValue(),
          workspace = this,
          transFunction = "returnMaterial";
        model.validate(function (isValid) {
          if (isValid) { callback(workspace, transFunction); }
        });
      },
      undistributed: function () {
        this.getValue().undistributed();
      }
    });

    // ..........................................................
    // WORK ORDER
    //
    var K = XM.Item;

    /** @private */
    var _doAction = function (action) {
      var model = this.getValue(),
        that = this,
        afterAction = function () {
          that.doModelChange({
            model: "XM.WorkOrder",
            id: model.id
          });
        };

      model[action + "Order"]({success: afterAction});
    };

    enyo.kind({
      name: "XV.WorkOrderWorkspace",
      kind: "XV.Workspace",
      title: "_workOrder".loc(),
      model: "XM.WorkOrder",
      actions: [
        {name: "implode", method: "implodeOrder", isViewMethod: true,
          privilege: "ImplodeWorkOrders", prerequisite: "canImplode"},
        {name: "explode", method: "explodeOrder",
          privilege: "ExplodeWorkOrders", prerequisite: "canExplode"},
        {name: "release", method: "releaseOrder", isViewMethod: true,
          privilege: "ReleaseWorkOrders", prerequisite: "canRelease"},
        {name: "recall", method: "recallOrder", isViewMethod: true,
          privilege: "RecallWorkOrders", prerequisite: "canRecall"},
        {name: "close", method: "closeOrder", isViewMethod: true,
          privilege: "CloseWorkOrders", prerequisite: "canClose"},
        {name: "issueMaterial", privilege: "IssueWoMaterials",
          isViewMethod: true, prerequisite: "canIssueMaterial", label: "_issueReturnMaterial".loc()},
        {name: "postProduction", privilege: "PostProduction",
          isViewMethod: true, prerequisite: "canPostProduction"},
        {name: "printWorkOrderTraveler", method: "doPrintForm",
          privilege: "PrintWorkOrderPaperWork", isViewMethod: true,
          formWorkspaceName: "XV.PrintWorkOrderTravelerWorkspace"}
      ],
      headerAttrs: ["name", " - ", "site.code", " ", "item.number"],
      handlers: {
        onActivatePanel: "activated"
      },
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.NumberWidget", attr: "number", formatting: false},
              {kind: "XV.InputWidget", attr: "name", label: "_number".loc()},
              {kind: "XV.WorkOrderStatusPicker", attr: "status"},
              {kind: "XV.ItemSiteWidget", attr: {item: "item", site: "site"},
               query: {parameters: [
                {attribute: "item.itemType", operator: "ANY",
                  value: [K.MANUFACTURED, K.BREEDER, K.PURCHASED,
                    K.OUTSIDE_PROCESS, K.TOOLING ]},
                {attribute: "isActive", value: true}
              ]}},
              {kind: "XV.PickerWidget", attr: "mode",
                showNone: false,
                collection: "XM.workOrderModes"},
              {kind: "XV.QuantityWidget", attr: "quantity"},
              {kind: "XV.NumberSpinnerWidget", attr: "leadTime",
                label: "_leadTime".loc()},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.DateWidget", attr: "startDate"},
              {kind: "XV.NumberSpinnerWidget", attr: "priority"},
              {kind: "XV.ProjectWidget", attr: "project"},
              {kind: "XV.WorkOrderCharacteristicsWidget", attr: "characteristics"},
              {kind: "onyx.GroupboxHeader", content: "_cost".loc()},
              {kind: "XV.MoneyWidget", attr: {localValue: "postedValue"},
                label: "_posted".loc(), currencyShowing: false},
              {kind: "XV.MoneyWidget", attr: {localValue: "receivedValue"},
                label: "_received".loc(), currencyShowing: false},
              {kind: "XV.MoneyWidget", attr: {localValue: "wipValue"},
                label: "_wip".loc(), currencyShowing: false},
              {kind: "XV.CostRecognitionPicker", attr: "costRecognition",
                label: "_recognitionMethod".loc(),
                noneText: "_notApplicable".loc()},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.WorkOrderTreeBox", attr: "tree"},
          {kind: "XV.CommentBox", model: "XM.WorkOrderComment", name: "commentsBox", attr: "comments"},
          {kind: "XV.WorkOrderTimeClockBox", attr: "timeClockHistory"}
        ]}
      ],
      activated: function (inSender, inEvent) {
        // A very unfortunate hack to deal with what appears to be a very deep Enyo
        // problem. When you edit a grid box in a child workspace, the grid boxes
        // in the parent are cleared out until you re-render each one specifically.
        if (inEvent.activated === this.parent.parent) {
          if (this.$.workOrderOperationGridBox) {
            this.$.workOrderOperationGridBox.render();
          }
          if (this.$.workOrderMaterialGridBox) {
            this.$.workOrderMaterialGridBox.render();
          }
          if (this.$.workOrderWorkflowGridBox) {
            this.$.workOrderWorkflowGridBox.render();
          }
        }
      },
      create: function () {
        this.inherited(arguments);
        var touch = enyo.platform.touch,
          materialKind = touch ? "XV.WorkOrderMaterialBox" : "XV.WorkOrderMaterialGridBox",
          routingKind = touch ? "XV.WorkOrderOperationBox" : "XV.WorkOrderOperationGridBox",
          workflowKind = touch ? "XV.WorkOrderWorkflowBox" : "XV.WorkOrderWorkflowGridBox";

        this.$.panels.createComponents([
          {kind: materialKind, attr: "materials",
            title: "_materials".loc(), addBefore: this.$.commentsBox, classes: "medium-panel"}
        ], {owner: this});

        if (XT.session.settings.get("Routings")) {
          this.$.panels.createComponents([
            {kind: routingKind, attr: "routings", name: "routingsPanel",
              title: "_routings".loc(), addBefore: this.$.commentsBox, classes: "medium-panel"}
          ], {owner: this});
        } else if (this.$.routingsPanel) {
          this.$.routingsPanel.hide();
        }

        this.$.panels.createComponents([
          {kind: workflowKind, attr: "workflow",
            title: "_workflow".loc(), addBefore: this.$.commentsBox, classes: "medium-panel"}
        ], {owner: this});
      },
      closeOrder: function () {
        _doAction.call(this, "close");
      },
      implodeOrder: function () {
        // Get a list of work order ids that are children
        // and emit change notice for each after implosion.
        var model = this.getValue(),
          workOrders = model.getWorkOrders(),
          ids = _.pluck(workOrders.models, "id"),
          that = this,
          afterImplode = function () {
            _.each(ids, function (id) {
              that.doModelChange({
                model: "XM.WorkOrder",
                id: id,
                includeChildren: false
              });
            });
          };

        model.implodeOrder({success: afterImplode});
      },
      recallOrder: function () {
        _doAction.call(this, "recall");
      },
      releaseOrder: function () {
        _doAction.call(this, "release");
      },
      issueMaterial: function () {
        var model = this.getValue(),
          that = this,
          afterClose = function () {
            // Refresh locally
            model.fetch();

            // Refresh any thing else (i.e. lists)
            that.doModelChange({
              model: "XM.WorkOrder",
              id: model.id
            });
          };

        this.doTransactionList({
          kind: "XV.IssueMaterial",
          key: model.id,
          callback: afterClose
        });
      },
      postProduction: function () {
        var  model = this.getValue(),
          that = this,
          afterPost = function () {
            // Refresh locally
            model.fetch();

            // Refresh any thing else (i.e. lists)
            that.doModelChange({
              model: "XM.WorkOrder",
              id: model.id
            });
          };

        this.doWorkspace({
          workspace: "XV.PostProductionWorkspace",
          id: model.id,
          callback: afterPost
        });
      }
    });

    XV.registerModelWorkspace("XM.WorkOrder", "XV.WorkOrderWorkspace");
    XV.registerModelWorkspace("XM.WorkOrderWorkflow", "XV.WorkOrderWorkspace");
    XV.registerModelWorkspace("XM.WorkOrderRelation", "XV.WorkOrderWorkspace");
    XV.registerModelWorkspace("XM.WorkOrderListItem", "XV.WorkOrderWorkspace");

    // ..........................................................
    // WORK ORDER EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.WorkOrderEmailProfileWorkspace",
      kind: "XV.EmailProfileWorkspace",
      title: "_workOrderEmailProfile".loc(),
      model: "XM.WorkOrderEmailProfile",
    });

    XV.registerModelWorkspace("XM.WorkOrderEmailProfile", "XV.WorkOrderEmailProfileWorkspace");

    // ..........................................................
    // WORK ORDER MATERIAL
    //

    enyo.kind({
      name: "XV.WorkOrderMaterialWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_material".loc(),
      model: "XM.WorkOrderMaterial",
      headerAttrs: ["workOrder.name", " - ", "item.number"],
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.ItemSiteWidget",
                attr: {item: "item", site: "workOrder.site"},
                query: {parameters: [
                {attribute: "item.itemType", operator: "ANY",
                  value: [K.MANUFACTURED, K.BREEDER, K.PURCHASED,
                    K.OUTSIDE_PROCESS, K.TOOLING, K.PHANTOM, K.CO_PRODUCT,
                    K.REFERENCE]},
                {attribute: "isActive", value: true}
              ]}},
              {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
              {kind: "XV.QuantityWidget", attr: "quantityPer",
                label: "_per".loc()},
              {kind: "XV.QuantityWidget", attr: "quantityFixed",
                label: "_fixed".loc()},
              {kind: "XV.UnitPicker",
                attr: {value: "unit", collection: "units"}},
              {kind: "XV.PercentWidget", attr: "scrap"},
              {kind: "XV.QuantityWidget", attr: "quantityRequired",
                label: "_required".loc()},
              {kind: "XV.IssueMethodPicker", attr: "issueMethod"},
              {kind: "XV.QuantityWidget", attr: "quantityIssued",
                label: "_issued".loc()}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "productionPanel",
            title: "_production".loc(), components: [
            {kind: "onyx.GroupboxHeader", content: "_production".loc()},
            {kind: "XV.ScrollableGroupbox", name: "productionGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.MoneyWidget", attr: {localValue: "cost"},
                label: "_cost".loc(),
                showCurrency: false,
                scale: XT.COST_SCALE},
              {kind: "XV.InputWidget", attr: "reference", fit: true},
              {kind: "XV.ToggleButtonWidget", attr: "isPicklist"},
              {kind: "onyx.GroupboxHeader", content: "_routing".loc()},
              {kind: "XV.WorkOrderOperationPicker",
                attr: {collection: "workOrder.routings", value: "operation"}},
              {kind: "XV.ToggleButtonWidget", attr: "isScheduleAtOperation"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // WORK ORDER ROUTING
    //

    var workOrderOperationWorkspace = {
      name: "XV.WorkOrderOperationWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_operation".loc(),
      model: "XM.WorkOrderOperation"
    };

    enyo.mixin(workOrderOperationWorkspace, XV.WorkOrderOperationMixin);
    enyo.kind(workOrderOperationWorkspace);

    // ..........................................................
    // WORK ORDER WORKFLOW
    //

    enyo.kind({
      name: "XV.WorkOrderWorkflowWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_workOrderWorkflow".loc(),
      model: "XM.WorkOrderWorkflow",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          classes: "xv-top-panel", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.WorkOrderWorkflowTypePicker", attr: "workflowType"},
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
              {kind: "XV.WorkOrderStatusPicker", attr: "completedParentStatus",
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
              {kind: "XV.WorkOrderStatusPicker", attr: "completedParentStatus",
                noneText: "_noChange".loc(), label: "_nextStatus".loc()},
              {kind: "XV.DependenciesWidget",
                attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // OPERATION TYPE
    //
    enyo.kind({
      name: "XV.OperationTypeWorkspace",
      kind: "XV.Workspace",
      title: "_operationType".loc(),
      model: "XM.OperationType"
    });

    XV.registerModelWorkspace("XM.OperationType", "XV.OperationTypeWorkspace");

    // ..........................................................
    // STANDARD OPERATION
    //
    enyo.kind({
      name: "XV.StandardOperationWorkspace",
      kind: "XV.Workspace",
      title: "_standardOperation".loc(),
      model: "XM.StandardOperation",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.InputWidget", attr: "description1"},
              {kind: "XV.InputWidget", attr: "description2"},
              {kind: "XV.WorkCenterPicker", attr: "workCenter"},
              {kind: "XV.OperationTypePicker", attr: "operationType"},
              {kind: "XV.InputWidget", attr: "toolingReference"},
              {kind: "XV.UnitPicker", attr: "productionUnit"},
              {kind: "XV.NumberWidget", attr: "productionUnitRatio"}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "timesPanel", title: "_standardTimes".loc(), components: [
            {kind: "onyx.GroupboxHeader", content: "_standardTimes".loc()},
            {kind: "XV.ScrollableGroupbox", name: "timesGroup", classes: "in-panel", components: [
              {kind: "XV.ToggleButtonWidget", attr: "standardTimes"},
              {kind: "onyx.GroupboxHeader", content: "_setupTimes".loc()},
              {kind: "XV.NumberWidget", attr: "setupTime"},
              {kind: "XV.StdOpReportsPicker", attr: "setupCostType"},
              {kind: "XV.ToggleButtonWidget", attr: "isReportSetup"},
              {kind: "onyx.GroupboxHeader", content: "_runTimes".loc()},
              {kind: "XV.NumberWidget", attr: "runTime"},
              {kind: "XV.StdOpReportsPicker", attr: "runCostType"},
              {kind: "XV.ToggleButtonWidget", attr: "isReportRun"},
              {kind: "onyx.GroupboxHeader", content: "_per".loc()},
              {kind: "XV.NumberWidget", attr: "runQuantityPer", label: "_per".loc()}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "instructionsPanel", title: "_instructions".loc(), components: [
            {kind: "onyx.GroupboxHeader", content: "_instructions".loc()},
            {kind: "XV.ScrollableGroupbox", name: "instructionsGroup", classes: "in-panel", components: [
              {kind: "XV.TextArea", attr: "instructions"}
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.StandardOperation", "XV.StandardOperationWorkspace");

  };
}());
