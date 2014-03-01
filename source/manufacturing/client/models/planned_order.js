/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initPlannedOrderModels = function () {

    var _f = XM.PlannedOrder.prototype.formatPlannedOrderType;

    _.extend(XM.PlannedOrder.prototype, {

      formatPlannedOrderType: function () {
        var type = this.get("plannedOrderType"),
          K = XM.PlannedOrder;

        return type === K.WORK_ORDER ? "_workOrder".loc() : _f.apply(this);
      }

    });

    XM.PlannedOrder.prototype.augment = ({
      itemSiteChanged: function () {
        var itemSite = this.get("itemSite"),
          plannedOrderTypes = this.getValue("plannedOrderTypes"),
          K = XM.PlannedOrder;

        if (itemSite) {
          if (itemSite.get("isManufactured")) {
            plannedOrderTypes.add({
              id: K.WORK_ORDER,
              name: "_workOrder".loc()
            });
          }
        }
      }
    });

    _.extend(XM.PlannedOrder, {
      /** @scope XM.PlannedOrder */

      /**
        Work Order

        @static
        @constant
        @type String
        @default W
      */
      WORK_ORDER: "W"

    });

  };

}());

