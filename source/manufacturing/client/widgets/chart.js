/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  XT.extensions.manufacturing.initCharts = function () {

    enyo.kind({
      name: "XV.UnclosedWorkOrderBarChart",
      kind: "XV.DrilldownBarChart",
      collection: "XM.WorkOrderListItemCollection",
      chartTitle: "_unclosedWorkOrders".loc(),
      groupByOptions: [
        { name: "status" },
        { name: "plannerCode" },
        { name: "site" }
      ],
      // filter out closed w/o's
      query: {
        parameters: [{
          "attribute": "status",
          "operator": "!=",
          "value": "C"
        }]
      }
    });

    enyo.kind({
      name: "XV.UnclosedWorkOrderWipBarChart",
      kind: "XV.UnclosedWorkOrderBarChart",
      chartTitle: "_unclosedWorkOrdersWip".loc(),
      totalField: "wipValue"
    });
  };

}());

