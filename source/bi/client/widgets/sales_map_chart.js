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
    parameterWidget: "XV.OpportunityChartParameters",
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
    measureColors : ['#ff7f0e', '#2ca02c'],
    // Query properties
    cube : "SOOrder",
    schema: new XM.SalesMetadata(),
    queryTemplates: [
      _.extend(new XT.mdxQueryMapPeriods(), {cube: "SOOrder"}),
    ],
  });
  
}());
