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
    labels: [
      "All Opportunities - ",
      "Assigned Opportunities - ",
      "Targeted Opportunities - ",
      "Actual Opportunities - "
    ],
    toolTips: [
      "",
      "",
      "",
      ""
    ],
    query : "funnel",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Opportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Assigned Date.Calendar].[$year].[$month])}), " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Opportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Target Date.Calendar].[$year].[$month])}), " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Opportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Actual Date.Calendar].[$year].[$month])}), " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Opportunity"
      }
    ],
    cubeMetaOverride: {
      Opportunity: {name: "CROpportunity",
        measures: ["Amount, Opportunity", "Count, Opportunities", "Amount, Opportunity Weighted",
                   "Average, Opportunity", "Average, Opportunity Weighted" ],
        measureNames: ["Amount, Opportunity Gross", "Count, Opportunities", "Amount, Opportunity Weighted",
                   "Average, Opportunity Gross", "Average, Opportunity Weighted" ]
      }
    },
    measureCaptions : ["Pick Measure Below", "Previous Year"],
    measureColors : ['#ff7f0e', '#2ca02c'],
    cube : "Opportunity"
  });
  
  enyo.kind({
    name: "XV.FunnelOpportunityQuoteBookingChart",
    kind: "XV.BiFunnelChart",
    collection: "XM.AnalyticCollection",
    chartTitle: "_opportunityQuoteBookingFunnel".loc(),
    measures: [],
    measure: "",
    labels: [
      "All Opportunities - ",
      "Actual Opportunities - ",
      "All Quotes - ",
      "Converted Quotes - ",
      "All Bookings - "
    ],
    toolTips: [
      "",
      "",
      "",
      "",
      ""
    ],
    query : "funnel",
    queryTemplates: [
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Opportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Actual Date.Calendar].[$year].[$month])}), " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Opportunity"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Quote].[All Quotes]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Quote"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Quote.Quote by Status].[Converted]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Quote"
      },
      {
        query: "WITH MEMBER [Measures].[THESUM] " +
          " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
          " [Measures].[$measure]) " +
          " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
          " NON EMPTY  {Hierarchize({[Order].[All Orders]})}  ON ROWS " +
          " FROM [$cube]",
        cube: "Booking"
      },
    ],
    cubeMetaOverride: {
        Booking: {name: "SOOrder",
          measures: ["Amount", "Count", "Average"],
          measureNames: ["Amount, Order Gross", "Count, Orders", "Average, Order Gross"]
        },
        Opportunity: {name: "CROpportunity",
          measures: ["Amount", "Count", "Average"],
          measureNames: ["Amount, Opportunity Gross", "Count, Opportunities", "Average, Opportunity Gross"]
        },
        Quote: {name: "CRQuote",
          measures: ["Amount", "Count", "Average"],
          measureNames: ["Amount, Quote Gross", "Count, Quotes", "Average, Quote Gross"]
        },
      },
      measureCaptions : ["Pick Measure Below", "Previous Year"],
      measureColors : ['#ff7f0e', '#2ca02c'],
      cube : "Opportunity"
    });


}());
