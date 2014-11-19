/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initStartup = function () {
    XT.cacheCollection("XM.laborRates", "XM.LaborRateCollection", "code");
    XT.cacheCollection("XM.operationTypes", "XM.OperationTypeCollection", "name");
    XT.cacheCollection("XM.standardOperations", "XM.StandardOperationCollection", "number");
    XT.cacheCollection("XM.workOrderEmailProfiles", "XM.WorkOrderEmailProfileCollection", "name");
    XT.cacheCollection("XM.workCenters", "XM.WorkCenterCollection", "code");
  };

}());
