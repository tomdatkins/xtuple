/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initCharacteristicModels = function () {

    XM.Characteristic.prototype.augment({
      // Add to context attributes
      contextAttributes: ["isTransferOrders"],

      defaults: function () {
        return {isTransferOrders: false};
      }
    });
  };

}());
