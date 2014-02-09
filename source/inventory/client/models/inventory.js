/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.inventory.initInventoryModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.InventoryAvailability = XM.Model.extend({

      recordType: "XM.InventoryAvailability"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.Distribution = XM.Model.extend({

      recordType: "XM.Distribution",

      parentKey: "itemSite",

      readOnlyAttributes: [
        "location",
        "trace",
        "expireDate",
        "warrantyDate",
        "characteristic"
      ],

      requiredAttributes: [
        "quantity"
      ],

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('change:' + this.parentKey, this.handleNew);
      },

      handleNew: function () {
        if (!this.getParent()) {
          return;
        }
        var parent = this.getParent(),
          undistributed = parent.undistributed(),
          location = parent.getValue("itemSite.locationControl"),
          warranty = parent.getValue("itemSite.warranty"),
          perishable = parent.getValue("itemSite.perishable"),
          controlMethod = parent.getValue("itemSite.controlMethod"),
          isReceiveLocationAuto = parent.getValue("itemSite.receiveLocationAuto"),
          receiveLocation,
          K = XM.ItemSite,
          trace = controlMethod === K.LOT_CONTROL || controlMethod === K.SERIAL_CONTROL;

        if (trace) {
          this.requiredAttributes.push("trace");
          this.setReadOnly("trace", false);
        }
        if (location) {
          this.requiredAttributes.push("location");
          if (isReceiveLocationAuto) {
            receiveLocation = parent.getValue("itemSite.receiveLocation");
            this.set("location", receiveLocation);
          } else {
            this.setReadOnly("location", false);
          }
        }
        if (perishable) {
          this.requiredAttributes.push("expireDate");
          this.setReadOnly("expireDate", false);
        }
        if (warranty) {
          this.requiredAttributes.push("warrantyDate");
          this.setReadOnly("warrantyDate", false);
        }
        this.set("quantity", undistributed);
        return this;
      }

    });

    /**
      @class

      @extends XM.Transaction
    */
    XM.EnterReceipt = XM.Transaction.extend({

      recordType: "XM.EnterReceipt",

      quantityAttribute: "toReceive",

      issueMethod: "transactItem",

      transactionDate: null,

      readOnlyAttributes: [
        "atReceiving",
        "received",
        "itemSite",
        "order",
        "ordered",
        "returned",
        "received",
        "scheduleDate",
        "undistributed",
        "site",
        "unitCost",
        "extCost",
        "notes",
        "balance"
      ],

      canReceiveItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("EnterReceipts");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      },

      /**
        Receipts can't be returned (yet).
      */
      canReturnItem: function (callback) {
        if (callback) {
          callback(false);
        }
        return this;
      },

      extCost: function () {
        var unitCost = this.get("unitCost"),
          toReceive = this.get("toReceive"),
          extCost = (unitCost * toReceive);
        return XT.toExtendedPrice(extCost);
      },

      formatDetail: function () {
        return _.map(this.get("detail").models, function (detail) {
          var obj = { quantity: detail.get("quantity") };

          if (obj.quantity) {
            obj.loc = detail.getValue("location.uuid") || undefined;
            obj.trace = detail.getValue("trace.number") || undefined;
            obj.expiration = detail.getValue("expireDate") || undefined;
            obj.warranty = detail.getValue("warrantyDate") || undefined;
          }
          return obj;
        });
      },

      name: function () {
        return this.get("order") + " #" + this.get("lineNumber");
      },

      /**
        Return the quantity of items that require detail distribution.

        @returns {Number}
      */
      undistributed: function () {
        var toReceive = this.get(this.quantityAttribute),
          scale = XT.QTY_SCALE,
          undist = 0,
          dist;
        // We only care about distribution on controlled items
        if (this.requiresDetail() && toReceive) {
          // Get the distributed values
          dist = _.compact(_.pluck(_.pluck(this.getValue("detail").models, "attributes"), "quantity"));
          if (XT.math.add(dist, scale) > 0) {
            undist = XT.math.add(dist, scale);
          }
          undist = XT.math.subtract(toReceive, undist, scale);
        }
        this.set("undistributed", undist);
        return undist;
      },

      /**
        Unlike most validations on models, this one accepts a callback
        into which will be forwarded a boolean response. Errors will
        trigger `invalid`.

        @param {Function} Callback
        @returns {Object} Receiver
        */
      validate: function (callback) {
        var toReceive = this.get("toReceive"),
          ordered = this.get("ordered"),
          err;

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toReceive <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (toReceive !== ordered) {
          this.notify("_receiveQtyVar".loc(), {
            type: XM.Model.QUESTION,
            callback: function (resp) {
              callback(resp.answer);
            }
          });
          return this;
        }

        if (err) {
          this.trigger("invalid", this, err, {});
          callback(false);
        } else {
          callback(true);
        }

        return this;
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.InventoryHistory = XM.Model.extend({

      recordType: "XM.InventoryHistory"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.InventoryDetail = XM.Model.extend({

      recordType: "XM.InventoryDetail"

    });

    /**
      @class

      @extends XM.Transaction
    */
    XM.IssueToShipping = XM.Transaction.extend({

      recordType: "XM.IssueToShipping",

      quantityAttribute: "toIssue",

      quantityTransactedAttribute: "atShipping",

      issueMethod: "issueItem",

      readOnlyAttributes: [
        "atShipping",
        "balance",
        "item",
        "order",
        "ordered",
        "returned",
        "site",
        "shipment",
        "shipped",
        "unit.name"
      ],

      transactionDate: null,

      name: function () {
        return this.get("order") + " #" + this.get("lineNumber");
      },

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);

        // Bind events
        this.on("statusChange", this.statusDidChange);
        this.on("change:toIssue", this.toIssueDidChange);
      },

      canIssueItem: function (callback) {
        var isShipped = this.getValue("shipment.isShipped") || false,
          hasPrivilege = XT.session.privileges.get("IssueStockToShipping");
        if (callback) {
          callback(!isShipped && hasPrivilege);
        }
        return this;
      },

      canReturnItem: function (callback) {
        var isShipped = this.getValue("shipment.isShipped") || false,
          hasPrivilege = XT.session.privileges.get("ReturnStockFromShipping"),
          atShipping = this.get("atShipping");
        if (callback) {
          callback(!isShipped && atShipping > 0 && hasPrivilege);
        }
        return this;
      },

      /**
        Calculate the balance remaining to issue.

        @returns {Number}
      */
      issueBalance: function () {
        var balance = this.get("balance"),
          atShipping = this.get("atShipping"),
          toIssue = XT.math.subtract(balance, atShipping, XT.QTY_SCALE);
        return toIssue >= 0 ? toIssue : 0;
      },

      /**
        Unlike most validations on models, this one accepts a callback
        into which will be forwarded a boolean response. Errors will
        trigger `invalid`.

        @param {Function} Callback
        @returns {Object} Receiver
        */
      validate: function (callback) {
        var toIssue = this.get("toIssue"),
          err;

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toIssue <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (toIssue > this.issueBalance()) {
          this.notify("_issueExcess".loc(), {
            type: XM.Model.QUESTION,
            callback: function (resp) {
              callback(resp.answer);
            }
          });
          return this;
        }

        if (err) {
          this.trigger("invalid", this, err, {});
          callback(false);
        } else {
          callback(true);
        }

        return this;
      },

      statusDidChange: function () {
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.set("toIssue", this.issueBalance());
        }
      },

      toIssueDidChange: function () {
        this.distributeToDefault();
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.Receipt = XM.Model.extend({

      recordType: "XM.Receipt"

    });

    /**
      Static function to call an inventory transaction function on one or multiple items.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Inventory.transactItem = function (params, options, functionName) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", functionName, params, options);
    };

    /**
      Static function to call return from shipping on a set of multiple items.

      @params {Array} Array of model ids
      @params {Object} Options
    */
    XM.Inventory.returnItem = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", "returnFromShipping", params, options);
    };

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.InventoryAvailabilityCollection = XM.Collection.extend({

      model: XM.InventoryAvailability,

      dispatch: true

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.InventoryHistoryCollection = XM.Collection.extend({

      model: XM.InventoryHistory

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.IssueToShippingCollection = XM.Collection.extend({

      model: XM.IssueToShipping

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.EnterReceiptCollection = XM.Collection.extend({

      model: XM.EnterReceipt

    });

  };

}());
