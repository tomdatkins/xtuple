/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.CrmBiDashboard",
    kind: "XV.BiDashboard",
    collection: "XM.UserBiChartCollection",
    // title is what show in the "add chart" picker on the
    // dashboard and the chart is the widget to be added
    // this tells the default query what extension to pull charts for
    extension: "crm",
    newActions: [
      {name: "bookingsTrailing", label: "_bookingsTrailing".loc(), item: "XV.Period12BookingsTimeSeriesChart"},
      {name: "opportunitiesTrailing", label: "_opportunitiesTrailing".loc(), item: "XV.Period12OpportunitiesTimeSeriesChart"},
      {name: "opportunitiesBookingsTrailing", label: "_opportunitiesBookingsTrailing".loc(), item: "XV.Period12OpportunitiesBookingsTimeSeriesChart"},
      {name: "opportunitiesOpenNext", label: "_opportunitiesOpenNext".loc(), item: "XV.Next12OpportunitiesOpenTimeSeriesChart"},
      {name: "quoteTrailing", label: "_quotesTrailing".loc(), item: "XV.Period12QuotesTimeSeriesChart"},
      {name: "opportunityForecastTrailing", label: "_opportunityForecastTrailing".loc(), item: "XV.Period12OpportunityForecastTimeSeriesChart"},
      {name: "opportunityFunnel", label: "_opportunitiesFunnel".loc(), item: "XV.FunnelOpportunitiesChart"},
      {name: "opportunityQuoteBookingFunnel", label: "_opportunityQuoteBookingFunnel".loc(), item: "XV.FunnelOpportunityQuoteBookingChart"},
      {name: "salesVelocity", label: "_salesVelocity".loc(), item: "XV.Period12SumSalesVelocityChart"}
      
    ]
  });

}());
