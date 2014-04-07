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

enyo.kind({
    name: "XV.Period12SalesToplistChart",
    kind: "XV.BiToplistChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_toplistTrailing".loc(),
    drillDown: [
      {attr: "number",
       recordType: "XM.SalesOrderRelation",
       collection: "XM.SalesOrderRelationCollection",
       parameters: [
        {name: "createdFromDate", operator: ">=", value: new Date()},
        {name: "createdToDate", operator: "<=", value: new Date()},
        {name: "status", operator: "ANY", value: ["C", "O"]}
      ],
     }
    ],
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
        query: "WITH MEMBER [Measures].[NAME] AS [$codeDim].CurrentMember.Properties($timeDim)" +
          ' MEMBER [Measures].[THESUM]  as SUM({LASTPERIODS(12, [$timeDimension].[$year].[$month])},  [Measures].[Amount, Order Gross])' +
          " select NON EMPTY {[Measures].[THESUM], [Measures].[NAME]} ON COLUMNS," +
          " NON EMPTY{filter(TopCount([$codeDim].Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) } ON ROWS" +
          " from [$cube]",
        cube:  "Booking"
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
    cube : "Booking"
  });
