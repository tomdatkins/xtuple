/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initItemSiteModels = function () {

    var _proto = XM.ItemSite.prototype,
      _defaults = _proto.defaults;

    // Unfortunately augment won't work here
    XM.ItemSite = XM.ItemSite.extend({
      defaults: function () {
        var defaults = _defaults.apply(this, arguments);
        defaults.isManufactured = false;
        return defaults;
      }
    });

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
