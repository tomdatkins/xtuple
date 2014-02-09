/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initInventoryModels = function () {

    XM.InventoryAvailability.prototype.augment({
      canCreateWorkOrders: function (callback) {
        if (callback) { callback(this.get("isManufactured")); }
        return this;
      }
    });

  };

}());
