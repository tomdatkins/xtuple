/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initPurchaseRequestModels = function () {

    XM.PurchaseRequest = XM.Model.extend({
      recordType: "XM.PurchaseRequest"
    });

    XM.PurchaseRequestParent = XM.Model.extend({
      recordType: "XM.PurchaseRequestParent"
    });

  };

}());

