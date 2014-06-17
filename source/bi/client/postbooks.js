/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, console:true */

XT.extensions.bi.initPostbooks = function () {

  var salesDash = [
      {name: "salesBiDashboard", kind: "XV.SalesBiDashboard"}
    ],
      salesMaps = [
      {name: "salesBiMapboard", kind: "XV.SalesBiMapboard"}
    ],
      crmDash = [
      {name: "crmBiDashboard", kind: "XV.CrmBiDashboard"}
    ],
    dashboardModule = {
      name: "welcomeDashboard",
      hasSubmenu: false,
      label: "_dashboard".loc(),
      panels: [
        {name: "welcomeDashboard", kind: "XV.WelcomeDashboard"}
      ]
    };

  XT.app.$.postbooks.appendPanels("sales", salesDash, true);
  XT.app.$.postbooks.appendPanels("sales", salesMaps);
  XT.app.$.postbooks.appendPanels("crm", crmDash, true);
  XT.app.$.postbooks.insertModule(dashboardModule, 0);
  
};