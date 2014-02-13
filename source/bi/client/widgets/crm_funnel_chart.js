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
      "tip 1",
      "tip 2",
      "tip 3",
      "tip 4"
    ],
    query : "funnel",
    queryTemplates: [
      "WITH MEMBER [Measures].[THESUM] " +
      " as SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, " +
      " [Measures].[$measure]) " +
      " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
      " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
      " FROM [$cube]",
      
      "WITH MEMBER [Measures].[THESUM] " +
      " as SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Assigned Date.Calendar].[$year].[$month])}), " +
      " [Measures].[$measure]) " +
      " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
      " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
      " FROM [$cube]",
      
      "WITH MEMBER [Measures].[THESUM] " +
      " as SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Target Date.Calendar].[$year].[$month])}), " +
      " [Measures].[$measure]) " +
      " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
      " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
      " FROM [$cube]",
      
      "WITH MEMBER [Measures].[THESUM] " +
      " as SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Actual Date.Calendar].[$year].[$month])}), " +
      " [Measures].[$measure]) " +
      " SELECT NON EMPTY {[Measures].[THESUM] } ON COLUMNS, " +
      " NON EMPTY  {Hierarchize({[Opportunity].[All Opportunities]})}  ON ROWS " +
      " FROM [$cube]"
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

}());
