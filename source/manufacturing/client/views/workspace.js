/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true*/

(function () {

  XT.extensions.manufacturing.initWorkspaces = function () {

    // ..........................................................
    // CONFIGURE
    //

    enyo.kind({
      name: "XV.ManufacturingWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_manufacture".loc(),
      model: "XM.Manufacturing",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_workOrder".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "WONumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.NumberWidget", attr: "NextWorkOrderNumber",
                label: "_nextNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "AutoExplodeWO",
                label: "_autoExplodeWO".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "WorkOrderChangeLog",
                label: "_workOrderChangeLog".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "PostMaterialVariances",
                label: "_postMaterialVariances".loc()},
              {kind: "XV.PickerWidget", attr: "explodeWOEffective",
                label: "_explodeWorkOrderEffective".loc(),
                showNone: false,
                collection: "XM.explodeWoEffective"},
              {kind: "XV.PickerWidget", attr: "woExplosionLevel",
                label: "_woExplosionLevel".loc(),
                showNone: false,
                collection: "XM.woExplosionLevel"},
              {kind: "XV.CostRecognitionPicker", attr: "jobItemCosDefault"}
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
              {kind: "XV.QuantityWidget", attr: "required"},
              {kind: "XV.QuantityWidget", attr: "issued"},
              {kind: "onyx.GroupboxHeader", content: "_issue".loc()},
              {kind: "XV.QuantityWidget", attr: "toIssue", name: "toIssue", classes: "bold"},
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
      ]
    });

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
      allowNew: false,
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
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.InputWidget", attr: "getWorkOrderStatusString", label: "_status".loc()}
              /* Leave these out until there is functionality to handle them when posting.
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true},
              {kind: "onyx.GroupboxHeader", content: "_options".loc()},
              {kind: "XV.CheckboxWidget", attr: "isBackflushMaterials"},
              {kind: "XV.StickyCheckboxWidget", label: "_closeWorkOrderAfterPosting".loc(),
                name: "closeWorkOrderAfterPosting"},
              {kind: "XV.StickyCheckboxWidget", label: "_scrapOnPost".loc(),
                name: "scrapOnPost"}*/
            ]}
          ]},
          {kind: "XV.Groupbox", name: "quantityPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
            {kind: "XV.ScrollableGroupbox", name: "quantityGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.QuantityWidget", attr: "ordered"},
              {kind: "XV.QuantityWidget", attr: "received"},
              {kind: "XV.QuantityWidget", attr: "balance"},
              {kind: "XV.QuantityWidget", attr: "undistributed", name: "undistributed",
                label: "_remainingToDistribute".loc()},
              {kind: "onyx.GroupboxHeader", content: "_post".loc()},
              {kind: "XV.QuantityWidget", attr: "toPost", name: "toPost",
                onValueChange: "toPostChanged",
                label: "_toPost".loc()}
            ]}
          ]},
          {kind: "XV.PostProductionCreateLotSerialBox", attr: "detail", name: "detail"}
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
          this.$.toPost.setValue(null);
          this.$.toPost.focus();
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
      handleDistributionLineDone: function () {
        var undistributed = this.getValue().undistributed();
        if (undistributed > 0) {
          this.$.detail.newItem();
        } else if (undistributed < 0) {
          this.error(this.getValue(), XT.Error.clone("xt2025"));
        }
      },
      toPostChanged: function (inSender, inEvent) {
        var model = this.getValue();
        model.set("toPost", inSender.value);
        this.handleDistributionLineDone();
      },
      /**
        If distribution records, cycle through and build params/options for server dispatch.
        Otherwise, populate params and send to server for dispatch.
      */
      save: function () {
        var that = this,
          model = this.getValue(),
          distributionModels = this.$.detail.getValue().models,
          distributionModel,
          options = {},
          dispOptions = {},
          details = [],
          data = [],
          i,
          params,
          workOrder = model.id,
          quantity = model.get(model.quantityAttribute),
          transDate = model.transactionDate,
          backflush = model.get("isBackflushMaterials");
        options.asOf = transDate;
        model.validate(function (isValid) {
          if (isValid) {
            // Cycle through the detailModels and build the detail object
            if (distributionModels.length > 0) {
              for (i = 0; i < distributionModels.length; i++) {
                distributionModel = distributionModels[i];
                details.push({
                  quantity: distributionModel.getValue("quantity"),
                  location: distributionModel.getValue("location.uuid"),
                  trace: distributionModel.getValue("trace"),
                  expiration: distributionModel.getValue("expireDate"),
                  warranty: distributionModel.getValue("warrantyDate")
                });
                options.detail = details;
                params = {
                    workOrder: model.id,
                    quantity: quantity,
                    options: options
                  };
                data.push(params);
              }
              /* All the detail distribution models have been processed/added to params,
                send to server.
              */
              XM.Manufacturing.transactItem(data, dispOptions, "postProduction");
            } else { // No detail needed, fill out params and send to server.
              params = {
                workOrder: model.id,
                quantity: quantity,
                options: options
              };
              data.push(params);
              XM.Manufacturing.transactItem(data, dispOptions, "postProduction");
            }
            // Todo - refresh list so we can see the new qty that we just received.
            that.doPrevious();
          }
        });
      }
    });

    // ..........................................................
    // WORK ORDER
    //

    enyo.kind({
      name: "XV.WorkOrderWorkspace",
      kind: "XV.Workspace",
      title: "_workOrder".loc(),
      model: "XM.WorkOrder",
      headerAttrs: ["name", " - ", "site.code", " ", "item.number"],
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
              {kind: "XV.ItemSiteWidget", attr: {item: "item", site: "site"}},
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
          {kind: "FittableRows", title: "_materials".loc(), name: "materialsPanel"},
          {kind: "FittableRows", title: "_routings".loc(), name: "routingsPanel"},
          {kind: "FittableRows", title: "_workflow".loc(), name: "workflowPanel"},
          {kind: "XV.CommentBox", model: "XM.WorkOrderComment", attr: "comments"},
          {kind: "XV.WorkOrderTimeClockBox", attr: "timeClockHistory"}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        var touch = enyo.platform.touch,
          materialKind = touch ? "XV.WorkOrderMaterialBox" : "XV.WorkOrderMaterialGridBox",
          routingKind = touch ? "XV.WorkOrderOperationBox" : "XV.WorkOrderOperationGridBox",
          workflowKind = touch ? "XV.WorkOrderWorkflowBox" : "XV.WorkOrderWorkflowGridBox";

        this.$.materialsPanel.createComponents([
          {kind: materialKind, attr: "materials", fit: true}
        ], {owner: this});

        if (XT.session.settings.get("Routings")) {
          this.$.routingsPanel.createComponents([
            {kind: routingKind, attr: "routings", fit: true}
          ], {owner: this});
        } else {
          this.$.routingsPanel.hide();
        }

        this.$.workflowPanel.createComponents([
          {kind: workflowKind, attr: "workflow", fit: true}
        ], {owner: this});
      }
    });

    XV.registerModelWorkspace("XM.WorkOrder", "XV.WorkOrderWorkspace");
    XV.registerModelWorkspace("XM.WorkOrderWorkflow", "XV.WorkOrderWorkspace");
    XV.registerModelWorkspace("XM.WorkOrderRelation", "XV.WorkOrderWorkspace");
    XV.registerModelWorkspace("XM.WorkOrderListItem", "XV.WorkOrderWorkspace");

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

    enyo.kind({
      name: "XV.WorkOrderOperationWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_operation".loc(),
      model: "XM.WorkOrderOperation",
      headerAttrs: ["workOrder.name", " - #", "sequence", " ", "workCenter.code"],
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "sequence"},
              {kind: "XV.WorkCenterPicker", attr: "workCenter"},
              {kind: "XV.StandardOperationPicker", attr: "standardOperation"},
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
              {kind: "XV.LocationPicker", attr: "wipLocation"}
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
    });

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

  };
}());
