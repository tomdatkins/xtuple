/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  XT.extensions.quality.initPostbooks = function () {
    var module,
      panels,
      relevantPrivileges,
			configurationJson,
			configuration;

    // ..........................................................
    // APPLICATION
    //

    // Extend Setup & Configuration
    panels = [
      {name: "qualityPlanEmailProfileList", kind: "XV.QualityPlanEmailProfileList"}
    ];
    XT.app.$.postbooks.appendPanels("setup", panels);

    configurationJson = {
      model: "XM.quality",
      name: "_quality".loc(),
      description: "_qualityDescription".loc(),
      workspace: "XV.QualityWorkspace"
    };
    configuration = new XM.ConfigurationModel(configurationJson);
    XM.configurations.add(configuration);

    // Extend Manufacturing Panel
    if (XT.extensions.manufacturing) {
      panels = [
        {name: "qualityPlansList", kind: "XV.QualityPlansList"},
        {name: "qualityTestList", kind: "XV.QualityTestList"}
      ];
      XT.app.$.postbooks.appendPanels("manufacturing", panels);
    }

    module = {
      name: "products",
      label: "_products".loc(),
      panels: [
        {name: "itemList", kind: "XV.ItemList"},
        {name: "qualitySpecsList", kind: "XV.QualitySpecsList"}
      ],
      events: {
        onTransactionList: ""
      },
    };
    XT.app.$.postbooks.insertModule(module, 120);
    
    relevantPrivileges = [
      "MaintainQualitySpecs",
      "ViewQualitySpecs",
      "MaintainQualityPlans",
      "ViewQualityPlans",
      "MaintainQualityTests",
      "ViewQualityTests",
      "MaintainQualityPlanEmailProfiles"
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

  };
}());
