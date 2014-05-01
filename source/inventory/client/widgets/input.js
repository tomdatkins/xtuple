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
      handlers: {
        onBarcodeCapture: "captureBarcode"
      },
      /**
        Assume inEvent.data is trace data unless it's location data
      */
      captureBarcode: function (inSender, inEvent) {
        if (this.disabled) {
          // do nothing if disabled
          return;
        }
        var locations = new XM.LocationCollection(),
          modelMatch;

        modelMatch = locations.find(function (model) {
          return model.format() === inEvent.data;
        });
        locations.fetch({success: modelMatch});
          
        if (!modelMatch) {
          // it's not a location, so it must be data that we're interested in
          this.setValue(inEvent.data);
        }
      }
    });

  };

}());

