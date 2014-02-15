/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XV:true, Backbone:true, enyo:true, console:true */

(function () {
  "use strict";

  XT.extensions.xdruple.initPickers = function () {

    enyo.kind({
      name: "XV.XdrupleSitePicker",
      kind: "XV.PickerWidget",
      collection: "XM.xdrupleSites"
    });

  };
}());
