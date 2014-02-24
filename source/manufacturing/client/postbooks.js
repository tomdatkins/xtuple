/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  XT.extensions.manufacturing.initPostbooks = function () {
    var module,
      panels,
      relevantPrivileges,
			configurationJson,
			configuration;

    // ..........................................................
    // APPLICATION
    //

    panels = [
      {name: "workOrderEmailProfileList", kind: "XV.WorkOrderEmailProfileList"}
    ];
    XT.app.$.postbooks.appendPanels("setup", panels);

    configurationJson = {
      model: "XM.manufacturing",
      name: "_manufacturing".loc(),
      description: "_manufacturingDescription".loc(),
      workspace: "XV.ManufacturingWorkspace"
    };
    configuration = new XM.ConfigurationModel(configurationJson);
    XM.configurations.add(configuration);

    module = {
      name: "manufacturing",
      label: "_manufacturing".loc(),
      panels: [
        {name: "workOrderList", kind: "XV.WorkOrderList"},
        {name: "activityList", kind: "XV.ActivityList"},
        {name: "manufactureAvailabilityList", kind: "XV.InventoryAvailabilityList"}
      ],
      events: {
        onTransactionList: ""
      },
      actions: [
        {name: "issueMaterial", privilege: "IssueWoMaterials",
          method: "issueMaterial", notify: false},
        {name: "postProduction", privilege: "PostProduction",
          method: "postProduction", notify: false}
      ],
      issueMaterial: function (inSender, inEvent) {
        inEvent.kind = "XV.IssueMaterial";
        inSender.bubbleUp("onTransactionList", inEvent, inSender);
      },
      postProduction: function (inSender, inEvent) {
        inEvent.workspace = "XV.PostProductionWorkspace";
        inSender.bubbleUp("onWorkspace", inEvent, inSender);
      }
    };
    XT.app.$.postbooks.insertModule(module, 110);

    relevantPrivileges = [
      "AlterTransactionDates",
      "CloseWorkOrders",
      "ChangeWorkOrderQty",
      "DeleteWorkOrders",
      "ExplodeWorkOrders",
      "ImplodeWorkOrders",
      "IssueWoMaterials",
      "MaintainWorkOrderEmailProfiles",
      "MaintainWorkOrders",
      "PostProduction",
      "RecallWorkOrders",
      "ReleaseWorkOrders",
      "ReprioritizeWorkOrders",
      "RescheduleWorkOrders",
      "ReturnWoMaterials",
      "ViewCosts",
      "ViewWorkOrders",
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

  };
}());
