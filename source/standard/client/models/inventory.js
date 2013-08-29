/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.standard.initInventoryModels = function () {

    var oldfn = XM.IssueToShipping.prototype.requiresDetail;

    XM.IssueToShipping.prototype.requiresDetail = function () {
      // Do the normal check, plus check for trace control
      var isLocControl = oldfn.call(this),
        controlMethod = this.getValue("itemSite.controlMethod"),
        K = XM.ItemSite;
      return isLocControl ||
        controlMethod === K.LOT_CONTROL ||
        controlMethod === K.SERIAL_CONTROL;
    };

  };

}());
