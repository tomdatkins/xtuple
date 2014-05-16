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
      chartTitle: "_toplistTrailingBooking".loc(),
      drillDown: [
        {dimension: "customer",
         attr: "number",
         recordType: "XM.CustomerRelation",
         collection: "XM.CustomerRelationCollection",
         parameters: [
          {name: "number", operator: "MATCHES", value: ""},
        ]
        },
        {dimension: "accountRep",
           attr: "number",
           recordType: "XM.SalesRepRelation",
           collection: "XM.SalesRepRelationCollection",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
          {dimension: "product",
           attr: "number",
           recordType: "XM.ItemRelation",
           collection: "XM.ItemCollection",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
        ],
        measures: [],
        measure: "",
        dimension: "",
        query : "",
        queryTemplates: [
          {
              query: 'WITH MEMBER [Measures].[NAME] AS $dimensionHier.CurrentMember.Properties("$dimensionNameProp")' +
              ' MEMBER [Measures].[THESUM]  as SUM({LASTPERIODS(12, [$dimensionTime].[$year].[$month])},  [Measures].[$measure])' +
              ' select NON EMPTY {[Measures].[THESUM], [Measures].[NAME]} ON COLUMNS,' +
              ' NON EMPTY ORDER({filter(TopCount($dimensionHier.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) },' +
              '                 [Measures].[THESUM],' +
              '                 DESC) ON ROWS' +
              ' from [$cube]',
              cube:  'SOOrder'
            }
          ],
          cube : "SOOrder",
          schema: new XM.SalesMetadata()
        });
    
    enyo.kind({
      name: "XV.Period12ShipmentsToplistChart",
      kind: "XV.BiToplistChart",
      collection: "XM.AnalyticCollection",
      chartTitle: "_toplistTrailingShipments".loc(),
      drillDown: [
        {dimension: "customer",
         attr: "number",
         recordType: "XM.CustomerRelation",
         collection: "XM.CustomerRelationCollection",
         parameters: [
          {name: "number", operator: "MATCHES", value: ""},
        ]
        },
        {dimension: "accountRep",
           attr: "number",
           recordType: "XM.SalesRepRelation",
           collection: "XM.SalesRepRelationCollection",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
          {dimension: "product",
           attr: "number",
           recordType: "XM.ItemRelation",
           collection: "XM.ItemCollection",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
        ],
        measures: [],
        measure: "",
        dimension: "",
        query : "",
        queryTemplates: [
          {
              query: 'WITH MEMBER [Measures].[NAME] AS $dimensionHier.CurrentMember.Properties("$dimensionNameProp")' +
              ' MEMBER [Measures].[THESUM]  as SUM({LASTPERIODS(12, [$dimensionTime].[$year].[$month])},  [Measures].[$measure])' +
              ' select NON EMPTY {[Measures].[THESUM], [Measures].[NAME]} ON COLUMNS,' +
              ' NON EMPTY ORDER({filter(TopCount($dimensionHier.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) },' +
              '                 [Measures].[THESUM],' +
              '                 DESC) ON ROWS' +
              ' from [$cube]',
              cube:  'SODelivery'
            }
          ],
          cube : "SODelivery",
          schema: new XM.SalesMetadata()
        });
    
    enyo.kind({
      name: "XV.Period12BacklogToplistChart",
      kind: "XV.BiToplistChart",
      collection: "XM.AnalyticCollection",
      chartTitle: "_toplistTrailingBacklog".loc(),
      drillDown: [
        {dimension: "customer",
         attr: "number",
         recordType: "XM.CustomerRelation",
         collection: "XM.CustomerRelationCollection",
         parameters: [
          {name: "number", operator: "MATCHES", value: ""},
        ]
        },
        {dimension: "accountRep",
           attr: "number",
           recordType: "XM.SalesRepRelation",
           collection: "XM.SalesRepRelationCollection",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
          {dimension: "product",
           attr: "number",
           recordType: "XM.ItemRelation",
           collection: "XM.ItemCollection",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
        ],
        measures: [],
        measure: "",
        dimension: "",
        query : "",
        queryTemplates: [
          {
              query: 'WITH MEMBER [Measures].[NAME] AS $dimensionHier.CurrentMember.Properties("$dimensionNameProp")' +
              ' MEMBER [Measures].[THESUM]  as SUM({LASTPERIODS(12, [$dimensionTime].[$year].[$month])},  [Measures].[$measure])' +
              ' select NON EMPTY {[Measures].[THESUM], [Measures].[NAME]} ON COLUMNS,' +
              ' NON EMPTY ORDER({filter(TopCount($dimensionHier.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) },' +
              '                 [Measures].[THESUM],' +
              '                 DESC) ON ROWS' +
              ' from [$cube]',
              cube:  'SOByPeriod'
            }
          ],
          cube : "SOByPeriod",
          schema: new XM.SalesMetadata()
        });

  }());
