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
    name: "XV.Period12BookingsMapChart",
    kind: "XV.BiMapChart",
    collection: "XM.AnalyticCollection",
    // Chart properties
    chartTitle: "_trailing12".loc(),
    /*
     * Dates are updated in clickDrill function.  They are repeated in some parameters as some
     * queries need four dates (and it doesn't hurt to repeat)
     */
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
    chartOptions: [
      { name: "HERE.normalDay" },
      { name: "OpenStreetMap.Mapnik" },
      { name: "OpenMapSurfer.Roads" },
      { name: "MapQuestOpen.OSM" }
    ],
    // Query properties
    cube : "SOOrder",
    schema: new XM.SalesMetadata(),
    queryTemplates: [
      _.extend(new XT.mdxQueryMapPeriods(), {cube: "SOOrder"}),
    ],
  });
  
  enyo.kind({
    name: "XV.Period12ShipmentsMapChart",
    kind: "XV.BiMapChart",
    collection: "XM.AnalyticCollection",
    // Chart properties
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
    chartOptions: [
      { name: "HERE.normalDay" },
      { name: "OpenStreetMap.Mapnik" },
      { name: "OpenMapSurfer.Roads" },
      { name: "MapQuestOpen.OSM" }
    ],
    // Query properties
    cube : "SODelivery",
    schema: new XM.SalesMetadata(),
    queryTemplates: [
      _.extend(new XT.mdxQueryMapPeriods(), {
        members: [
          {name: "[Measures].[TheSum]",
             value: 'SUM({LASTPERIODS(12, [Delivery Date.Calendar].[$year].[$month])}, [Measures].[$measure])'
          },
          {name: "[Measures].[Longitude]",
             value: 'iif ([Measures].[TheSum] is empty, null, $dimensionGeo.CurrentMember.Properties("Longitude"))'
          },
          {name: "[Measures].[Latitude]",
             value: 'iif ([Measures].[TheSum] is empty, null, $dimensionGeo.CurrentMember.Properties("Latitude"))'
          },
        ],
        cube: "SODelivery"
      }),
    ],
  });
  
  enyo.kind({
    name: "XV.Period12BacklogMapChart",
    kind: "XV.BiMapChart",
    collection: "XM.AnalyticCollection",
    // Chart properties
    chartTitle: "_trailing12".loc(),
    chartOptions: [
      { name: "HERE.normalDay" },
      { name: "OpenStreetMap.Mapnik" },
      { name: "OpenMapSurfer.Roads" },
      { name: "MapQuestOpen.OSM" }
    ],
    // Query properties
    cube : "SOByPeriod",
    schema: new XM.SalesMetadata(),
    queryTemplates: [
      _.extend(new XT.mdxQueryMapPeriods(), {
        members: [
          {name: "[Measures].[TheSum]",
             value: 'SUM({LASTPERIODS(12, [Fiscal Period.Fiscal Period CL].[$year].[$month])}, [Measures].[$measure])'
          },
          {name: "[Measures].[Longitude]",
             value: 'iif ([Measures].[TheSum] is empty, null, $dimensionGeo.CurrentMember.Properties("Longitude"))'
          },
          {name: "[Measures].[Latitude]",
             value: 'iif ([Measures].[TheSum] is empty, null, $dimensionGeo.CurrentMember.Properties("Latitude"))'
          },
        ],
        cube: "SOByPeriod"
      }),
    ],
  });
}());
