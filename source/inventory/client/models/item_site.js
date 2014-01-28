/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initItemSiteModels = function () {

    var _proto = XM.ItemSite.prototype,
      _bindEvents = _proto.bindEvents,
      _defaults = _proto.defaults,
      _initialize = _proto.initialize,
      _validate = _proto.validate,
      _controlMethodDidChange = _proto.controlMethodDidChange,
      _costMethodDidChange = _proto.costMethodDidChange,
      _itemDidChange = _proto.itemDidChange,
      _statusDidChange = _proto.statusDidChange,
      _useDefaultLocationDidChange = _proto.useDefaultLocationDidChange;

    _proto.readOnlyAttributes = (_proto.readOnlyAttributes || []).concat([
        'abcClass',
        'controlMethod',
        'costMethod',
        'cycleCountFrequency',
        'receiveLocation',
        'isAutomaticAbcClassUpdates',
        'isLocationControl',
        'isReceiveLocationAuto',
        'isStocked',
        'isPlannedTransferOrders',
        'isPerishable',
        'isPurchaseWarrantyRequired',
        'isAutoRegister',
        'isStockLocationAuto',
        'maximumOrderQuantity',
        'minimumOrderQuantity',
        'multipleOrderQuantity',
        'orderToQuantity',
        'reorderLevel',
        'safetyStock',
        'stockLocation',
        'useDefaultLocation',
        'userDefinedLocation',
        'useParametersManual',
        'orderGroup',
        'groupLeadtimeFirst',
        'planningSystem',
        'supplySite',
        'traceSequence'
      ]);

    var ext = {
      /**
        An array of cost methods allowed for this item site. Should
        not be edited directly

        @seealso addCostMethod
        @seealso removeCostMethod
      */
      costMethods: null,
      supplySites: null,

      defaults: function () {
        var defaults = _defaults.apply(this, arguments),
          K = XM.ItemSite;
        defaults = _.extend(defaults, {
          abcClass: "A",
          isAutomaticAbcClassUpdates: false,
          costMethod: K.NO_COST,
          cycleCountFrequency: 0,
          isStocked: false,
          safetyStock: 0,
          useParameters: false,
          useParametersManual: false,
          reorderLevel: 0,
          orderToQuantity: 0,
          minimumOrderQuantity: 0,
          multipleOrderQuantity: 0,
          maximumOrderQuantity: 0,
          isLocationControl: false,
          isReceiveLocationAuto: false,
          isIssueLocationAuto: false,
        });

        // Make user select site in a multi site setup
        if (XT.session.settings.get("MultiWhs")) {
          delete defaults.site;
        }

        return defaults;
      },

      /**
        Add a cost method to the `costMethods` array. Triggers
        a `costMethodsChange` event.

        @param {String|Array} Cost Method or array of cost methods
        @param {Object} Options
        @returns Receiver
        @seealso removeCostMethod
      */
      addCostMethod: function (costMethods, options) {
        var K = XM.ItemSite,
          that = this,
          settings = XT.session.settings,
          allowAvg = settings.get("AllowAvgCostMethod"),
          allowStd = settings.get("AllowStdCostMethod"),
          allowJob = settings.get("AllowJobCostMethod"),
          changed = false;

        if (!this.costMethods) {
          this.costMethods = [];
          changed = true;
        }

        if (typeof costMethods === "string") {
          costMethods = [costMethods];
        }

        _.each(costMethods, function (costMethod) {
          // Only process valid methods
          if (costMethod === K.NO_COST ||
             (costMethod === K.STANDARD_COST && allowStd) ||
             (costMethod === K.AVERAGE_COST && allowAvg) ||
             (costMethod === K.JOB_COST && allowJob)) {

            // Update the array if it's not there
            if (!_.contains(that.costMethods, costMethod)) {
              that.costMethods.push(costMethod);
              changed = true;
            }
          }
        });

        // Notify the change
        if (changed) {
          this.trigger("costMethodsChange", this, this.costMethods, options);
        }
        return this;
      },

      bindEvents: function () {
        _bindEvents.apply(this, arguments);
        this.on('change:controlMethod', this.controlMethodDidChange)
            .on('change:costMethod', this.costMethodDidChange)
            .on('change:item', this.itemDidChange)
            .on('change:useParameters', this.useParametersDidChange)
            .on('change:isLocationControl change:useDefaultLocation',
                this.useDefaultLocationDidChange)
            .on('change:planningSystem', this.planningSystemDidChange)
            .on('change:isPlannedTransferOrders', this.isPlannedTransferOrdersDidChange)
            .on('change:site', this.siteDidChange);
      },

      controlMethodDidChange: function () {
        var K = XM.ItemSite,
          I = XM.Item,
          controlMethod = this.get("controlMethod"),
          costMethod = this.get("costMethod"),
          item = this.get("item"),
          itemType = item ? item.get("itemType") : false,
          quantityOnHand = this.get("quantityOnHand"),
          settings = XT.session.settings,
          allowAvg = settings.get("AllowAvgCostMethod"),
          allowStd = settings.get("AllowStdCostMethod"),
          allowJob = settings.get("AllowJobCostMethod"),
          isNotTrace = !this.isTrace();

        /* Set default cost method */
        if (controlMethod === K.NO_CONTROL ||
            itemType === I.REFERENCE ||
            itemType ===  I.KIT) {
          this.addCostMethod(K.NO_COST)
              .removeCostMethod([K.STANDARD_COST, K.AVERAGE_COST, K.JOB_COST])
              .set("costMethod", K.NO_COST)
              .setReadOnly("costMethod")
              .toggleInventorySettings(false);
        } else {
          // Set available cost methods
          this.removeCostMethod(K.NO_COST)
              .addCostMethod([K.STANDARD_COST, K.AVERAGE_COST])
              .setReadOnly("costMethod", false);

          // Determine if Job Cost is possible
          if ((itemType === I.MANUFACTURED ||
              itemType === I.PURCHASED ||
              itemType === I.OUTSIDE_PROCESS) &&
            controlMethod !== K.NO_CONTROL &&
            allowJob && !quantityOnHand) {
            this.addCostMethod(K.JOB_COST);
          } else {
            this.removeCostMethod(K.JOB_COST);
          }

          if (costMethod === K.NO_COST) {
            if (allowStd) {
              this.set("costMethod", K.STANDARD_COST);
            } else if (allowAvg) {
              this.set("costMethod", K.AVERAGE_COST);
            } else if (allowJob) {
              this.set("costMethod", K.JOB_COST);
            }
          }

          // Consider trace settings
          this.setReadOnly([
            "traceSequence",
            "isPerishable",
            "isPurchaseWarrantyRequired",
            "isAutoRegister"
          ], isNotTrace);
        }
      },

      costMethodDidChange: function () {
        var K = XM.ItemSite,
          costMethod = this.get("costMethod");
        if (costMethod === K.JOB_COST) {
          this.toggleInventorySettings(false);
          this.set({
            planningSystem: K.NO_PLANNING,
            isPlannedTransferOrders: false
          });
        } else {
          this.itemDidChange();
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
        // We should redo this with meta...
        if (!item || !site) {
          this.supplySites = [];
          that.trigger("supplySitesChange", this, this.supplySites, options);
          return;
        }

        options.query = {parameters: [
          {attribute: "item", value: item},
          {attribute: "site", operator: "!=", value: site}
        ]};
        itemSites.fetch(options);
      },

      initialize: function () {
        _initialize.apply(this, arguments);
        var K = XM.ItemSite;
        this.addCostMethod([K.NO_COST, K.STANDARD_COST, K.AVERAGE_COST, K.JOB_COST]);
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

      isTrace: function () {
        var K = XM.ItemSite,
          controlMethod = this.get("controlMethod");
        return controlMethod === K.SERIAL_CONTROL ||
               controlMethod === K.LOT_CONTROL;
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
          readOnlyPlanSystem = true,
          isInventory = !_.contains(nonStockTypes, itemType);

        // Settings dependent on whether inventory item or not
        this.toggleInventorySettings(isInventory);
        this.setReadOnly("controlMethod", !isInventory);

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

        // Handle special non-stock item type cases
        if (!isInventory) {
          if (!itemType || itemType === I.REFERENCE) {
            this.setReadOnly("isSold", false)
                .set("controlMethod", K.NO_CONTROL);
          } else if (itemType === I.KIT) {
            this.setReadOnly("isSold", false)
                .set({controlMethod: K.NO_CONTROL, isSold: true});
          } else {
            this.setReadOnly("isSold")
                .set({isSold: false, controlMethod: K.REGULAR_CONTROL});
          }
        } else {
          this.set("controlMethod", K.REGULAR_CONTROL);
        }
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

      toggleInventorySettings: function (isInventory) {
        this.setReadOnly([
            "abcClass",
            "cycleCountFrequency",
            "isAutomaticAbcClassUpdates",
            "isLocationControl",
            "isStocked",
            "restrictedLocationsAllowed",
            "safetyStock",
            "useDefaultLocation"
          ], !isInventory);

        // If not inventory, force some settings
        if (!isInventory) {
          this.set({
            cycleCountFrequency: 0,
            isAutomaticAbcClassUpdates: false,
            isLocationControl: false,
            isStocked: false,
            safetyStock: 0,
            useDefaultLocation: false
          });
        }
        return this;
      },

      /**
        Add a cost method to the `costMethods` array. Triggers
        a `costMethodsChange` event.

        @param {String|Array} Cost Method or array of cost methods
        @param {Object} Options
        @returns Receiver
        @seealso removeCostMethod
      */
      removeCostMethod: function (costMethods, options) {
        var that = this,
          changed = false;

        if (typeof costMethods === "string") {
          costMethods = [costMethods];
        }

        _.each(costMethods, function (costMethod) {
          // Ignore if not in the array
          if (_.contains(that.costMethods, costMethod)) {

            // Make the change
            that.costMethods = _.without(that.costMethods, costMethod);
            changed = true;
          }
        });

        // Notify
        if (changed) {
          this.trigger("costMethodsChange", this, this.costMethods, options);
        }

        return this;
      },

      siteDidChange: function () {
        this.fetchSupplySites();
      },

      statusDidChange: function () {
        _statusDidChange.apply(this, arguments);
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.itemDidChange();
          this.controlMethodDidChange();
          this.costMethodDidChange();
          this.useDefaultLocationDidChange();
          this.useParametersDidChange();
          this.planningSystemDidChange();
          this.setReadOnly("supplySite", !this.get("isPlannedTransferOrders"));
        }
      },

      useDefaultLocationDidChange: function () {
        var useDefault = this.get("useDefaultLocation"),
          isLocationControl = this.get("isLocationControl"),
          isTrace = this.isTrace();

        this.setReadOnly([
          "receiveLocation",
          "isReceiveLocationAuto",
          "stockLocation",
          "isStockLocationAuto"
        ], !isLocationControl || isTrace || !useDefault);
        this.setReadOnly("userDefinedLocation", isLocationControl || !useDefault);
        this.setReadOnly("restrictedLocationsAllowed", !isLocationControl);
      },

      useParametersDidChange: function () {
        this.setReadOnly([
          "reorderLevel",
          "orderToQuantity",
          "minimumOrderQuantity",
          "multipleOrderQuantity",
          "maximumOrderQuantity",
          "useParametersManual"
        ], !this.get("useParameters"));
      },

      validate: function () {
        var ret = _validate.apply(this, arguments),
          K = XM.ItemSite,
          quantityOnHand = this.get("quantityOnHand"),
          costMethod = this.get("costMethod"),
          isStocked = this.get("isStocked"),
          reorderLevel = this.get("reorderLevel"),
          isActive = this.get("isActive"),
          itemIsActive = this.getValue("item.isActive"),
          error;
        if (ret) { return ret; }

        if (quantityOnHand < 0 && costMethod === K.AVERAGE_COST) {
          error = "xt2019";
        } else if (isStocked && reorderLevel <= 0) {
          error = "xt2020";
        } else if (isActive && !itemIsActive) {
          error = "xt2021";
        } else if (!isActive && quantityOnHand > 0) {
          error = "inv1002";
        }

        if (error) {
          return XT.Error.clone(error);
        }

      }
    };

    XM.ItemSite = XM.ItemSite.extend(ext);
    /**
      @class

      @extends XM.Model
    */
    XM.ItemSiteLocation = XM.Model.extend({

      recordType: "XM.ItemSiteLocation"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ItemSiteInventory = XM.Info.extend({

      recordType: "XM.ItemSiteInventory",

      editableModel: "XM.ItemSite"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSiteDetail = XM.Model.extend({

      recordType: "XM.ItemSiteDetail",

      /**
        Set distributed to zero.

      */
      clear: function () {
        this.set("distributed", 0);
        return this;
      },

      /**
        Select the balance available up to the quantity passed.

        @param {Number} Quantity
      */
      distribute: function (qty) {
        var qoh = this.get("quantity"),
          scale = XT.QTY_SCALE;

        // Calculate the change
        qty = XT.math.add(this.get("distributed"), qty, scale);

        // Can not distribute more than is available
        qty = qty > qoh ? qoh : qty;

        // Can not distribute negative
        qty = qty < 0 ? 0 : qty;

        this.set("distributed", qty);
        return this;
      },

      /**
        Overload: Ignore status issues in this implementation.
      */
      set: function () {
        return Backbone.RelationalModel.prototype.set.apply(this, arguments);
      }

    });

    // ..........................................................
    // CLASS CONSTANTS
    //

    /**
      Constants for item site inventory settings.
    */
    _.extend(XM.ItemSite, {

      // ..........................................................
      // CONSTANTS
      //

      /**
        No cost tracking.

        @static
        @constant
        @type String
        @default N
      */
      NO_COST: "N",

      /**
        No Planning.

        @static
        @constant
        @type String
        @default 'N'
      */
      NO_PLANNING: "N",

      /**
        Standard Cost.

        @static
        @constant
        @type String
        @default S
      */
      STANDARD_COST: "S",

      /**
        Serial Control

        @static
        @constant
        @type Number
        @default 'S'
      */
      SERIAL_CONTROL: "S",

      /**
        MPS Planning

        @static
        @constant
        @type Number
        @default 'S'
      */
      MPS_PLANNING: "S",

      /**
        Average Cost.

        @static
        @constant
        @type String
        @default 'A'
      */
      AVERAGE_COST: "A",

      /**
        Job Cost.

        @static
        @constant
        @type String
        @default J
      */
      JOB_COST: "J",

      /**
        Not controlled method

        @static
        @constant
        @type String
        @default 'N'
      */
      NO_CONTROL: "N",

      /**
        Regular control method

        @static
        @constant
        @type String
        @default 'R'
      */
      REGULAR_CONTROL: "R",

      /**
        Lot Control.

        @static
        @constant
        @type String
        @default L
      */
      LOT_CONTROL: "L",

      /**
        MRP Planning.

        @static
        @constant
        @type String
        @default 'M'
      */
      MRP_PLANNING: "M"

    });

  };


}());

