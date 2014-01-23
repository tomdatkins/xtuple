
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

    var K = XM.Item;
    
    enyo.kind({
      name: "XV.WorkOrderMaterialEditor",
      kind: "XV.RelationsEditor",
      components: [
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
            label: "_issued".loc()},
          {kind: "onyx.GroupboxHeader", content: "_production".loc()},
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

    enyo.kind({
      name: "XV.WorkOrderOperationMaterialBox",
      kind: "XV.WorkOrderMaterialBox",
      parentKey: "operation"
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
          {kind: "onyx.GroupboxHeader", content: "_description".loc()},
          {kind: "XV.InputWidget", attr: "description1"},
          {kind: "XV.InputWidget", attr: "description2"},
          {kind: "XV.InputWidget", attr: "toolingReference"},
          {kind: "onyx.GroupboxHeader", content: "_instructions".loc()},
          {kind: "XV.TextArea", attr: "instructions", fit: true,
            name: "instructions"},
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
          {kind: "XV.CheckboxWidget", attr: "isAutoIssueComponents"},
          {kind: "XV.CheckboxWidget", attr: "isReceiveInventory"},
          {kind: "XV.LocationPicker", attr: "wipLocation"},
          {kind: "onyx.GroupboxHeader", content: "_setup".loc()},
          {kind: "XV.NumberWidget", attr: "setupTime", scale: XT.MINUTES_SCALE,
            label: "_time".loc()},
          {kind: "onyx.GroupboxHeader", content: "_run".loc()},
          {kind: "XV.NumberWidget", attr: "runTime", scale: XT.MINUTES_SCALE,
            label: "_time".loc()}
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

    // ..........................................................
    // WORK ORDER WORKFLOW
    //

    enyo.kind({
      name: "XV.WorkOrderWorkflowEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"},
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
          {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
          {kind: "XV.WorkOrderStatusPicker", attr: "completedParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "completedSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
          {kind: "XV.WorkOrderStatusPicker", attr: "deferredParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.WorkOrderWorkflowBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_workflow".loc(),
      editor: "XV.WorkOrderWorkflowEditor",
      parentKey: "workOrder",
      listRelations: "XV.WorkflowListRelations",
      fitButtons: false
    });

  };

}());
