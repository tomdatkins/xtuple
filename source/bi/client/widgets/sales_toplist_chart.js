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
      name: "XV.Period12SalesToplistChart",
      kind: "XV.BiToplistChart",
      collection: "XM.AnalyticCollection",
      chartTitle: "_toplistTrailing12".loc(),
      drillDown: [
        {dimension: "customer",
         attr: "number",
         recordType: "XM.CustomerRelation",
         collection: "XM.CustomerRelationCollection",
         workspace: "XM.CustomerRelation",
         parameters: [
          {name: "number", operator: "MATCHES", value: ""},
        ]
        },
        {dimension: "accountRep",
           attr: "number",
           recordType: "XM.SalesRepRelation",
           collection: "XM.SalesRepRelationCollection",
           workspace: "XM.SalesRep",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
          {dimension: "item",
           attr: "number",
           recordType: "XM.ItemRelation",
           collection: "XM.ItemCollection",
           workspace: "XM.ItemRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
          {dimension: "booking",
           attr: "number",
           recordType: "XM.SalesOrderRelation",
           collection: "XM.SalesOrderCollection",
           workspace: "XM.SalesOrderRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
            {name: "status", operator: "ANY", value: ["C", "O"]}
          ]
        },
        ],
        measures: [],
        query : "", 
        queryTemplates: [
          {members: [
            {name: "[Measures].[NAME]",
               value: '$dimensionHier.CurrentMember.Properties("$dimensionNameProp")'
            },
            {name: "[Measures].[THESUM]",
               value: "SUM({LASTPERIODS(12, [$dimensionTime].[$year].[$month])},  [Measures].[$measure])"
            },
          ],
          columns: [
            "[Measures].[THESUM]",
            "[Measures].[NAME]"
          ],
          rows: [
            "ORDER({filter(TopCount($dimensionHier.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) }, [Measures].[THESUM], DESC)"
          ],
          cube: "SOOrder",
          where: []
          },
        ],
        cube : "SOOrder",
        schema: new XM.SalesMetadata()
      });
    
    enyo.kind({
      name: "XV.Period12ShipmentsToplistChart",
      kind: "XV.BiToplistChart",
      collection: "XM.AnalyticCollection",
      chartTitle: "_toplistTrailing12".loc(),
      drillDown: [
        {dimension: "customer",
         attr: "number",
         recordType: "XM.CustomerRelation",
         collection: "XM.CustomerRelationCollection",
         workspace: "XM.CustomerRelation",
         parameters: [
          {name: "number", operator: "MATCHES", value: ""},
        ]
        },
        {dimension: "accountRep",
           attr: "number",
           recordType: "XM.SalesRepRelation",
           collection: "XM.SalesRepRelationCollection",
           workspace: "XM.SalesRep",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
          {dimension: "item",
           attr: "number",
           recordType: "XM.ItemRelation",
           collection: "XM.ItemCollection",
           workspace: "XM.ItemRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
          {dimension: "shipment",
           attr: "shipmentNumber",
           recordType: "XM.Shipment",
           collection: "XM.ShipmentCollection",
           workspace: "XM.Shipment",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
        ],
        measures: [],
        query : "", 
        queryTemplates: [
          {members: [
            {name: "[Measures].[NAME]",
               value: '$dimensionHier.CurrentMember.Properties("$dimensionNameProp")'
            },
            {name: "[Measures].[THESUM]",
               value: "SUM({LASTPERIODS(12, [$dimensionTime].[$year].[$month])},  [Measures].[$measure])"
            },
          ],
          columns: [
            "[Measures].[THESUM]",
            "[Measures].[NAME]"
          ],
          rows: [
            "ORDER({filter(TopCount($dimensionHier.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) }, [Measures].[THESUM], DESC)"
          ],
          cube: "SODelivery",
          where: []
          },
        ],
   
        cube : "SODelivery",
        schema: new XM.SalesMetadata()
      });
    
    enyo.kind({
      name: "XV.Period12BacklogToplistChart",
      kind: "XV.BiToplistChart",
      collection: "XM.AnalyticCollection",
      chartTitle: "_toplistTrailing12".loc(),
      drillDown: [
        {dimension: "customer",
         attr: "number",
         recordType: "XM.CustomerRelation",
         collection: "XM.CustomerRelationCollection",
         workspace: "XM.CustomerRelation",
         parameters: [
          {name: "number", operator: "MATCHES", value: ""},
        ]
        },
        {dimension: "accountRep",
           attr: "number",
           recordType: "XM.SalesRepRelation",
           collection: "XM.SalesRepRelationCollection",
           workspace: "XM.SalesRep",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
          {dimension: "item",
           attr: "number",
           recordType: "XM.ItemRelation",
           collection: "XM.ItemCollection",
           workspace: "XM.ItemRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
          {dimension: "booking",
           attr: "number",
           recordType: "XM.SalesOrderRelation",
           collection: "XM.SalesOrderCollection",
           workspace: "XM.SalesOrderRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
            {name: "status", operator: "ANY", value: ["C", "O"]}
          ]
        },
        ],
        measures: [],
        query : "",
        queryTemplates: [
          {members: [
            {name: "[Measures].[NAME]",
               value: '$dimensionHier.CurrentMember.Properties("$dimensionNameProp")'
            },
            {name: "[Measures].[THESUM]",
               value: "SUM({LASTPERIODS(12, [$dimensionTime].[$year].[$month])},  [Measures].[$measure])"
            },
          ],
          columns: [
            "[Measures].[THESUM]",
            "[Measures].[NAME]"
          ],
          rows: [
            "ORDER({filter(TopCount($dimensionHier.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) }, [Measures].[THESUM], DESC)"
          ],
          cube: "SOByPeriod",
          where: []
          },
        ],
          
        cube : "SOByPeriod",
        schema: new XM.SalesMetadata()
      });

  }());
