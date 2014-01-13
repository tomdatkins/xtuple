/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.inventory.initGridBox = function () {

    // ..........................................................
    // TRANSFER ORDER
    //

    enyo.kind({
      name: "XV.TransferOrderLineGridBox",
      kind: "XV.GridBox",
      classes: "small-panel",
      title: "_lineItems".loc(),
      workspace: "XV.TransferOrderLineWorkspace",
      orderBy: [{attribute: 'lineNumber'}],
      columns: [
        {classes: "line-number", header: "#", rows: [
          {readOnlyAttr: "lineNumber",
            editor: {kind: "XV.NumberWidget", attr: "lineNumber"}}
        ]},
        {classes: "grid-item", header: "_item".loc(), rows: [
          {readOnlyAttr: "item.number",
            editor: {kind: "XV.TransferOrderItemWidget",
              attr: {item: "item", transferOrder: "transferOrder"}}},
          {readOnlyAttr: "item.description1"}
        ]},
        {classes: "quantity", header: "_quantity".loc(), rows: [
          {readOnlyAttr: "quantity",
            editor: {kind: "XV.QuantityWidget", attr: "quantity",
              name: "quantityWidget"}},
          {readOnlyAttr: "unit",
            editor: {kind: "XV.InputWidget", attr: "unit"}}
        ]},
        {classes: "date", header: ["_scheduled".loc(), "_promised".loc()], rows: [
          {readOnlyAttr: "scheduleDate",
            editor: {kind: "XV.DateWidget", attr: "scheduleDate"}},
          {readOnlyAttr: "promiseDate",
            editor: {kind: "XV.DateWidget", attr: "promiseDate"}}
        ]},
        {classes: "quantity", header: ["_shipped".loc(), "_received".loc()], rows: [
          {readOnlyAttr: "shipped",
            editor: {kind: "XV.QuantityWidget", attr: "shipped",
              name: "shippedWidget"}},
          {readOnlyAttr: "received",
            editor: {kind: "XV.QuantityWidget", attr: "received",
              name: "receivedWidget"}},
        ]},
      ]
    });

    enyo.kind({
      name: "XV.TransferOrderWorkflowGridBox",
      kind: "XV.WorkflowGridBox",
      workspace: "XV.TransferOrderWorkflowWorkspace"
    });

  };

}());
