/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_areaChart": "Area Chart",
    "_backlogTrailing": "Backlog, trailing 12 months",
    "_barChart": "Bar Chart",
    "_bookingsTrailing": "Bookings, trailing 12 months",
    "_bubbleChart": "Bubble Chart",
    "_chartType": "Chart Type",
    "_ending": " ending ",
    "_lineChart": "Line Chart",
    "_measure": "Measure",
    "_opportunitiesOpenNext": "Open Opportunities, next 6 months",
    "_opportunityForecastTrailing": "Opportunity Forecast, trailing 12 months",
    "_opportunitiesFunnel": "Opportunities Funnel, trailing 12 months",
    "_opportunityQuoteBookingFunnel": "Sales Funnel, sum for trailing 12 months",
    "_opportunitiesTrailing": "Opportunities, trailing 12 months",
    "_opportunitiesBookingsTrailing": "Opportunities-Bookings, trailing 12 months",
    "_quotesTrailing": "Quotes, trailing 12 months",
    "_quotesActiveTrailing": "Active Quotes, trailing 12 months",
    "_salesVelocity": "Sales Velocity, average for trailing 12 months",
    "_shipmentsTrailing": "Shipments, trailing 12 months",

  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
