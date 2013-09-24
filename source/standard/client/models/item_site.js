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
      _initialize = _proto.initialize,
      _itemDidChange = _proto.itemDidChange,
      _useDefaultLocationDidChange = _proto.useDefaultLocationDidChange;

    _proto.readOnlyAttributes = (_proto.readOnlyAttributes || []).concat([
        'orderGroup',
        'groupLeadtimeFirst',
        'isPlannedTransferOrders',
        'isPerishable',
        'isPurchaseWarrantyRequired',
        'isAutoRegister',
        'planningSystem',
        'supplySite',
        'traceSequence',
        'userDefinedLocation',
        'useParametersManual'
      ]);

    var ext = {
      supplySites: null,

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

      initialize: function () {
        _initialize.apply(this, arguments);
        this.sites = [];
      },

      itemDidChange: function () {
        var K = XM.ItemSite,
          I = XM.Item,
          that = this,
          item = this.get("item"),
          site = this.get("site"),
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
          readOnlyPlanSystem = true,
          itemSites = new XM.ItemSiteRelationCollection(),
          options = {
            success: function () {
              that.supplySites = [];
              _.each(itemSites.models, function (itemSite) {
                that.supplySites.push(itemSite.getValue("site.id"));
              });
              that.trigger("supplySitesChange", that, that.supplySites, options);
            }
          };

        _itemDidChange.apply(this, arguments);

        if (!item) { return; }

        // Handle advanced planning settings
        if (isPlanningType) {
          this.set("planningSystem", K.MRP_PLANNING);
        } else if (!_.contains(plannedTypes, itemType)) {
          this.set("planningSystem", K.NO_PLANNING);
        } else {
          readOnlyPlanSystem = false;
        }

        this.setReadOnly("planningSystem", readOnlyPlanSystem)
            .setReadOnly(["orderGroup", "groupLeadtimeFirst", "mpsTimeFence"], noPlan);

        // Handle looking up valid supply sites
        if (!item || !site) {
          this.supplySites = [];
          that.trigger("supplySitesChange", this, this.supplySites, options);
        }
        options.query = {parameters: [
          {attribute: "item", value: item},
          {attribute: "site", operator: "!=", value: site}
        ]};
        itemSites.fetch(options);
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
          "isPlannedTransferOrders",
          "orderGroup",
          "groupLeadTimeFirst"
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

