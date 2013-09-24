/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.standard.initItemSiteModels = function () {

    var _proto = XM.ItemSite.prototype,
      _bindEvents = _proto.bindEvents,
      _controlMethodDidChange = _proto.controlMethodDidChange,
      _itemDidChange = _proto.itemDidChange,
      _useDefaultLocationDidChange = _proto.useDefaultLocationDidChange;

    var ext = {
      bindEvents: function () {
        _bindEvents.apply(this, arguments);
        this.on('change:planningSystem', this.planningSystemDidChange);
      },

      controlMethodDidChange: function () {
        _controlMethodDidChange.apply(this, arguments);
        var isNotTrace = !this.isTrace();

        // Consider trace settings
        this.setReadOnly([
          "traceSequence",
          "isPerishable",
          "isPurchaseWarrantyRequired",
          "isAutoRegister"
        ], isNotTrace);
      },

      itemDidChange: function () {
        var K = XM.ItemSite,
          I = XM.Item,
          item = this.get("item"),
          itemType = item ? item.get("itemType") : false,
          isPlanningType = itemType === I.PLANNING,
          plannedTypes = [
            I.PURCHASED,
            I.MANUFACTURED,
            I.PHANTOM,
            I.BREEDER,
            I.CO_PRODUCT,
            I.BY_PRODUCT,
            I.OUTSIDE_PROCESS
          ],
          nonStockTypes = [
            I.REFERENCE,
            I.PLANNING,
            I.BREEDER,
            I.BY_PRODUCT,
            I.CO_PRODUCT
          ],
          noPlan = !isPlanningType || _.contains(nonStockTypes, itemType),
          readOnlyPlanSystem = true;

        if (!item) { return; }

        if (isPlanningType) {
          this.set("planningSystem", K.MRP_PLANNING);
        } else if (!_.contains(plannedTypes, itemType)) {
          this.set("planningSystem", K.NO_PLANNING);
        } else {
          readOnlyPlanSystem = false;
        }

        this.setReadOnly("planningSystem", readOnlyPlanSystem);
        this.setReadOnly(["orderGroup", "groupFirst", "mpsTimeFence"], noPlan);

        _itemDidChange.apply(this, arguments);
      },

      isTrace: function () {
        var K = XM.ItemSite,
          controlMethod = this.get("controlMethod");
        return controlMethod === K.SERIAL_CONTROL ||
               controlMethod === K.LOT_CONTROL;
      },

      planningSystemDidChange: function () {
        var K = XM.ItemSite,
          planningSystem = this.get("planningSystem");
        this.setReadOnly([
          "createPlannedTransfers",
          "orderGroup",
          "groupFirst"
        ], planningSystem !== K.NO_PLANNING);
      },

      useDefaultLocationDidChange: function () {
        _useDefaultLocationDidChange.apply(this, arguments);
        var useDefault = this.get("useDefaultLocation"),
          isLocationControl = this.get("isLocationControl"),
          isTrace = this.isTrace();

        // Consider trace settings
        this.setReadOnly([
          "isReceiveLocationAuto",
          "isStockLocationAuto"
        ], !isLocationControl || isTrace || !useDefault);
      }
    };

    XM.ItemSite = XM.ItemSite.extend(ext);

    // ..........................................................
    // CLASS CONSTANTS
    //

    /**
      Constants for item site inventory settings.
    */
    _.extend(XM.ItemSite, {

      /**
        Lot Control.

        @static
        @constant
        @type String
        @default L
      */
      LOT_CONTROL: "L",


      /**
        Serial Control

        @static
        @constant
        @type Number
        @default 'S'
      */
      SERIAL_CONTROL: "S",

      /**
        No Planning.

        @static
        @constant
        @type String
        @default 'N'
      */
      NO_PLANNING: "N",

      /**
        MRP Planning.

        @static
        @constant
        @type String
        @default 'M'
      */
      MRP_PLANNING: "M",


      /**
        MPS Planning

        @static
        @constant
        @type Number
        @default 'S'
      */
      MPS_PLANNING: "S"

    });

  };


}());

