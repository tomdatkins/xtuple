/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, console:true */

XT.extensions.bi.initPostbooks = function () {
  var panels, relevantPrivileges;

  panels = [
      {name: "salesBiDashboard", kind: "XV.SalesBiDashboard"},
    ];
  XT.app.$.postbooks.appendPanels("sales", panels, true);
};