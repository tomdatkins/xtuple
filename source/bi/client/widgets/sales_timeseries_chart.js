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
    name: "XV.Period12ShipmentsTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_trailing12".loc(),
    drillDown: [
      {attr: "shipmentNumber",
       recordType: "XM.Shipment",
       collection: "XM.ShipmentCollection",
       workspace: "XM.Shipment",
       parameters: [
        {name: "shippedFromDate", operator: ">=", value: new Date()},
        {name: "shippedToDate", operator: "<=", value: new Date()},
        {name: "isShipped", operator: "=", value: true},
        {name: "isInvoiced", operator: "=", value: true}
      ],
     }
    ],
    measures: [],
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "",
    queryTemplates: [
      {members: [
        {name: "[Measures].[KPI]",
           value: "IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])"
        },
        {name: "Measures.[prevKPI]",
           value: "([Measures].[$measure] , ParallelPeriod([Delivery Date.Calendar Months].[$year]))"
        },
        {name: "[Measures].[prevYearKPI]",
           value: "iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI])"
        },
      ],
      columns: [
        "[Measures].[KPI]",
        "[Measures].[prevYearKPI]"
      ],
      rows: [
        "LastPeriods(12, [Delivery Date.Calendar Months].[$year].[$month])"
      ],
      cube: "SODelivery",
      where: []
      },
    ],
    measureColors : ['#ff7f0e', '#2ca02c'],
    plotDimension1 : "[Delivery Date.Calendar Months].[Year].[MEMBER_CAPTION]",
    plotDimension2 : "[Delivery Date.Calendar Months].[Month].[MEMBER_CAPTION]",
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
    cube : "SODelivery",
    schema: new XM.SalesMetadata()
  });
  
  enyo.kind({
    name: "XV.Period12BookingsTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_trailing12".loc(),
    drillDown: [
      {attr: "number",
       recordType: "XM.SalesOrderRelation",
       collection: "XM.SalesOrderRelationCollection",
       workspace: "XM.SalesOrderRelation",
       parameters: [
        {name: "createdFromDate", operator: ">=", value: new Date()},
        {name: "createdToDate", operator: "<=", value: new Date()},
        {name: "status", operator: "ANY", value: ["C", "O"]}
      ],
     }
    ],
    measures: [
    ],
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "",
    queryTemplates: [
      {members: [
        {name: "[Measures].[KPI]",
           value: "IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])"
        },
        {name: "Measures.[prevKPI]",
           value: "([Measures].[$measure] , ParallelPeriod([Issue Date.Calendar Months].[$year]))"
        },
        {name: "[Measures].[prevYearKPI]",
           value: "iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI])"
        },
      ],
      columns: [
        "[Measures].[KPI]",
        "[Measures].[prevYearKPI]"
      ],
      rows: [
        "LastPeriods(12, [Issue Date.Calendar Months].[$year].[$month])"
      ],
      cube: "SOOrder",
      where: []
      }
    ],
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
    cube : "SOOrder",
    schema: new XM.SalesMetadata()
  });

  enyo.kind({
    name: "XV.Period12BacklogTimeSeriesChart",
    kind: "XV.BiTimeSeriesChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_trailing12".loc(),
    measures: [
    ],
    chartOptions: [
      { name: "barChart" },
      { name: "bubbleChart" },
      { name: "lineChart" },
      { name: "areaChart" }
    ],
    query : "",
    queryTemplates: [
      {members: [
        {name: "[Measures].[KPI]",
           value: "IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])"
        },
        {name: "Measures.[prevKPI]",
           value: "([Measures].[$measure] , ParallelPeriod([Fiscal Period.Fiscal Period CL].[$year]))"
        },
        {name: "[Measures].[prevYearKPI]",
           value: "iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI])"
        },
      ],
      columns: [
        "[Measures].[KPI]",
        "[Measures].[prevYearKPI]"
      ],
      rows: [
        "LastPeriods(12, [Fiscal Period.Fiscal Period CL].[$year].[$month])"
      ],
      cube: "SOByPeriod",
      where: []
      }
    ],
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
    cube : "SOByPeriod",
    schema: new XM.SalesMetadata()
  });

}());
