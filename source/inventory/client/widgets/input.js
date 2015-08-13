/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, enyo:true, _:true*/

(function () {

  XT.extensions.inventory.initInputs = function () {

    // ..........................................................
    // TRACE WIDGET
    //
    enyo.kind({
      name: "XV.TraceWidget",
      kind: "XV.InputWidget",
      /*
        Handle barcode scanning
      */
      setValue: function (value, options) {
        if (value && value.substring(0, 1) === XT.session.settings.get("BarcodeScannerPrefix")) {
          value = value.substring(1, value.length);
        }
        this.inherited(arguments);
      }
    });

  };

}());

