/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true */

/** @module XV */

(function () {

  XT.extensions.inventory.initDocumentsBox = function () {

    enyo.kind({
      name: "XV.TransferOrderDocumentsBox",
      kind: "XV.DocumentsBox",
      parentKey: "transferOrder"
    });

  };

}());
