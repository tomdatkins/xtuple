/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, enyo:true*/

(function () {

  XT.extensions.standard.initPickers = function () {

    // ..........................................................
    // PLANNING SYSTEM
    //

    enyo.kind({
      name: "XV.PlanningSystemPicker",
      kind: "XV.PickerWidget",
      collection: "XM.planningSystems",
      valueAttribute: "id",
      showNone: false
    });

  };

}());
