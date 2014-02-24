/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true, console:true */

/* 
 *  Implementation of charts.  Responsible for:
 *  -  defining collection class
 *  -  providing values for pickers
 *  -  query templates
 *  -  info for processing query results
 */

(function () {

  enyo.kind({
    name: "XV.Period12OpportunitiesTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_opportunitiesTrailing".loc(),
    measures: [
    ],
    measure: "",
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "period12PlusPrevious",
    queryTemplates: [
      "WITH MEMBER [Measures].[KPI] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
      " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Issue Date.Calendar Months].[$year]))" +
      " MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
      " select NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS," +
      " LastPeriods(12, [Issue Date.Calendar Months].[$year].[$month]) ON ROWS" +
      " from [$cube]"
    ],
    measureCaptions : ["Pick Measure Below", "Previous Year"],
    measureColors : ['#ff7f0e', '#2ca02c'],
    plotDimension1 : "[Issue Date.Calendar Months].[Year].[MEMBER_CAPTION]",
    plotDimension2 : "[Issue Date.Calendar Months].[Month].[MEMBER_CAPTION]",
    chart : function (type) {
        switch (type) {
        case "barChart":
          return dimple.plot.bar;
        case "bubbleChart":
          return dimple.plot.bubble;
        case "lineChart":
          return dimple.plot.line;
        case "areaChart":
          return dimple.plot.area;
        }
      },
    cube : "Opportunity"
  });
  
  enyo.kind({
    name: "XV.Period12QuotesTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_quotesTrailing".loc(),
    measures: [
    ],
    measure: "",
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "period12PlusPrevious",
    queryTemplates: [
      "WITH MEMBER [Measures].[KPI] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
      " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Issue Date.Calendar Months].[$year]))" +
      " MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
      " select NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS," +
      " LastPeriods(12, [Issue Date.Calendar Months].[$year].[$month]) ON ROWS" +
      " from [$cube]"
    ],
    measureCaptions : ["Pick Measure Below", "Previous Year"],
    measureColors : ['#ff7f0e', '#2ca02c'],
    plotDimension1 : "[Issue Date.Calendar Months].[Year].[MEMBER_CAPTION]",
    plotDimension2 : "[Issue Date.Calendar Months].[Month].[MEMBER_CAPTION]",
    chart : function (type) {
        switch (type) {
        case "barChart":
          return dimple.plot.bar;
        case "bubbleChart":
          return dimple.plot.bubble;
        case "lineChart":
          return dimple.plot.line;
        case "areaChart":
          return dimple.plot.area;
        }
      },
    cube : "Quote"
  });
  
  enyo.kind({
    name: "XV.Period12OpportunityForecastTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_opportunityForecastTrailing".loc(),
    measures: [
    ],
    measure: "",
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "period12PlusPrevious",
    queryTemplates: [
      "WITH MEMBER [Measures].[KPI] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
      " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Fiscal Period.Fiscal Period CL].[$year]))" +
      " MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
      " select NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS," +
      " LastPeriods(12, [Fiscal Period.Fiscal Period CL].[$year].[$month]) ON ROWS" +
      " from [$cube]"
    ],
    measureCaptions : ["Pick Measure Below", "Previous Year"],
    measureColors : ['#ff7f0e', '#2ca02c'],
    plotDimension1 : "[Fiscal Period.Fiscal Period CL].[Fiscal Year].[MEMBER_CAPTION]",
    plotDimension2 : "[Fiscal Period.Fiscal Period CL].[Fiscal Period].[MEMBER_CAPTION]",
    chart : function (type) {
        switch (type) {
        case "barChart":
          return dimple.plot.bar;
        case "bubbleChart":
          return dimple.plot.bubble;
        case "lineChart":
          return dimple.plot.line;
        case "areaChart":
          return dimple.plot.area;
        }
      },
    cube : "OpportunityForecast"
  });

}());
