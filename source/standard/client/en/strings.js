/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_defaultSite": "Default Site",
    "_enableMultipleSites": "Enable Multiple Sites",
    "_groupLeadtimeFirst": "Group Leadtime First",
    "_isAutoRegister": "Auto Register",
    "_isPlannedTransferOrders": "Plan Transfers",
    "_isPerishable": "Perishable",
    "_isPurchaseWarrantyRequired": "Warranty Required",
    "_lot": "Lot",
    "_LotSerialControl": "Trace Control",
    "_mrp": "MRP",
    "_multiSite": "Multi-Site",
    "_orderGroup": "Order Grouping Days",
    "_orders": "Orders",
    "_planningSystem": "Planning System",
    "_serial": "Serial",
    "_supplySite": "Supply Site",
    "_traceOptions": "Trace Options",
    "_traceSequence": "Sequence",
    "_traceSequences": "Trace Sequences"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
