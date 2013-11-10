/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.Period12ShipmentsTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_shipmentsTrailing".loc(),
    measures: [
    ],
    measure: "",
    chartOptions: [
      { name: "barChart" },
      { name: "scatterChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "period12PlusPrevious",
    queryString: "",
    queryTemplate : "WITH MEMBER [Measures].[Delivery Gross] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
    " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Delivery Date.Calendar Months].[$year]))" +
    " MEMBER [Measures].[Delivery Gross Previous Year] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
    " select NON EMPTY {[Measures].[Delivery Gross], [Measures].[Delivery Gross Previous Year]} ON COLUMNS," +
    " LastPeriods(12, [Delivery Date.Calendar Months].[$year].[$month]) ON ROWS" +
    " from [$cube]",
    measureCaptions : ["Pick Measure Below", "Previous Year"],
    measureColors : ['#ff7f0e', '#2ca02c'],
    plotDimension1 : "[Delivery Date.Calendar Months].[Year].[MEMBER_CAPTION]",
    plotDimension2 : "[Delivery Date.Calendar Months].[Month].[MEMBER_CAPTION]",
    chart : function (type) {
        switch (type) {
        case "barChart":
          return nv.models.multiBarChart();
        case "scatterChart":
          return nv.models.scatterChart();
        case "lineChart":
          return nv.models.lineChart();
        case "areaChart":
          return nv.models.stackedAreaChart();
        }
      },
    cube : "Shipment"
  });
  
  enyo.kind({
    name: "XV.Period12BookingsTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_bookingsTrailing".loc(),
    measures: [
    ],
    measure: "",
    chartOptions: [
      { name: "barChart" },
      { name: "scatterChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "period12PlusPrevious",
    queryString: "",
    queryTemplate : "WITH MEMBER [Measures].[Order Gross] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
      " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Order Date.Calendar Months].[$year]))" +
      " MEMBER [Measures].[Order Gross Previous Year] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
      ' MEMBER [Measures].[End Date] AS ([Order Date.Calendar Months].CurrentMember.Properties("End Date"))' +
      " select NON EMPTY {[Measures].[Order Gross], [Measures].[Order Gross Previous Year]} ON COLUMNS," +
      " LastPeriods(12, [Order Date.Calendar Months].[$year].[$month]) ON ROWS" +
      " from [$cube]",
    measureCaptions : ["Pick Measure Below", "Previous Year"],
    measureColors : ['#ff7f0e', '#2ca02c'],
    plotDimension1 : "[Order Date.Calendar Months].[Year].[MEMBER_CAPTION]",
    plotDimension2 : "[Order Date.Calendar Months].[Month].[MEMBER_CAPTION]",
    chart : function (type) {
        switch (type) {
        case "barChart":
          return nv.models.multiBarChart();
        case "scatterChart":
          return nv.models.scatterChart();
        case "lineChart":
          return nv.models.lineChart();
        case "areaChart":
          return nv.models.stackedAreaChart();
        }
      },
    cube : "Booking"
  });

  enyo.kind({
    name: "XV.Period12BacklogTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_backlogTrailing".loc(),
    measures: [
    ],
    measure: "",
    chartOptions: [
      { name: "barChart" },
      { name: "scatterChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "period12PlusPrevious",
    queryString: "",
    queryTemplate : "WITH MEMBER [Measures].[Orders Unfulfilled] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
      " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Fiscal Period.Fiscal Period CL].[$year]))" +
      " MEMBER [Measures].[Orders Unfulfilled Previous Year] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
      " select NON EMPTY {[Measures].[Orders Unfulfilled], [Measures].[Orders Unfulfilled Previous Year]} ON COLUMNS," +
      " LastPeriods(12, [Fiscal Period.Fiscal Period CL].[$year].[$month]) ON ROWS" +
      " from [$cube]",
    measureCaptions : ["Pick Measure Below", "Previous Year"],
    measureColors : ['#ff7f0e', '#2ca02c'],
    plotDimension1 : "[Fiscal Period.Fiscal Period CL].[Fiscal Year].[MEMBER_CAPTION]",
    plotDimension2 : "[Fiscal Period.Fiscal Period CL].[Fiscal Period].[MEMBER_CAPTION]",
    chart : function (type) {
        switch (type) {
        case "barChart":
          return nv.models.multiBarChart();
        case "scatterChart":
          return nv.models.scatterChart();
        case "lineChart":
          return nv.models.lineChart();
        case "areaChart":
          return nv.models.stackedAreaChart();
        }
      },
    cube : "Backlog"
  });

}());
