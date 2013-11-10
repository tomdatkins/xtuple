/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_backlogTrailing": "Backlog, Trailing Periods",
    "_bookingsTrailing": "Bookings, Trailing Periods",
    "_shipmentsTrailing": "Shipments, Trailing Periods",
    "_chartType": "Chart Type",
    "_measure": "Measure"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
