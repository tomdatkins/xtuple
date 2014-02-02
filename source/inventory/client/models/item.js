/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initItemModels = function () {

    XM.Item.prototype.isReadyClean = function () {
      return this.getStatus() === XM.Model.READY_CLEAN;
    };

  };


}());

