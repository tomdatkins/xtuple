/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, console:true */

XT.extensions.bi.initPostbooks = function () {

  var panelsSalesDash = [
      {name: "salesBiDashboard", kind: "XV.SalesBiDashboard"},
    ],
      panelsCrmDash = [
      {name: "crmBiDashboard", kind: "XV.CrmBiDashboard"},
    ],
      panelSalesAnalysis = [
      {name: "salesAnalysis", kind: "XV.AnalysisFrame"},
    ],
      panelCrmAnalysis = [
      {name: "crmAnalysis", kind: "XV.AnalysisFrame"},
    ],
    dashboardModule = {
      name: "welcomeDashboard",
      hasSubmenu: false,
      label: "_dashboard".loc(),
      panels: [
        {name: "welcomeDashboard", kind: "XV.WelcomeDashboard"}
      ]
    };

  XT.app.$.postbooks.appendPanels("sales", panelsSalesDash, true);
  XT.app.$.postbooks.appendPanels("crm", panelsCrmDash, true);
  XT.app.$.postbooks.appendPanels("sales", panelSalesAnalysis, false);
  XT.app.$.postbooks.appendPanels("crm", panelCrmAnalysis, false);
  XT.app.$.postbooks.insertModule(dashboardModule, 0);
  
};