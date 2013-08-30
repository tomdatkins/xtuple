/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.standard.initTransactionModels = function () {

    var oldfn = XM.Transaction.prototype.requiresDetail;

    XM.Transaction.prototype.requiresDetail = function () {
      // Do the normal check, plus check for trace control
      var isLocControl = oldfn.call(this),
        controlMethod = this.getValue("itemSite.controlMethod"),
        K = XM.ItemSite;
      return isLocControl ||
        controlMethod === K.LOT_CONTROL ||
        controlMethod === K.SERIAL_CONTROL;
    };

    /**
      Formats distribution detail to an object that can be processed by
      dispatch function called in `save`.

      This version deals with trace detail in addition to location.

      @returns {Object}
    */
    XM.Transaction.prototype.formatDetail = function () {
      var ret = [],
        itemSite = this.get("itemSite"),
        details = itemSite.get("detail").models;

      _.each(details, function (detail) {
        var qty = detail.get("distributed"),
         obj = { quantity: qty },
         loc,
         trace;
        if (qty) {
          loc = detail.get("location");
          trace = detail.get("trace");
          if (loc) { obj.location = loc.id; }
          if (trace) { obj.trace = trace.get("number"); }
          ret.push(obj);
        }
      });

      return ret;
    };

  };

}());
