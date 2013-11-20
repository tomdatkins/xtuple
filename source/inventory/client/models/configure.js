/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.Inventory = XM.Settings.extend(/** @lends XM.Inventory.Settings.prototype */ {

      recordType: 'XM.Inventory',

      privileges: 'ConfigureIM',

      readOnlyAttributes: [
        "AllowAvgCostMethod",
        "AllowStdCostMethod",
        "AllowJobCostMethod",
        'LotSerialControl',
        'MultiWhs'
      ],

      bindEvents: function () {
        XM.Settings.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
      },

      statusDidChange: function () {
        var that = this,
          options = {
            success: function (used) {
              that.setReadOnly("AllowAvgCostMethod", used.average);
              that.setReadOnly("AllowStdCostMethod", used.standard);
              that.setReadOnly("AllowJobCostMethod", used.job);
              that.setReadOnly("LotSerialControl", used);
            }
          };
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.dispatch("XM.Inventory", "usedCostMethods", null, options);
        }
        // Enable multi Site option if only one site
        this.setReadOnly("MultiWhs", XM.siteRelations.length > 1);
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.dispatch("XM.Inventory", "usedTrace", null, options);
        }
      },

      validate: function () {
        var error = XM.Settings.prototype.validate.apply(this, arguments);
        if (error) { return error; }

        if (!this.get("AllowAvgCostMethod") &&
            !this.get("AllowStdCostMethod") &&
            !this.get("AllowJobCostMethod")) {
          // TO DO: Throw must have at least one cost method error
        }
      }

    });

    XM.inventory = new XM.Inventory();

    // SALES

    // no guarantees that the sales extension is loaded
    if (XM.Sales) {
      var oldFunc = XM.Sales.prototype.statusDidChange;

      XM.Sales.prototype.statusDidChange = function () {
        oldFunc.apply(this, arguments);
        if (XM.siteRelations.length > 1 && this.get("MultiWhs")) {
          this.setReadOnly("MultiWhs", true);
        }
      };
    }

  };

}());
