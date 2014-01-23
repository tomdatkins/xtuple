/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.manufacturing.initGridBox = function () {

    // ..........................................................
    // WORK ORDER MATERIAL
    //
    var K = XM.Item;

    enyo.kind({
      name: "XV.WorkOrderMaterialGridBox",
      kind: "XV.GridBox",
      style: "width: 500px;",
      title: "_materials".loc(),
      workspace: "XV.WorkOrderMaterialWorkspace",
      parentKey: "workOrder",
      orderBy: [{attribute: "item.number"}],
      columns: [
        {classes: "grid-item",
          header: ["_item".loc(), "_description".loc()],
          rows: [
          {readOnlyAttr: "item.number",
            editor: {kind: "XV.ItemSiteWidget", attr:
            {item: "item", site: "workOrder.site"},
            name: "itemSiteWidget",
            query: {parameters: [
            {attribute: "item.itemType", operator: "ANY",
              value: [K.MANUFACTURED, K.BREEDER, K.PURCHASED,
                K.OUTSIDE_PROCESS, K.TOOLING, K.PHANTOM, K.CO_PRODUCT,
                K.REFERENCE]},
            {attribute: "isActive", value: true}
          ]}}},
          {readOnlyAttr: "item.description1"}
        ]},
        {classes: "quantity",
          header: ["_quantityPer".loc(), "_fixed".loc(), "_required".loc()],
          rows: [
          {readOnlyAttr: "quantityPer",
            editor: {kind: "XV.QuantityWidget", attr: "quantityPer",
              name: "quantityWidget"}},
          {readOnlyAttr: "quantityFixed",
            editor: {kind: "XV.QuantityWidget", attr: "quantityFixed"}},
          {readOnlyAttr: "quantityRequired",
            editor: {kind: "XV.QuantityWidget", attr: "quantityRequired"}}
        ]},
        {classes: "grid-item",
          header: ["_unit".loc(), "_scrap".loc(), "_issueMethod".loc()],
          rows: [
          {readOnlyAttr: "unit.name",
            editor: {kind: "XV.UnitPicker",
              attr: {value: "unit", collection: "units"}}},
          {readOnlyAttr: "scrap",
            editor: {kind: "XV.PercentWidget", attr: "scrap"}},
          {readOnlyAttr: "getIssueMethodString",
            editor: {kind: "XV.IssueMethodPicker", attr: "issueMethod"}}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.WorkOrderOperationMaterialGridBox",
      kind: "XV.WorkOrderMaterialGridBox",
      parentKey: "operation"
    });

    // ..........................................................
    // WORK ORDER ROUTING
    //

    enyo.kind({
      name: "XV.WorkOrderOperationGridBox",
      kind: "XV.GridBox",
      style: "width: 500px;",
      title: "_routings".loc(),
      workspace: "XV.WorkOrderOperationWorkspace",
      parentKey: "workOrder",
      orderBy: [{attribute: "sequence"}],
      columns: [
        {classes: "line-number", header: "_seq#".loc(), rows: [
          {readOnlyAttr: "sequence",
            editor: {kind: "XV.NumberWidget", attr: "sequence"}}
        ]},
        {classes: "grid-item",
          header: ["_workCenter".loc(), "_standardOperation".loc(), "_description".loc()],
          rows: [
          {readOnlyAttr: "workCenter.code",
            editor: {kind: "XV.WorkCenterPicker", attr: "workCenter"}},
          {readOnlyAttr: "standardOperation.number",
            placeholder: "_noStandardOperation".loc(),
            editor: {kind: "XV.StandardOperationPicker", attr: "standardOperation"}},
          {readOnlyAttr: "description1",
            editor: {kind: "XV.InputWidget", attr: "description1"}},
        ]},
        {classes: "quantity",
          header: ["_setupTime".loc(), "_runTime".loc(), "_autoIssue".loc()],
            rows: [
          {readOnlyAttr: "setupTime",
            editor: {kind: "XV.NumberWidget", attr: "setupTime",
              scale: XT.MINUTES_SCALE}},
          {readOnlyAttr: "quantityFixed",
            editor: {kind: "XV.NumberWidget", attr: "runTime",
              scale: XT.MINUTES_SCALE}},
          {readOnlyAttr: "isAutoIssueComponents",
            editor: {kind: "XV.CheckboxWidget", attr: "isAutoIssueComponents"}}
        ]},
        {classes: "quantity",
          header: ["_unit".loc(), "_unitRatio".loc(), "_receive".loc()],
            rows: [
          {readOnlyAttr: "productionUnit",
            placeholder: "_noProductionUnit".loc(),
            editor: {kind: "XV.UnitCombobox", attr: "productionUnit",
              name: "quantityWidget"}},
          {readOnlyAttr: "productionUnitRatio",
            editor: {kind: "XV.UnitRatioWidget", attr: "productionUnitRatio"}},
          {readOnlyAttr: "isReceiveInventory",
            editor: {kind: "XV.CheckboxWidget", attr: "isReceiveInventory"}}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.WorkOrderWorkflowGridBox",
      kind: "XV.WorkflowGridBox",
      workspace: "XV.WorkOrderWorkflowWorkspace"
    });

  };

}());
