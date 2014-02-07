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
      {name: "bookingso", label: "_bookingsTrailing".loc(), item: "XV.Period12BookingsTimeSeriesChart"},
      {name: "opportunitytr", label: "_opportunitiesTrailing".loc(), item: "XV.Period12OpportunitiesTimeSeriesChart"},
      {name: "quotetr", label: "_quotesTrailing".loc(), item: "XV.Period12QuotesTimeSeriesChart"},
      {name: "opportunityForecasttr", label: "_opportunityForecastTrailing".loc(), item: "XV.Period12OpportunityForecastTimeSeriesChart"}      
    ]
  });

}());
