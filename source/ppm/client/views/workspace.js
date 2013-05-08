/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.ppm.initWorkspaces = function () {

    // ..........................................................
    // CUSTOMER
    //

    var customerExtensions = [
      {kind: "onyx.GroupboxHeader", container: "settingsGroup",
        content: "_projectBilling".loc()},
      {kind: "XV.ToggleButtonWidget", container: "settingsGroup",
        attr: "isSpecifiedRate"},
      {kind: "XV.MoneyWidget", container: "settingsGroup", attr:
       {localValue: "billingRate", currency: "billingCurrency"},
       label: "_rate".loc(), currencyDisabled: true }
    ];

    XV.appendExtension("XV.CustomerWorkspace", customerExtensions);

    // ..........................................................
    // ITEM
    //

    var itemExtensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_project".loc()},
      {kind: "XV.ItemExpenseOptionsPicker", container: "mainGroup", label: "_expense".loc(),
        name: "itemExpenseOption", attr: "projectExpenseMethod"},
      {kind: "XV.ExpenseCategoryPicker", container: "mainGroup", attr: "projectExpenseCategory",
        name: "expenseCategoryPicker", label: "_category".loc()},
      {kind: "XV.LedgerAccountWidget", container: "mainGroup", attr: "projectExpenseLedgerAccount",
        name: "ledgerAccountWidget", label: "_account".loc(),
        query: {parameters: [{attribute: "accountType", operator: "ANY",
          value: [XM.LedgerAccount.ASSET, XM.LedgerAccount.LIABILITY, XM.LedgerAccount.EXPENSE]}]}
      }
    ];

    XV.appendExtension("XV.ItemWorkspace", itemExtensions);

    // ..........................................................
    // PROJECT
    //

    var projectExtensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_billing".loc()},
      {kind: "XV.CustomerWidget", container: "mainGroup", attr: "customer"},
      {kind: "XV.MoneyWidget", container: "mainGroup", attr:
       {localValue: "billingRate", currency: "billingCurrency"},
       label: "_rate".loc(), currencyDisabled: true, effective: ""}
    ];

    XV.appendExtension("XV.ProjectWorkspace", projectExtensions);

    // ..........................................................
    // TASK
    //

    var taskExtensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_billing".loc()},
      {kind: "XV.CustomerWidget", container: "mainGroup", attr: "customer"},
      {kind: "XV.MoneyWidget", container: "mainGroup", attr:
       {localValue: "billingRate", currency: "billingCurrency"},
       label: "_rate".loc(), currencyDisabled: true, effective: ""},
      {kind: "XV.ItemWidget", container: "mainGroup", attr: "item"}
    ];

    XV.appendExtension("XV.TaskWorkspace", taskExtensions);

    // ..........................................................
    // WORKSHEET
    //

    enyo.kind({
      name: "XV.WorksheetWorkspace",
      kind: "XV.Workspace",
      title: "_worksheet".loc(),
      model: "XM.Worksheet",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel",
            components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "weekOf"},
              {kind: "XV.EmployeeWidget", attr: "employee"},
              {kind: "XV.UserAccountWidget", attr: "owner"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.WorksheetTimeBox", attr: "time"},
          {kind: "XV.WorksheetExpenseBox", attr: "expenses"},
          {kind: "XV.WorksheetDocumentsBox", attr: "documents"}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.WorksheetListItem", "XV.WorksheetWorkspace");
  };

}());
