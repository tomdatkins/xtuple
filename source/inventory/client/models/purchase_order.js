/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initPurchaseOrderModels = function () {

    if (!XT.extensions.purchasing) {
      return;
    }

    XM.PurchaseOrder.prototype.augment({
      readOnlyAttributes: ["isDropShip", "salesOrder"]
    });

    XM.PurchaseOrderListItem.prototype.augment({
      canReceiveItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("EnterReceipts");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      }
    });

  };


}());

