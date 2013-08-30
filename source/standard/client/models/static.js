/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.standard.initStaticModels = function () {
    XM.controlMethods.add({ id: XM.ItemSite.LOT_CONTROL, name: "_lot".loc() });
    XM.controlMethods.add({ id: XM.ItemSite.SERIAL_CONTROL, name: "_serial".loc() });
  };

}());
