/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  XT.extensions.manufacturing.initListRelationsEditorBox = function () {

    // ..........................................................
    // POST PRODUCTION CREATE LOT/SERIAL/SELECT LOCATION
    //

    enyo.kind({
      name: "XV.PostProductionCreateLotSerialEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.QuantityWidget", attr: "quantity", name: "quantity"},
          {kind: "XV.InputWidget", attr: "trace"},
          {kind: "XV.LocationPicker", attr: "location"},
          {kind: "XV.DateWidget", attr: "expireDate"},
          {kind: "XV.DateWidget", attr: "warrantyDate"}
          //{kind: "XV.CharacteristicTypePicker", attr: "characteristic"}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.PostProductionCreateLotSerialBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_lotSerial".loc(),
      editor: "XV.PostProductionCreateLotSerialEditor",
      parentKey: "itemSite",
      listRelations: "XV.PostProductionCreateLotSerialListRelations",
      events: {
        onDistributionLineDone: ""
      },
      doneItem: function () {
        this.inherited(arguments);
        if (this.getValue() ? this.getValue().length > 0 : false) {
          this.doDistributionLineDone();
        }
      }
    });

    // ..........................................................
    // WORK ORDER MATERIALS
    //

    enyo.kind({
      name: "XV.WorkOrderMaterialEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.ItemWidget", attr: "item"},
          {kind: "XV.UnitPicker", attr: "unit"},
          {kind: "XV.IssueMethodPicker", attr: "issueMethod"},
          {kind: "XV.DateWidget", attr: "dueDate"},
          {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
          {kind: "XV.QuantityWidget", attr: "quantityPer",
            label: "_per".loc()},
          {kind: "XV.QuantityWidget", attr: "quantityFixed",
            label: "_fixed".loc()},
          {kind: "XV.QuantityWidget", attr: "quantityRequired",
            label: "_required".loc()},
          {kind: "XV.QuantityWidget", attr: "quantityIssued",
            label: "_issued".loc()},
          {kind: "onyx.GroupboxHeader", content: "_production".loc()},
          {kind: "XV.MoneyWidget", attr: {localValue: "cost"},
            label: "_cost".loc(),
            showCurrency: false,
            scale: XT.COST_SCALE},
          {kind: "XV.InputWidget", attr: "reference", fit: true},
          {kind: "XV.ToggleButtonWidget", attr: "isPicklist"},
          {kind: "onyx.GroupboxHeader", content: "_routing".loc()},
          {kind: "XV.InputWidget", attr: "operation"},
          {kind: "XV.ToggleButtonWidget", attr: "scheduleAtOperation"},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.WorkOrderMaterialBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_materials".loc(),
      editor: "XV.WorkOrderMaterialEditor",
      parentKey: "materials",
      listRelations: "XV.WorkOrderMaterialListRelations"
    });

    // ..........................................................
    // WORK ORDER ROUTINGS
    //

    enyo.kind({
      name: "XV.WorkOrderOperationEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "sequence"},
          {kind: "XV.WorkCenterPicker", attr: "workCenter"},
          {kind: "XV.StandardOperationPicker", attr: "standardOperation"},
          {kind: "XV.InputWidget", attr: "description1"},
          {kind: "XV.InputWidget", attr: "description2"},
          {kind: "XV.InputWidget", attr: "toolingReference"},
          {kind: "onyx.GroupboxHeader", content: "_setup".loc()},
          {kind: "XV.NumberWidget", attr: "setupTime", scale: XT.MINUTES_SCALE,
            label: "_time".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "isSetupReport",
            label: "_report".loc()},
          {kind: "XV.NumberWidget", attr: "setupConsumed",
            label: "_consumed".loc(),
            scale: XT.MINUTES_SCALE},
          {kind: "onyx.GroupboxHeader", content: "_run".loc()},
          {kind: "XV.NumberWidget", attr: "runTime", scale: XT.MINUTES_SCALE,
            label: "_time".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "isRunReport",
            label: "_report".loc()},
          {kind: "XV.NumberWidget", attr: "runConsumed",
            label: "_consumed".loc(),
            scale: XT.MINUTES_SCALE},
          {kind: "onyx.GroupboxHeader", content: "_production".loc()},
          {kind: "XV.UnitCombobox", attr: "productionUnit",
            label: "_unitRatio".loc(), showLabel: true},
          {kind: "XV.UnitRatioWidget", attr: "productionUnitRatio",
            label: "_unitRatio".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "isReceiveInventory"},
          {kind: "XV.LocationPicker", attr: "wipLocation"},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "instructions", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.WorkOrderOperationBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_routings".loc(),
      editor: "XV.WorkOrderOperationEditor",
      parentKey: "routings",
      listRelations: "XV.WorkOrderOperationListRelations"
    });

  };

}());
