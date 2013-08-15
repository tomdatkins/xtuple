/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.standard.initModels = function () {

    var oldFunc = XM.Sales.prototype.statusDidChange;

    XM.Sales.prototype.statusDidChange = function () {
      oldFunc.apply(this, arguments);
      if (XM.siteRelations.length > 1 && this.get("MultiWhs")) {
        this.setReadOnly("MultiWhs", true);
      }
    };

  };
}());
