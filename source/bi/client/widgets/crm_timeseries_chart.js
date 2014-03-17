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
    drillDownAttr: "opportunityNumber",
    drillDownRecordType: "XM.OpportunityRelation",
    drillDownCollection: "XM.OpportunityRelationCollection",
    drillDownParameters: [{
      name: "fromStartDate",
      operator: ">=",
      value: new Date()
    },
      {
      name: "toStartDate",
      operator: "<=",
      value: new Date()
    },
      {
      name: "showInactive",
      operator: "=",
      value: true
    }
    ],
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[KPI] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
          " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Issue Date.Calendar Months].[$year]))" +
          " MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
          " select NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS," +
          " LastPeriods(12, [Issue Date.Calendar Months].[$year].[$month]) ON ROWS" +
          " from [$cube]",
        cube : "Opportunity"
      }
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
    name: "XV.Period12OpportunitiesBookingsTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_opportunitiesBookingsTrailing".loc(),
    measures: [
    ],
    measure: "",
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[KPI] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
          " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Issue Date.Calendar Months].[$year]))" +
          " MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
          " select NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS," +
          " LastPeriods(12, [Issue Date.Calendar Months].[$year].[$month]) ON ROWS" +
          " from [$cube]",
        cube : "OpportunityBooking"
      }
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
    cube : "OpportunityBooking"
  });
  
  enyo.kind({
    name: "XV.Next12OpportunitiesActiveTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_opportunitiesActiveNext".loc(),
    nextPeriods: 6,
    measures: [
    ],
    measure: "",
    drillDownAttr: "opportunityNumber",
    drillDownRecordType: "XM.OpportunityRelation",
    drillDownCollection: "XM.OpportunityRelationCollection",
    drillDownParameters: [{
      name: "fromStartDate",
      operator: ">=",
      value: new Date()
    },
      {
      name: "toStartDate",
      operator: "<=",
      value: new Date()
    },
      {
      name: "showInactive",
      operator: "=",
      value: false
    }
    ],
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[KPI] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
          " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Issue Date.Calendar Months].[$year]))" +
          " MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
          " select NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS," +
          " LastPeriods(12, [Issue Date.Calendar Months].[$year].[$month]) ON ROWS" +
          " from [$cube]" +
          " WHERE {[Opportunity.Opportunity by Status by Stage].[Active]}",
        cube : "Opportunity"
      }
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
    drillDownAttr: "quoteNumber",
    drillDownRecordType: "XM.QuoteRelation",
    drillDownCollection: "XM.QuoteRelationCollection",
    drillDownParameters: [{
      name: "createdFromDate",
      operator: ">=",
      value: new Date()
    },
      {
      name: "createdToDate",
      operator: "<=",
      value: new Date()
    },
      {
      name: "showClosed",
      operator: "ANY",
      value: ["C", "O"]
    },
      {
      name: "showExpired",
      operator: "!=",
      value: new Date(0, 1, 1)
    }
    ],
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[KPI] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
          " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Issue Date.Calendar Months].[$year]))" +
          " MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
          " select NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS," +
          " LastPeriods(12, [Issue Date.Calendar Months].[$year].[$month]) ON ROWS" +
          " from [$cube]",
        cube : "Quote"
      }
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
    name: "XV.Period12QuotesActiveTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_quotesActiveTrailing".loc(),
    measures: [
    ],
    measure: "",
    drillDownAttr: "quoteNumber",
    drillDownRecordType: "XM.QuoteRelation",
    drillDownCollection: "XM.QuoteRelationCollection",
    drillDownParameters: [{
      name: "createdFromDate",
      operator: ">=",
      value: new Date()
    },
      {
      name: "createdToDate",
      operator: "<=",
      value: new Date()
    }
    ],
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[NEKPI] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
          " MEMBER [Measures].[KPI] as 'IIf((([Measures].[Days Expire Date] >= [Measures].[Days Quote Date]) OR ([Measures].[Days Expire Date] = -1)), [Measures].[NEKPI], 0.00)'" +
          " MEMBER Measures.[prevKPI] AS ([Measures].[KPI] , ParallelPeriod([Issue Date.Calendar Months].[$year]))" +
          " MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
          " select NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS," +
          " LastPeriods(12, [Issue Date.Calendar Months].[$year].[$month]) ON ROWS" +
          " from [$cube]",
        cube : "Quote"
      }
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
    nextPeriods: 0,
    measures: [
    ],
    measure: "",
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[KPI] as 'IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])'" +
          " MEMBER Measures.[prevKPI] AS ([Measures].[$measure] , ParallelPeriod([Fiscal Period.Fiscal Period CL].[$year]))" +
          " MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI] )" +
          " select NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS," +
          " LastPeriods(12, [Fiscal Period.Fiscal Period CL].[$year].[$month]) ON ROWS" +
          " from [$cube]",
        cube: "OpportunityForecast"
      }
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
  
  enyo.kind({
    name: "XV.Period12SumSalesVelocityChart",
    kind: "XV.BiCompareTimeSumChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_salesVelocity".loc(),
    nextPeriods: 0,
    measures: [ "Start to Assigned", "Start to Target", "Start to Actual"],
    measure: "",
    query : "",
    queryTemplates: [
      {
        query: "WITH " +
          " MEMBER [Measures].[m-1] as " +
          "  SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[Days, Start to Assigned]) " +
          " MEMBER [Measures].[measure-1] AS iif(Measures.[m-1] = 0 or Measures.[m-1] = NULL or IsEmpty(Measures.[m-1]), 0.000, Measures.[m-1] ) " +
          " MEMBER [Measures].[m-p-1] as " +
          "  SUM({LASTPERIODS(12, ParallelPeriod([Issue Date.Calendar].[YEAR], 1, [Issue Date.Calendar].[$year].[$month]))}, " +
          "  [Measures].[Days, Start to Assigned]) " +
          " MEMBER [Measures].[measure-prev-1] AS iif(Measures.[m-p-1] = 0 or Measures.[m-p-1] = NULL or IsEmpty(Measures.[m-p-1]), 0.000, Measures.[m-p-1] ) " +

          " MEMBER [Measures].[m-2] as " +
          "  SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[Days, Start to Target]) " +
          " MEMBER [Measures].[measure-2] AS iif(Measures.[m-2] = 0 or Measures.[m-2] = NULL or IsEmpty(Measures.[m-2]), 0.000, Measures.[m-2] ) " +
          " MEMBER [Measures].[m-p-2] as " +
          "  SUM({LASTPERIODS(12, ParallelPeriod([Issue Date.Calendar].[YEAR], 1, [Issue Date.Calendar].[$year].[$month]))}, " +
          "  [Measures].[Days, Start to Target]) " +
          " MEMBER [Measures].[measure-prev-2] AS iif(Measures.[m-p-2] = 0 or Measures.[m-p-2] = NULL or IsEmpty(Measures.[m-p-2]), 0.000, Measures.[m-p-2] ) " +

          " MEMBER [Measures].[m-3] as " +
          "  SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[Days, Start to Actual]) " +
          " MEMBER [Measures].[measure-3] AS iif(Measures.[m-3] = 0 or Measures.[m-3] = NULL or IsEmpty(Measures.[m-3]), 0.000, Measures.[m-3] ) " +
          " MEMBER [Measures].[m-p-3] as " +
          "  SUM({LASTPERIODS(12, ParallelPeriod([Issue Date.Calendar].[YEAR], 1, [Issue Date.Calendar].[$year].[$month]))}, " +
          "  [Measures].[Days, Start to Actual]) " +
          " MEMBER [Measures].[measure-prev-3] AS iif(Measures.[m-p-3] = 0 or Measures.[m-p-3] = NULL or IsEmpty(Measures.[m-p-3]), 0.000, Measures.[m-p-3] ) " +

          " SELECT NON EMPTY { " +
          "[Measures].[measure-1], [Measures].[measure-prev-1], " +
          "[Measures].[measure-2], [Measures].[measure-prev-2], " +
          "[Measures].[measure-3], [Measures].[measure-prev-3] " +
          "} ON COLUMNS, " +
          
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Opportunity"
      },
    ],
    measureCaptions : ["Pick Measure Below", "Previous Year"],
    measureColors : ['#ff7f0e', '#2ca02c'],
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

}());
