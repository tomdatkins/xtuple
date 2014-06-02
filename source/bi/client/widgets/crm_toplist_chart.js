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
      name: "XV.Period12QuoteToplistChart",
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
          {dimension: "quote",
           attr: "number",
           recordType: "XM.QuoteRelation",
           collection: "XM.QuoteCollection",
           workspace: "XM.QuoteRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
            {name: "showClosed", operator: "ANY", value: ["C", "O"]},
            {name: "showExpired", operator: "!=", value: new Date(0, 1, 1)},
          ]
        },
        ],
        measures: [],
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
              cube:  'CRQuote'
            }
          ],
          cube : "CRQuote",
          schema: new XM.CRMMetadata()
        });
    
    enyo.kind({
      name: "XV.Period12QuoteActiveToplistChart",
      kind: "XV.BiToplistChart",
      collection: "XM.AnalyticCollection",
      chartTitle: "_toplistTrailing12".loc(),
      prefixChartTitle: "_active".loc(),
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
          {dimension: "quote",
           attr: "number",
           recordType: "XM.QuoteRelation",
           collection: "XM.QuoteCollection",
           workspace: "XM.QuoteRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
        ],
        measures: [],
        query : "",
        queryTemplates: [
          {
              query: 'WITH MEMBER [Measures].[NAME] AS $dimensionHier.CurrentMember.Properties("$dimensionNameProp")' +
              " MEMBER [Measures].[KPI] as 'IIf((([Measures].[Days Expire Date] = -1) OR [Measures].[Days, Now to Expiration] > 0), [Measures].[$measure], 0.00)'" +
              ' MEMBER [Measures].[THESUM]  as SUM({LASTPERIODS(12, [$dimensionTime].[$year].[$month])},  [Measures].[KPI])' +
              ' select NON EMPTY {[Measures].[THESUM], [Measures].[NAME]} ON COLUMNS,' +
              ' NON EMPTY ORDER({filter(TopCount($dimensionHier.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) },' +
              '                 [Measures].[THESUM],' +
              '                 DESC) ON ROWS' +
              ' from [$cube]',
              cube:  'CRQuote'
            }
          ],
          cube : "CRQuote",
          schema: new XM.CRMMetadata()
        });
    
    enyo.kind({
      name: "XV.Period12OpportunityToplistChart",
      kind: "XV.BiToplistChart",
      collection: "XM.AnalyticCollection",
      chartTitle: "_toplistTrailing12".loc(),
      parameterWidget: "XV.OpportunityChartParameters",
      drillDown: [
        {dimension: "account",
         attr: "number",
         recordType: "XM.AccountRelation",
         collection: "XM.AccountRelationCollection",
         workspace: "XM.AccountRelation",
         parameters: [
          {name: "number", operator: "MATCHES", value: ""},
        ]
        },
        {dimension: "user",
           attr: "number",
           recordType: "XM.UserAccountRelation",
           collection: "XM.UserAccountRelationCollection",
           workspace: "XM.UserAccountRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
        {dimension: "opportunity",
           attr: "number",
           recordType: "XM.OpportunityRelation",
           collection: "XM.OpportunityRelationCollection",
           workspace: "XM.OpportunityRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
            {name: "showInactive", operator: "=", value: true}
          ]
        }
        ],
        measures: [],
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
              cube:  'CROpportunity'
            }
          ],
          cube : "CROpportunity",
          schema: new XM.CRMMetadata()
        });
    
    enyo.kind({
      name: "XV.Period12OpportunityActiveToplistChart",
      kind: "XV.BiToplistChart",
      collection: "XM.AnalyticCollection",
      chartTitle: "_toplistTrailing12".loc(),
      prefixChartTitle: "_active".loc(),
      parameterWidget: "XV.OpportunityChartParameters",
      drillDown: [
        {dimension: "account",
         attr: "number",
         recordType: "XM.AccountRelation",
         collection: "XM.AccountRelationCollection",
         workspace: "XM.AccountRelation",
         parameters: [
          {name: "number", operator: "MATCHES", value: ""},
        ]
        },
        {dimension: "user",
           attr: "number",
           recordType: "XM.UserAccountRelation",
           collection: "XM.UserAccountRelationCollection",
           workspace: "XM.UserAccountRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""},
          ]
        },
        {dimension: "opportunity",
           attr: "number",
           recordType: "XM.OpportunityRelation",
           collection: "XM.OpportunityRelationCollection",
           workspace: "XM.OpportunityRelation",
           parameters: [
            {name: "number", operator: "MATCHES", value: ""}
          ]
        }
        ],
        measures: [],
        query : "",
        initialWhere: "[Opportunity.Opportunity by Status by Stage].[Active]",
        queryTemplates: [
          {
              query: 'WITH MEMBER [Measures].[NAME] AS $dimensionHier.CurrentMember.Properties("$dimensionNameProp")' +
              ' MEMBER [Measures].[THESUM]  as SUM({LASTPERIODS(12, [$dimensionTime].[$year].[$month])},  [Measures].[$measure])' +
              ' select NON EMPTY {[Measures].[THESUM], [Measures].[NAME]} ON COLUMNS,' +
              ' NON EMPTY ORDER({filter(TopCount($dimensionHier.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) },' +
              '                 [Measures].[THESUM],' +
              '                 DESC) ON ROWS' +
              ' from [$cube]',
              cube:  'CROpportunity'
            }
          ],
          cube : "CROpportunity",
          schema: new XM.CRMMetadata()
        });

  }());
