/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initOrderModels = function () {

    XM.Order.WORK_ORDER = "WO";
    XM.OrderMixin.localize[XM.Order.WORK_ORDER] = "_workOrder".loc();

  };

}());

