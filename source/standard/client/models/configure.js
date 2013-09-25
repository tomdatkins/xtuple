/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.standard.initModels = function () {

    var _proto = XM.Inventory.prototype,
      _statusDidChange = _proto.statusDidChange;

    _proto.readOnlyAttributes = _proto.readOnlyAttributes.concat([
        'LotSerialControl',
        'MultiWhs'
      ]);

    var ext = {
      statusDidChange: function () {
        _statusDidChange.apply(this, arguments);
        var that = this,
          options = {
            success: function (used) {
              that.setReadOnly("LotSerialControl", used);
            }
          };

        // Enable multi Site option if only one site
        this.setReadOnly("MultiWhs", XM.siteRelations.length > 1);
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.dispatch("XM.Inventory", "usedTrace", null, options);
        }
      }
    };

    XM.Inventory = XM.Inventory.extend(ext);


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
