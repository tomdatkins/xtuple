/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, _:true*/

(function () {

  XT.extensions.quality.initPostbooks = function () {
    var module,
      panels,
      actions,
      functions,
      relevantPrivileges,
			configurationJson,
			configuration;

    // ..........................................................
    // APPLICATION
    //

    // Extend Setup & Configuration
    panels = [
      {name: "qualityPlanEmailProfileList", kind: "XV.QualityPlanEmailProfileList"},
      {name: "qualityReleaseCodeList", kind: "XV.QualityReleaseCodeList"},
      {name: "qualityReasonCodeList", kind: "XV.QualityReasonCodeList"},
      {name: "qualityPlanTypeList", kind: "XV.QualityPlanTypeList"}
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
      actions = [
        {name: "qualityTestSummary", privilege: "ViewQualityTests",
          method: "qualityTestSummary", notify: false}
      ];
      var func = function (inSender, inEvent) {
        var navigator = XT.app.$.postbooks.$.navigator,
          list = navigator.$.contentPanels.getActive(),
          isTestList = list.name === "qualityTestList";
        if (isTestList) {
          var reportUrl = "/generate-report?nameSpace=ORPT&type=QualityTestSummary";
          _.each(list.query.parameters, function (parameter) {
            var attr = parameter.attribute.replace(/\./g, ''),
              param = "&param=" + attr + "::string=" + parameter.value;
            return reportUrl += param;
          });
          navigator.openReport(XT.getOrganizationPath() + reportUrl);
        } else {
          inEvent.message = "_qualityTestListError".loc();
          inEvent.type = XM.Model.CRITICAL;
          list.doNotify(inEvent);
        }
      };
      functions = [
        {name: "qualityTestSummary", method: func}
      ];
      XT.app.$.postbooks.appendActions("manufacturing", actions, functions);
    }
    
    module = {
      name: "products",
      label: "_products".loc(),
      panels: [
        {name: "itemList", kind: "XV.ItemList"},
        {name: "qualitySpecsList", kind: "XV.QualitySpecsList"},
        {name: "qualitySpecsTypeList", kind: "XV.QualitySpecificationTypeList"}
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
      "ReleaseQualityTests",
      "CancelQualityTest",
      "MaintainQualityPlanEmailProfiles"
    ];
    XT.session.addRelevantPrivileges("quality", relevantPrivileges);

  };
}());
