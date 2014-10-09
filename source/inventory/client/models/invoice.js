/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true, async:true */

(function () {
  "use strict";

  XT.extensions.inventory.initInvoiceModels = function () {

    //
    // INVOICE
    //

    XM.Invoice.prototype.augment(XM.InvoiceAndReturnInventoryMixin);

    //
    // INVOICE LINE
    //

    XM.InvoiceLine.prototype.augment(XM.InvoiceAndReturnLineInventoryMixin);

    //
    // INVOICE LIST 
    //

    XM.InvoiceListItem.prototype.augment(_.extend(XM.InvoiceAndReturnListItemMixin, {
      // These are used by the shared (return & invoice) doPostWithInventory method in inventory.js
      transParams: {
        transWorkspace: "XV.IssueStockWorkspace",
        transDate: "invoiceDate",
        oldPost: XM.InvoiceListItem.prototype.doPost,
        sourceDocName: "XM.Invoice",
        transQtyAttrName: "toIssue",
        qtyAttrName: "billed"
      }
    }));
  };

}());
