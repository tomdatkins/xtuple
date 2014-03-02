/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.inventory.initListRelationsEditorBox = function () {

    // ..........................................................
    // RECEIPT CREATE LOT/SERIAL/SELECT LOCATION
    //
    enyo.kind({
      name: "XV.ReceiptCreateLotSerialEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.QuantityWidget", attr: "quantity", name: "quantity"},
          {kind: "XV.TraceWidget", attr: "trace"},
          {kind: "XV.LocationPicker", attr: "location"},
          {kind: "XV.DateWidget", attr: "expireDate"},
          {kind: "XV.DateWidget", attr: "warrantyDate"}
          //{kind: "XV.CharacteristicTypePicker", attr: "characteristic"}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.ReceiptCreateLotSerialBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_lotSerial".loc(),
      editor: "XV.ReceiptCreateLotSerialEditor",
      parentKey: "itemSite",
      listRelations: "XV.ReceiptCreateLotSerialListRelations",
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
    // SALES ORDER LINE
    //

    XV.SalesOrderLineItemEditor.notify = XV.SalesOrderNotify;

    // ..........................................................
    // TRANSFER ORDER LINE
    //

    enyo.kind({
      name: "XV.TransferOrderLineEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "lineNumber"},
          {kind: "XV.ItemWidget", attr: "item"},
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
            label: "_freight".loc(), currencyShowing: false},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.TransferOrderLineBox",
      kind: "XV.ListRelationsEditorBox",
      classes: "xv-list-relations-box",
      title: "_lines".loc(),
      editor: "XV.TransferOrderLineEditor",
      parentKey: "transferOrder",
      listRelations: "XV.TransferOrderLineListRelations",
      fitButtons: false
    });

    enyo.kind({
      name: "XV.TransferOrderWorkflowEditor",
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
          {kind: "XV.TransferOrderStatusPicker", attr: "completedParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "completedSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
          {kind: "XV.TransferOrderStatusPicker", attr: "deferredParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.TransferOrderWorkflowBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_workflow".loc(),
      editor: "XV.TransferOrderWorkflowEditor",
      parentKey: "transferOrder",
      listRelations: "XV.TransferOrderWorkflowListRelations",
      fitButtons: false
    });

    // ..........................................................
    // SITE
    //

    enyo.kind({
      name: "XV.SiteTypeWorkflowEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"},
          {kind: "XV.WorkflowStatusPicker", attr: "status"},
          {kind: "XV.TransferOrderWorkflowTypePicker", attr: "workflowType",
            label: "_type".loc()},
          {kind: "XV.PriorityPicker", attr: "priority", showNone: false},
          {kind: "XV.NumberSpinnerWidget", attr: "sequence"},
          {kind: "onyx.GroupboxHeader", content: "_startDate".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "startSet"},
          {kind: "XV.NumberSpinnerWidget", attr: "startOffset"},
          {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "dueSet"},
          {kind: "XV.NumberSpinnerWidget", attr: "dueOffset"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "XV.UserAccountWidget", attr: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
          {kind: "XV.TransferOrderStatusPicker", attr: "completedParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc(),
            showNone: true},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "completedSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
          {kind: "XV.TransferOrderStatusPicker", attr: "deferredParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc(),
            showNone: true},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.SiteTypeWorkflowBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_workflow".loc(),
      editor: "XV.SiteTypeWorkflowEditor",
      parentKey: "siteType",
      listRelations: "XV.SiteTypeWorkflowListRelations",
      fitButtons: false
    });

  };

}());
