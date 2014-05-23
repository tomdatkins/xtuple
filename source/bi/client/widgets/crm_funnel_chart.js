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
    name: "XV.FunnelOpportunitiesChart",
    kind: "XV.BiFunnelChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_opportunitiesFunnel".loc(),
    measures: [
    ],
    measure: "",
    /*
     * Dates are updated in clickDrill function.  They are repeated in some parameters as some
     * queries need four dates (and it doesn't hurt to repeat)
     */
    drillDown: [
      {attr: "number",
       recordType: "XM.OpportunityRelation",
       collection: "XM.OpportunityRelationCollection",
       workspace: "XM.OpportunityRelation",
       parameters: [
        {name: "fromStartDate", operator: ">=", value: new Date()},
        {name: "toStartDate", operator: "<=", value: new Date()},
        {name: "fromStartDate", operator: ">=", value: new Date()},
        {name: "toStartDate", operator: "<=", value: new Date()},
        {name: "showInactive", operator: "=", value: true}
      ],
     },
      {attr: "number",
       recordType: "XM.OpportunityRelation",
       collection: "XM.OpportunityRelationCollection",
       workspace: "XM.OpportunityRelation",
       parameters: [
        {name: "fromStartDate", operator: ">=", value: new Date()},
        {name: "toStartDate", operator: "<=", value: new Date()},
        {name: "fromAssignDate", operator: ">=", value: new Date()},
        {name: "toAssignDate", operator: "<=", value: new Date()},
        {name: "showInactive", operator: "=", value: true}
      ],
     },
      {attr: "number",
       recordType: "XM.OpportunityRelation",
       collection: "XM.OpportunityRelationCollection",
       workspace: "XM.OpportunityRelation",
       parameters: [
        {name: "fromStartDate", operator: ">=", value: new Date()},
        {name: "toStartDate", operator: "<=", value: new Date()},
        {name: "fromTargetDate", operator: ">=", value: new Date()},
        {name: "toTargetDate", operator: "<=", value: new Date()},
        {name: "showInactive", operator: "=", value: true}
      ],
     },
      {attr: "number",
       recordType: "XM.OpportunityRelation",
       collection: "XM.OpportunityRelationCollection",
       workspace: "XM.OpportunityRelation",
       parameters: [
        {name: "fromStartDate", operator: ">=", value: new Date()},
        {name: "toStartDate", operator: "<=", value: new Date()},
        {name: "fromActualDate", operator: ">=", value: new Date()},
        {name: "toActualDate", operator: "<=", value: new Date()},
        {name: "showInactive", operator: "=", value: true}
      ],
     }
    ],
    labels: [
      "_allOpportunities".loc() + ":          ",
      "_assignedOpportunities".loc() + ": ",
      "_targetedOpportunities".loc() + ":  ",
      "_wonOpportunities".loc() + ":     "
    ],
    toolTips: [],
    query : "funnel",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "CROpportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Assigned Date.Calendar].[$year].[$month])}), " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "CROpportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Target Date.Calendar].[$year].[$month])}), " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "CROpportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity.Opportunity by Status by Type].[Won]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "CROpportunity"
      }
    ],
    measureColors : ['#ff7f0e', '#2ca02c'],
    cube : "CROpportunity",
    schema: new XM.CRMOppFunnelMetadata()
  });
  
  enyo.kind({
    name: "XV.FunnelOpportunityQuoteBookingChart",
    kind: "XV.BiFunnelChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_opportunityQuoteBookingFunnel".loc(),
    measures: [],
    measure: "",
    drillDown: [
    /*
     * Dates are updated in clickDrill function.  They are repeated in some parameters as some
     * queries need four dates (and it doesn't hurt to repeat)
     */
      {attr: "number",
       recordType: "XM.OpportunityRelation",
       collection: "XM.OpportunityRelationCollection",
       workspace: "XM.OpportunityRelation",
       parameters: [
        {name: "fromStartDate", operator: ">=", value: new Date()},
        {name: "toStartDate", operator: "<=", value: new Date()},
        {name: "fromStartDate", operator: ">=", value: new Date()},
        {name: "toStartDate", operator: "<=", value: new Date()},
        {name: "showInactive", operator: "=", value: true}
      ],
     },
      {attr: "number",
       recordType: "XM.OpportunityRelation",
       collection: "XM.OpportunityRelationCollection",
       workspace: "XM.OpportunityRelation",
       parameters: [
        {name: "fromStartDate", operator: ">=", value: new Date()},
        {name: "toStartDate", operator: "<=", value: new Date()},
        {name: "fromActualDate", operator: ">=", value: new Date()},
        {name: "toActualDate", operator: "<=", value: new Date()},
        {name: "showInactive", operator: "=", value: true}
      ],
     },
      {attr: "number",
       recordType: "XM.QuoteRelation",
       collection: "XM.QuoteRelationCollection",
       workspace: "XM.QuoteRelation",
       parameters: [
        {name: "createdFromDate", operator: ">=", value: new Date()},
        {name: "createdToDate", operator: "<=", value: new Date()},
        {name: "createdFromDate", operator: ">=", value: new Date()},
        {name: "createdToDate", operator: "<=", value: new Date()},
        {name: "showClosed", operator: "ANY", value: ["C", "O"]},
        {name: "showExpired", operator: "!=", value: new Date(0, 1, 1)},
      ],
     },
      {attr: "number",
       recordType: "XM.QuoteRelation",
       collection: "XM.QuoteRelationCollection",
       workspace: "XM.QuoteRelation",
       parameters: [
        {name: "createdFromDate", operator: ">=", value: new Date()},
        {name: "createdToDate", operator: "<=", value: new Date()},
        {name: "createdFromDate", operator: ">=", value: new Date()},
        {name: "createdToDate", operator: "<=", value: new Date()},
        //{name: "showClosed", operator: "=", value: ["C"]},
        {name: "showExpired", operator: "!=", value: new Date(0, 1, 1)},
        {name: "status", operator: "=", value: ["C"]},  //converted
      ],
     },
      {attr: "number",
       recordType: "XM.SalesOrderRelation",
       collection: "XM.SalesOrderRelationCollection",
       workspace: "XM.SalesOrderRelation",
       parameters: [
        {name: "createdFromDate", operator: ">=", value: new Date()},
        {name: "createdToDate", operator: "<=", value: new Date()},
        {name: "createdFromDate", operator: ">=", value: new Date()},
        {name: "createdToDate", operator: "<=", value: new Date()},
        {name: "status", operator: "ANY", value: ["C", "O"]}
      ],
     }
    ],
    labels: [
      "_allOpportunities".loc() + ":      ",
      "_wonOpportunities".loc() + ": ",
      "_allQuotes".loc() + ":               ",
      "_convertedQuotes".loc() + ":     ",
      "_allBookings".loc() + ":            "
    ],
    toolTips: [],
    query : "funnel",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "CROpportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity.Opportunity by Status by Type].[Won]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "CROpportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Quote].[All Quotes]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "CRQuote"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Quote.Quote by Status].[Converted]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "CRQuote"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Order].[All Orders]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "SOOrder"
      },
    ],
    measureColors : ['#ff7f0e', '#2ca02c'],
    cube : "CROpportunity",
    schema: new XM.CRMFunnelMetadata()
  });


}());
