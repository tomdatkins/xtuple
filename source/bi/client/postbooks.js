/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, console:true */

XT.extensions.bi.initPostbooks = function () {

  var panelsSalesDash = [
      {name: "salesBiDashboard", kind: "XV.SalesBiDashboard"},
    ],
      panelSalesAnalysis = [
      {name: "salesAnalysis", kind: "XV.AnalysisFrame"},
    ],
      panelCrmAnalysis = [
      {name: "crmAnalysis", kind: "XV.AnalysisFrame"},
    ],
    chartActions = [
      /*
       * Booking charts
       */
      {name: "bookingso", label: "_bookingsTrailing".loc(), item: "XV.Period12BookingsTimeSeriesChart", privileges: ["ViewSalesOrders"]},
      {name: "bookingtl", label: "_toplistTrailingBooking".loc(), item: "XV.Period12SalesToplistChart", privileges: ["ViewSalesOrders"]},
      /*
       * Shipment charts
       */
      {name: "shipments", label: "_shipmentsTrailing".loc(), item: "XV.Period12ShipmentsTimeSeriesChart", privileges: ["ViewShipping"]},
      {name: "shipmentstl", label: "_toplistTrailingShipments".loc(), item: "XV.Period12ShipmentsToplistChart", privileges: ["ViewShipping"]},
      {name: "backlog", label: "_backlogTrailing".loc(), item: "XV.Period12BacklogTimeSeriesChart", privileges: ["ViewShipping"]},
      {name: "backlogtl", label: "_toplistTrailingBacklog".loc(), item: "XV.Period12BacklogToplistChart", privileges: ["ViewShipping"]},
      /*
       * Sales Pipeline charts
       */
      {name: "opportunityQuoteBookingFunnel", label: "_opportunityQuoteBookingFunnel".loc(), item: "XV.FunnelOpportunityQuoteBookingChart", privileges: ["ViewAllOpportunities", "ViewQuotes", "ViewSalesOrders"]},
    ];

  XT.app.$.postbooks.appendPanels("sales", panelsSalesDash, true);
  XT.app.$.postbooks.appendPanels("sales", panelSalesAnalysis, false);
  XT.app.$.postbooks.appendPanels("crm", panelCrmAnalysis, false);
  
  // Add chart actions to global XT.chartActions that we set up in core.js
  XT.chartActions.push.apply(XT.chartActions, chartActions);

};