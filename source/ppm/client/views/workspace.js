/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.ppm.initWorkspaces = function () {

    // ..........................................................
    // ITEM
    //

    // Add handling for checkbox option
    var proto = XV.ItemWorkspace.prototype,
      attrsChanged = proto.attributesChanged,
      cvChanged = proto.controlValueChanged;
    proto.attributesChanged = function () {
      attrsChanged.apply(this, arguments);
      var model = this.getValue(),
        option = this.$.itemExpenseOption,
        value = option.getValue();
        
      if (!value) {
        if (model.get("expenseCategory")) {
          option.setValue(XM.itemExpenseOptions.get('E'));
        } else if (model.get("ledgerAccount")) {
          option.setValue(XM.itemExpenseOptions.get('L'));
        }
      }
    };
    proto.controlValueChanged = function (inSender, inEvent) {
      var value = inEvent.value,
        name = inEvent.originator.name,
        model = this.getValue(),
        expenseCategory = "expenseCategory", // so it will be minified
        ledgerAccount = "ledgerAccount";
      if (name === 'itemExpenseOption') {
        switch (value)
        {
        case 'E':
          model.unset(ledgerAccount);
          model.setReadOnly(expenseCategory, false);
          model.setReadOnly(ledgerAccount);
          break;
        case 'L':
          model.unset(expenseCategory);
          model.setReadOnly(ledgerAccount, false);
          model.setReadOnly(expenseCategory);
          break;
        default:
          model.unset(expenseCategory);
          model.unset(ledgerAccount);
          model.setReadOnly(ledgerAccount);
          model.setReadOnly(expenseCategory);
        }
        return true;
      }
      
      // Apply original function
      cvChanged.apply(this, arguments);
    };
    
    var itemExtensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_project".loc()},
      {kind: "XV.ItemExpenseOptionsPicker", container: "mainGroup", label: "_expense".loc(),
        name: "itemExpenseOption"},
      {kind: "XV.ExpenseCategoryPicker", container: "mainGroup", attr: "expenseCategory",
        name: "expenseCategoryPicker", label: "_category".loc(), disabled: true},
      {kind: "XV.LedgerAccountWidget", container: "mainGroup", attr: "ledgerAccount",
        name: "ledgerAccountWidget", label: "_account".loc(), disabled: true,
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
    // PROJECT TASK
    //

    var taskExtensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_billing".loc()},
      {kind: "XV.CustomerWidget", container: "mainGroup", attr: "customer"},
      {kind: "XV.MoneyWidget", container: "mainGroup", attr:
       {localValue: "billingRate", currency: "billingCurrency"},
       label: "_rate".loc(), currencyDisabled: true, effective: ""},
      {kind: "XV.ItemWidget", container: "mainGroup", attr: "item"}
    ];

    XV.appendExtension("XV.ProjectTaskWorkspace", taskExtensions);

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
