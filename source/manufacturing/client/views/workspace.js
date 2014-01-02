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
              {kind: "XV.PickerWidget", attr: "jobItemCosDefault",
                label: "_jobItemCosDefault".loc(),
                showNone: false,
                collection: "XM.jobItemCosDefault"}
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
      headerAttrs: ["number", "-", "site.code", " ", "item.number"],
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.ItemSiteWidget", attr: {item: "item", site: "site"}},
              {kind: "XV.PickerWidget", attr: "mode",
                showNone: false,
                collection: "XM.workOrderModes"},
              {kind: "XV.DateWidget", attr: "startDate"},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.InputWidget", attr: "getWorkOrderStatusString",
                label: "_status".loc()},
              {kind: "XV.NumberSpinnerWidget", attr: "priority"},
              {kind: "XV.ProjectWidget", attr: "project"},
              {kind: "XV.WorkOrderCharacteristicsWidget", attr: "characteristics"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "FittableRows", title: "_materials".loc(), name: "materialsPanel"},
          {kind: "FittableRows", title: "_routings".loc(), name: "routingsPanel"},
          {kind: "FittableRows", title: "_workflow".loc(), name: "workflowPanel"},
          {kind: "XV.CommentBox", model: "XM.WorkOrderComment", attr: "comments"}
        ]}
      ],
    });

    XV.registerModelWorkspace("XM.WorkOrder", "XV.WorkOrderWorkspace");
    XV.registerModelWorkspace("XM.WorkOrderWorkflow", "XV.WorkOrderWorkspace");
    XV.registerModelWorkspace("XM.WorkOrderRelation", "XV.WorkOrderWorkspace");
    XV.registerModelWorkspace("XM.WorkOrderListItem", "XV.WorkOrderWorkspace");

  };
}());
