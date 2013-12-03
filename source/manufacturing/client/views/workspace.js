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
      title: "_configure".loc() + " " + "_manufacturing".loc(),
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
                label: "_explodeWorkOrderEffective".loc(), collection: "XM.explodeWOEffective"},
              {kind: "XV.PickerWidget", attr: "woExplosionLevel",
                label: "_woExplosionLevel".loc(), collection: "XM.woExplosionLevel"},
              {kind: "XV.PickerWidget", attr: "jobItemCosDefault",
                label: "_jobItemCosDefault".loc(), collection: "XM.jobItemCosDefault"}
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
              {kind: "XV.QuantityWidget", attr: "qtyRequired"},
              {kind: "XV.QuantityWidget", attr: "qtyIssued"},
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
        onDistributionLineDone: "handleDistributionLineDone",
        onDistributionLineNew: "handleDistributionLineNew"
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
              {kind: "XV.QuantityWidget", attr: "quantityReceived", label: "_received".loc()},
              {kind: "XV.QuantityWidget", attr: "balance"},
              {kind: "XV.QuantityWidget", attr: "undistributed", name: "undistributed",
                label: "_remainingToDistribute".loc()},
              {kind: "onyx.GroupboxHeader", content: "_post".loc()},
              {kind: "XV.QuantityWidget", attr: "qtyToPost", name: "qtyToPost",
                onValueChange: "qtyToPostChanged",
                label: "_toPost".loc()}
            ]}
          ]},
          {kind: "XV.PostProductionCreateLotSerialBox", attr: "detail", name: "detail"}
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
          model.getStatus() === XM.Model.READY_CLEAN) {
          this.$.qtyToPost.focus();
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
        if (undistributed === 0) {
          this.$.detail.$.newButton.setDisabled(true);
        } else {
          this.$.detail.newItem();
        }
      },

      handleDistributionLineNew: function () {
        var model = this.getValue(),
          undistributed = model.get("undistributed");
        this.$.detail.$.editor.$.quantity.setValue(undistributed);
      },

      qtyToPostChanged: function (inSender, inEvent) {
        var model = this.getValue(),
          qtyToPost = this.$.qtyToPost.getValue();
        model.set("qtyToPost", qtyToPost);
        model.undistributed();
        if (model.get("undistributed") > 0) {
          this.$.detail.newItem();
        }
      },

      postProduction: function (data) {
        var dispOptions = {};
        this.$.detail.destroy();
        this.doPrevious();
        XM.Manufacturing.postProduction(data, dispOptions);
      },

      save: function () {
        //this.inherited(arguments);
        var that = this,
          model = this.getValue(),
          callback,
          distributionModels = this.$.detail.getValue().models,
          distributionModel,
          options = {},
          details = [],
          data = [],
          i = -1,
          params,
          workOrder = model.id,
          quantity = model.get("qtyToPost"),
          transDate = model.transactionDate,
          backflush = model.get("isBackflushMaterials");
        options.asOf = transDate;
        options.backflush = false; //backflush;
        model.validate(function (isValid) {
          if (isValid) { callback(); }
        });

        // Cycle through the detailModels and build the detail object
        callback = function () {
          if (distributionModels.length > 0) {
            i ++;
            if (i === distributionModels.length) {
              if (distributionModels[0]) {
                that.postProduction(data);
              } else {
                return;
              }
            } else {
              distributionModel = distributionModels[i];
              // Should this be handled on the model and called here?
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
              callback();
            }
          } else {
            // If no detail, send to server.
            params = {
              workOrder: model.id,
              quantity: quantity,
              options: options
            };
            data.push(params);
            that.postProduction(data);
          }
          
        };
        callback();
      }
    });

  };
}());
