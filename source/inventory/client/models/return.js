/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true, async:true */

(function () {
  "use strict";

  XT.extensions.inventory.initReturnModels = function () {

    //
    // RETURN
    //

    XM.Return.prototype.augment(XM.InvoiceAndReturnInventoryMixin);

    //
    // RETURN LINE
    //

    XM.ReturnLine.prototype.augment(XM.InventoryAndReturnLineInventoryMixin);

    //
    // RETURN LIST ITEM
    //

    XM.ReturnListItem.prototype.augment(_.extend(XM.InvoiceAndReturnListItemMixin, {
      // These are used by the shared (return & invoice) doPostWithInventory method in inventory.js
      transParams: {
        transWorkspace: "XV.EnterReceiptWorkspace",
        transDate: "returnDate",
        oldPost: XM.ReturnListItem.prototype.doPost,
        sourceDocName: "XM.Return",
        transQtyAttrName: "toReceive",
        qtyAttrName: "returned"
      }
    }));
  };
}());

