/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.standard.initItemSiteModels = function () {

    var _proto = XM.ItemSite.prototype,
      _controlMethodDidChange = _proto.controlMethodDidChange,
      _itemDidChange = _proto.itemDidChange,
      _useDefaultLocationDidChange = _proto.useDefaultLocationDidChange;

    var ext = {
      controlMethodDidChange: function () {
        _controlMethodDidChange.apply(this, arguments);
        var isNotTrace = !this.isTrace();

        // Consider trace settings
        this.setReadOnly({
          traceSequence: isNotTrace,
          isPerishable: isNotTrace,
          isPurchaseWarrantyRequired: isNotTrace,
          isAutoRegister: isNotTrace
        });
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
          noPlan = !isPlanningType || _.contains(nonStockTypes, itemType);

        if (!item) { return; }

        if (isPlanningType) {
          this.set("planningSystem", K.MRP_PLANNING);
          this.setReadOnly("planningSystem");
        } else if (!_.contains(plannedTypes, itemType)) {
          this.set("planningSystem", K.NO_PLANNING);
          this.setReadOnly("planningSystem");
        } else {
          this.setReadOnly("planningSystem", false);
        }

        this.setReadOnly({
          orderGroup: noPlan,
          groupFirst: noPlan,
          mpsTimeFence: noPlan
        });

        _itemDidChange.apply(this, arguments);

      },

      isTrace: function () {
        var K = XM.ItemSite,
          controlMethod = this.get("controlMethod");
        return controlMethod === K.SERIAL_CONTROL ||
               controlMethod === K.LOT_CONTROL;
      },

      useDefaultLocationDidChange: function () {
        _useDefaultLocationDidChange.apply(this.arguments);
        var useDefault = this.get("useDefaultLocation"),
          isLocationControl = this.get("isLocationControl"),
          isTrace = this.isTrace();

        // Consider trace settings
        if (useDefault) {
          this.setReadOnly("isReceiveLocationAuto", !isLocationControl || isTrace);
          this.setReadOnly("isStockLocationAuto", !isLocationControl || isTrace);
        }
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

