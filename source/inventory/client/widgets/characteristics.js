/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict: false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.inventory.initCharacteristicWidgets = function () {

    // ..........................................................
    // SITE TYPE
    //

    enyo.kind({
      name: "XV.SiteTypeCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.SiteTypeCharacteristic",
      which: "isTransferOrders"
    });

    // ..........................................................
    // TRANSFER ORDER
    //

    enyo.kind({
      name: "XV.TransferOrderCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.TransferOrderCharacteristic",
      which: "isTransferOrders"
    });

  };

}());
