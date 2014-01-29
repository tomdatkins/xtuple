/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initInvoiceModels = function () {

    XM.Invoice.prototype.augment({

      addSubtotalFields: function () {
        this.extraSubtotalFields.push("freight");
      }

    });

    //_.extend(XM.Invoice, /** @lends XM.SalesOrderLine# */{

    //  extraSubtotalFields: extraSubtotalFields.concat("freight")

    //});
  };

}());
