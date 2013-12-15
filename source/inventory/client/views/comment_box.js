/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true */

/** @module XV */

(function () {

  XT.extensions.inventory.initCommentBox = function () {

    enyo.kind({
      name: "XV.TransferOrderCommentBox",
      kind: "XV.CommentBox",
      model: "XM.TransferOrderComment"
    });

    enyo.kind({
      name: "XV.TransferOrderLineCommentBox",
      kind: "XV.CommentBox",
      model: "XM.TransferOrderLineComment"
    });

  };

}());
