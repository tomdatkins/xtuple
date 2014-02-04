/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initItemSiteModels = function () {

    /**
      @class

      @extends XM.WorkflowSource
    */
    XM.PlannerCodeWorkOrderWorkflow = XM.WorkflowSource.extend(
      /** @lends XM.PlannerCodeWorkOrderWorkflow.prototype */{

      recordType: "XM.PlannerCodeWorkOrderWorkflow"

    });

  };

}());