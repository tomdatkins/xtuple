/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone */

(function () {
  "use strict";

  /**
    @class
    An abstract model used as a base for transactions.

    @extends XM.Model
  */
  XM.TransactionMixin = {

    formatStatus: function () {
      var status = this.get('status'),
        scanned = this.getValue("itemScan") || this.getValue("traceScan") || this.getValue("locationScan"),
        qoh = this.getValue("itemSite.quantityOnHand"),
        balance = this.getValue("balance"),
        available = XT.math.subtract(balance, qoh, XT.QTY_SCALE);

      if (scanned) {
        this.meta.get("metaStatus").code = "P";
        this.meta.get("metaStatus").description = "_pickFrom".loc();
        this.meta.get("metaStatus").order = 1;
        this.meta.get("metaStatus").color = "#7ebe7e";
        return "P";
      } else if (available > 0) {
        this.meta.get("metaStatus").code = "I";
        this.meta.get("metaStatus").description = "_inStock".loc();
        this.meta.get("metaStatus").order = 2;
        this.meta.get("metaStatus").color = "#edd89e";
        return "I";
      } else if (available < 0) {
        this.meta.get("metaStatus").code = "O";
        this.meta.get("metaStatus").description = "_outOfStock".loc();
        this.meta.get("metaStatus").order = 3;
        this.meta.get("metaStatus").color = "#ed9e9e";
        return "O";
      } else if (balance <= 0) {
        this.meta.get("metaStatus").code = "F";
        this.meta.get("metaStatus").description = "_fulfilled".loc();
        this.meta.get("metaStatus").order = 4;
        this.meta.get("metaStatus").color = "#7579a4";
        return "F";
      }
    },

    /**
      Attempt to distribute any undistributed inventory to default location.

      @returns {Object} Receiver
    */
    distributeToDefault: function () {
      var itemSite = this.getValue("itemSite"),
        autoIssue = itemSite.get("stockLocationAuto"),
        stockLoc,
        toIssue,
        undistributed,
        detail;

      if (!autoIssue) { return this; }

      stockLoc = itemSite.get("stockLocation");
      toIssue = this.get("toIssue");
      undistributed = this.undistributed();
      detail = _.find(itemSite.get("detail").models, function (model) {
        return  model.get("location").id === stockLoc.id;
      });

      if (detail) { // Might not be any inventory there now
        detail.distribute(undistributed);
      }

      return this;
    },

    validateScanAttrs: function () {
      // Check if all requiredScanAttrs are complete
      var that = this, 
        reqScansRemain = _.find(that.requiredScanAttrs, function (req) {
          return !that.getValue(req);
        });

      return !reqScansRemain;
    },

    resetScanAttrs: function () {
      var K = XM.ItemSite,
        isLocationControl = this.getValue("itemSite.locationControl"),
        isLotSerialControl = (this.getValue("itemSite.controlMethod") === 
          K.SERIAL_CONTROL) || (this.getValue("itemSite.controlMethod") === K.LOT_CONTROL);

      this.requiredScanAttrs = [];
      this.requiredScanAttrs.push("itemScan");
      if (isLotSerialControl) {
        this.requiredScanAttrs.push("traceScan");
        _.each(this.getValue("itemSite.detail").models, function (det) {
          det.setValue("distributed", 0);
        });
      }
      if (isLocationControl) {
        this.requiredScanAttrs.push("locationScan"); }
        _.each(this.getValue("itemSite.detail").models, function (det) {
          det.setValue("distributed", 0);
        });

        this.setValue("itemScan", null);
        this.setValue("traceScan", null);
        this.setValue("locationScan", null);
      },

      handleDetailScan: function () {
        var that = this;
        _.each(that.getValue("itemSite.detail").models, function (det) {
          if (det.getValue("location.name") === that.getValue("locationScan") || 
            det.getValue("trace.number") === that.getValue("traceScan")) {
            det.setValue("distributed", 1);
          } else {
            det.setValue("distributed", 0);
          }
        });
      },

      initialize: function (attributes, options) {
        var that = this,
          K = XM.ItemSite,
          itemSiteId = this.getValue("itemSite.id"),
          dispOptions = {};

        XM.Model.prototype.initialize.apply(this, arguments);
        if (this.meta) { return; }
        
        this.meta = new Backbone.Model({
          /** 
            Nested objects makes sense here but meta functionality is lacking in list 
            attributes, list testing and elsewhere.

          fifoAttrs: {
            lotSerial: null,
            location: null,
            quantity: null
          },
          scanAttrs: {
            item: {
              val: null,
              scanned: false
            },
            lotSerial: {
              val: null,
              scanned: false
            },
            location: {
              val: null,
              scanned: false
            }
          }*/
          fifoLocation: null,
          fifoTrace: null,
          fifoQuantity: null,
          itemScan: null,
          traceScan: null,
          locationScan: null,
          metaStatus: {
            code: null,
            description: null,
            order: null,
            color: null
          }
        });

        this.formatStatus();

        // If this item requires distribution send dispatch to set FIFO lot/serial
        if (this.requiresDetail()) {
          this.meta.on("change:traceScan", this.handleDetailScan, this);
          this.meta.on("change:locationScan", this.handleDetailScan, this);
          dispOptions.success = function (resp) {
            if (resp) {
              var detailModels = that.getValue("itemSite.detail").models,
                fifoDetail = _.find(detailModels, function (detModel) {
                  return detModel.id === resp;
                }) || null;
              // Set the fifo attributes
              that.meta.set("fifoLocation", fifoDetail.getValue("location") || null);
              that.meta.set("fifoTrace", fifoDetail.getValue("trace.number") || null);
              that.meta.set("fifoQuantity", fifoDetail.getValue("quantity") || null);
            }
          };
          dispOptions.error = function (resp) {
            that.doNotify({message: "Error gather FIFO info."});
          };
          this.dispatch("XM.Inventory", "getOldestLocationId", itemSiteId, dispOptions);
        }
      },

    /**
      Formats distribution detail to an object that can be processed by
      dispatch function called in `save`.

      This version deals with trace detail in addition to location.

      @returns {Object}
        in format [{location: "1762c336-b323-4ed0-8352-03e5c1f14d2a", quantity: 50}]
    */

    // #refactor: cleaner implementation of this in subclass XM.EnterReceipt
    formatDetail: function () {
      var ret = [],
        itemSite = this.get("itemSite"),
        details = itemSite.get("detail").models;

      _.each(details, function (detail) {
        var qty = detail.get("distributed"),
         obj = { quantity: qty },
         loc,
         trace,
         expiration,
         purchaseWarranty;
        if (qty) {
          loc = detail.get("location");
          trace = detail.get("trace");
          expiration = detail.get("expiration");
          purchaseWarranty = detail.get("purchaseWarranty");
          if (loc) { obj.location = loc.id; }
          if (trace) { obj.trace = trace.get("number"); }
          if (expiration) { obj.expiration = expiration; }
          if (purchaseWarranty) { obj.purchaseWarranty = purchaseWarranty; }
          ret.push(obj);
        }
      });

      return ret;
    },

    /**
      Returns whether detail distribution is required for the item site
      being transacted.

      @returns {Boolean}
    */
    requiresDetail: function () {
      // Do the normal check, plus check for trace control
      var isLocControl = this.getValue("itemSite.locationControl"),
        controlMethod = this.getValue("itemSite.controlMethod"),
        K = XM.ItemSite;
      return isLocControl ||
        controlMethod === K.LOT_CONTROL ||
        controlMethod === K.SERIAL_CONTROL;
    },

    /**
      Return the quantity of items that require detail distribution.

      @returns {Number}
    */
    undistributed: function () {
      var toIssue = this.getValue(this.quantityAttribute),
        scale = XT.QTY_SCALE,
        undist = 0,
        dist;
      // We only care about distribution on controlled items
      if (this.requiresDetail() && toIssue) {
        // Get the distributed values
        dist = _.pluck(_.pluck(this.getValue("itemSite.detail").models, "attributes"), "distributed");
        // Filter on only ones that actually have a value
        if (dist.length) {
          undist = XT.math.add(dist, scale);
        }
        undist = XT.math.subtract(toIssue, undist, scale);
      }
      return undist;
    },

    /**
      Returns Default Inventory Location
      Currently used in Relocate Inventory list relations where the itemSite
      is the parent workspace so may need refactoring for alternate models
      @returns {uuid}
    */
    defaultStockLocation: function () {
      var stockLocation = this.getValue("itemSite.stockLocation").id;

      return stockLocation || null;
    }

  };

}());
