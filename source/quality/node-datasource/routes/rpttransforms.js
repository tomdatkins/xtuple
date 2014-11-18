/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true */

(function () {
  "use strict";

  exports.qualityTransformFunctions = function () {
    var _ = require("underscore");
       
    var formatTestStatus = function (status) {
      var statusMap = {
        O: "Open",
        P: "Pass",
        F: "Fail"
      };
      return statusMap[status];
    };

    var formatTestDisposition = function (disposition) {
      var dispositionMap = {
        I: "In-Process",
        OK: "Released",
        R: "Rework",
        S: "Scrap",
        Q: "Quarantine"
      };
      return dispositionMap[disposition];
    };
    
    var formatOrderNumber = function (orderType, orderNumber) {
      return orderType + "-" + orderNumber;
    };
    
    _.extend(XT.transformFunctions, {
      teststatus: formatTestStatus,
      testdisposition: formatTestDisposition,
      orderTypeNumber: formatOrderNumber
    });

  };
  
}());

