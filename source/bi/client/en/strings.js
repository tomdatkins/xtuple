/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_areaChart": "Area Chart",
    "_backlogTrailing": "Backlog, Trailing Periods",
    "_barChart": "Bar Chart",
    "_bookingsTrailing": "Bookings, Trailing Periods",
    "_bubbleChart": "Bubble Chart",
    "_chartType": "Chart Type",
    "_lineChart": "Line Chart",
    "_measure": "Measure",
    "_opportunitiesTrailing": "Opportunities, Trailing Periods",
    "_quotesTrailing": "Quotes, Trailing Periods",
    "_shipmentsTrailing": "Shipments, Trailing Periods",
    "_opportunityForecastTrailing": "Opportunity Forecast, Trailing Periods"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
