/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  /**
    @class
    An abstract model used as a base for transactions.

    @extends XM.Model
  */
  XM.TransactionMixin = {

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
