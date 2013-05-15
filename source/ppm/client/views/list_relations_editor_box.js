/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  XT.extensions.ppm.initListRelationsEditorBox = function () {

    // ..........................................................
    // PROJECT TASK
    //

    var taskExtensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_billing".loc()},
      {kind: "XV.ItemWidget", container: "mainGroup", attr: "item",
        query: {parameters: [
        {attribute: "projectExpenseMethod", operator: "ANY",
          value: [XM.Item.EXPENSE_BY_CATEGORY, XM.Item.EXPENSE_BY_ACCOUNT] },
        {attribute: "isActive", value: true}
      ]}},
      {kind: "XV.CustomerWidget", container: "mainGroup", attr: "customer"},
      {kind: "XV.ToggleButtonWidget", container: "mainGroup",
        attr: "isSpecifiedRate"},
      {kind: "XV.MoneyWidget", container: "mainGroup", attr:
       {localValue: "billingRate", currency: "billingCurrency"},
       label: "_rate".loc() }
    ];

    XV.appendExtension("XV.ProjectTaskEditor", taskExtensions);

    // ..........................................................
    // WORKSHEET
    //

    enyo.kind({
      name: "XV.WorksheetTimeEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "lineNumber"},
          {kind: "XV.DateWidget", attr: "workDate"},
          {kind: "XV.TaskWidget", attr: "task"},
          {kind: "onyx.GroupboxHeader", content: "_billing".loc()},
          {kind: "XV.CustomerWidget", attr: "customer"},
          {kind: "XV.InputWidget", attr: "purchaseOrderNumber",
            label: "_custPo".loc()},
          {kind: "onyx.GroupboxHeader", content: "_detail".loc()},
          {kind: "XV.ItemWidget", attr: "item",
            query: {parameters: [
            {attribute: "projectExpenseMethod", operator: "ANY",
              value: [XM.Item.EXPENSE_BY_CATEGORY, XM.Item.EXPENSE_BY_ACCOUNT] },
            {attribute: "isActive", value: true}
          ]}},
          {kind: "XV.QuantityWidget", attr: "hours"},
          {kind: "XV.CheckboxWidget", attr: "billable"},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "billingRate", currency: "billingCurrency"},
            label: "_rate".loc() },
          {kind: "XV.MoneyWidget",
            attr: {localValue: "billingTotal", currency: "billingCurrency"},
            label: "_rate".loc(), currencyDisabled: true },
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.WorksheetTimeBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_time".loc(),
      editor: "XV.WorksheetTimeEditor",
      parentKey: "worksheet",
      listRelations: "XV.WorksheetTimeListRelations"
    });

    enyo.kind({
      name: "XV.WorksheetExpenseEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "lineNumber"},
          {kind: "XV.DateWidget", attr: "workDate"},
          {kind: "XV.TaskWidget", attr: "task"},
          {kind: "onyx.GroupboxHeader", content: "_billing".loc()},
          {kind: "XV.CustomerWidget", attr: "customer"},
          {kind: "XV.InputWidget", attr: "purchaseOrderNumber",
            label: "_custPo".loc()},
          {kind: "onyx.GroupboxHeader", content: "_detail".loc()},
          {kind: "XV.ItemWidget", attr: "item",
            query: {parameters: [
            {attribute: "projectExpenseMethod", operator: "ANY",
              value: [XM.Item.EXPENSE_BY_CATEGORY, XM.Item.EXPENSE_BY_ACCOUNT] },
            {attribute: "isActive", value: true}
          ]}},
          {kind: "XV.QuantityWidget", attr: "quantity"},
          {kind: "XV.CheckboxWidget", attr: "billable"},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "unitCost", currency: "billingCurrency"},
            label: "_rate".loc() },
          {kind: "XV.MoneyWidget",
            attr: {localValue: "billingTotal", currency: "billingCurrency"},
            label: "_rate".loc(), currencyDisabled: true },
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.WorksheetExpenseBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_expenses".loc(),
      editor: "XV.WorksheetExpenseEditor",
      parentKey: "worksheet",
      listRelations: "XV.WorksheetExpenseListRelations"
    });

  };

}());
