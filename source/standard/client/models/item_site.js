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
      _costMethodDidChange = _proto.costMethodDidChange,
      _initialize = _proto.initialize,
      _itemDidChange = _proto.itemDidChange,
      _statusDidChange = _proto.statusDidChange,
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
        this.on('change:planningSystem', this.planningSystemDidChange)
            .on('change:isPlannedTransferOrders', this.isPlannedTransferOrdersDidChange)
            .on('change:site', this.siteDidChange);
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

      costMethodDidChange: function () {
        _costMethodDidChange.apply(this, arguments);
        var K = XM.ItemSite,
          costMethod = this.get("costMethod");
        if (costMethod === K.JOB_COST) {
          this.set({
            planningSystem: K.NO_PLANNING,
            isPlannedTransferOrders: false
          });
        }
      },

      fetchSupplySites: function () {
        var that = this,
          item = this.get("item"),
          site = this.get("site"),
          itemSites = new XM.ItemSiteRelationCollection(),
          options = {
            success: function () {
              that.supplySites = [];
              _.each(itemSites.models, function (itemSite) {
                that.supplySites.push(itemSite.getValue("site.code"));
              });
              that.trigger("supplySitesChange", that, that.supplySites, options);
            }
          };
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

      initialize: function () {
        _initialize.apply(this, arguments);
        this.supplySites = [];
      },

      isPlannedTransferOrdersDidChange: function () {
        var planTransfers = this.get("isPlannedTransferOrders");
        if (planTransfers && this.supplySites.length) {
          this.set("supplySite", this.supplySites[0]);
        } else {
          this.unset("supplySite");
        }
        this.setReadOnly("supplySite", !planTransfers);
      },

      itemDidChange: function () {
        _itemDidChange.apply(this, arguments);
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

        this.fetchSupplySites();
      },

      isTrace: function () {
        var K = XM.ItemSite,
          controlMethod = this.get("controlMethod");
        return controlMethod === K.SERIAL_CONTROL ||
               controlMethod === K.LOT_CONTROL;
      },

      planningSystemDidChange: function () {
        var K = XM.ItemSite,
          planningSystem = this.get("planningSystem"),
          isNotPlanned = planningSystem === K.NO_PLANNING;
        this.setReadOnly([
          "isPlannedTransferOrders",
          "orderGroup",
          "groupLeadtimeFirst"
        ], isNotPlanned);
        if (isNotPlanned) {
          this.set("isPlannedTransferOrders", false);
        }
      },

      siteDidChange: function () {
        this.fetchSupplySites();
      },

      statusDidChange: function () {
        _statusDidChange.apply(this, arguments);
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.planningSystemDidChange();
          this.setReadOnly("supplySite", !this.get("isPlannedTransferOrders"));
        }
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

