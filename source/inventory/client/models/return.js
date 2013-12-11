/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initReturnModels = function () {

    XM.ReturnLine.prototype.augment({
      handlers: {
        'change:item': 'setUpdateInventoryReadOnly',
        'change:site': 'setUpdateInventoryReadOnly'
      },

      initialize: function () {
        this.setReadOnly("updateInventory", true);
      },

      setUpdateInventoryReadOnly: function () {
        if (this.getParent().get("isPosted") || !this.get("item") || !this.get("site")) {
          this.setReadOnly("updateInventory", true);
          return;
        }

        var that = this,
          itemSiteColl = new XM.ItemSiteCollection(),
          success = function () {
            var isJobCost = itemSiteColl.length > 0 && itemSiteColl.models[0].get("costMethod") ===
              XM.ItemSite.JOB_COST;

            that.setReadOnly("updateInventory", isJobCost);
          },
          options = {
            query: {
              parameters: [{
                attribute: "item",
                value: this.get("item").id
              }, {
                attribute: "site",
                value: this.get("site").id
              }]
            },
            success: success
          };

        itemSiteColl.fetch(options);
      }
    });
  };

}());

