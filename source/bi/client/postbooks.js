/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, console:true */

XT.extensions.bi.initPostbooks = function () {

  var panelsSales = [
      {name: "salesBiDashboard", kind: "XV.SalesBiDashboard"},
    ],
      panelsCrm = [
      {name: "crmBiDashboard", kind: "XV.CrmBiDashboard"},
    ];
  
  XT.app.$.postbooks.appendPanels("sales", panelsSales, true);
  XT.app.$.postbooks.appendPanels("crm", panelsCrm, true);
  
};