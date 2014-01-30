/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initItemSiteModels = function () {

    var _proto = XM.ItemSite.prototype,
      _defaults = _proto.defaults;

    // Unfortunately augment won't work here
    _proto.defaults = function () {
      var defaults = _defaults.apply(this, arguments);
      defaults.isManufactured = false;
      defaults.isCreatePurchaseRequestsForWorkOrders = false;
      return defaults;
    };

    _proto.augment({
      readOnlyAttributes: [
        "isCreatePurchaseRequestsForWorkOrders",
        "isCreateWorkOrdersForSalesOrders"
      ],

      handlers: {
        "change:isManufactured": "isManufacturedChanged"
      },

      costMethodDidChange: function (model, changes, options) {
        options = options ? _.clone(options) : {};
        var K = XM.ItemSite,
          I = XM.Item,
          costMethod = this.get("costMethod"),
          itemType = this.getValue("item.itemType");

        if (costMethod === K.JOB_COST) {
          this.toggleInventorySettings(false, options);
          if (!options.isLoading) {
            this.set({
              planningSystem: K.NO_PLANNING,
              isPlannedTransferOrders: false
            });
          }

          switch (itemType)
          {
          case I.MANUFACTURED:
            if (!options.isLoading) {
              this.set({
                isManufactured: true,
                createWorkOrdersForSalesOrders: true
              });
            }
            this.setReadOnly([
              "createWorkOrdersForSalesOrders"
            ]);
            break;
          case I.PURCHASED:
          case I.OUTSIDE_PROCESS:
            if (!options.isLoading) {
              this.set({
                isManufactured: false,
                createWorkOrdersForSalesOrders: false
              });
            }
            break;
          }
          this.setReadOnly("isManufactured");
        }
      },

      isManufacturedChanged: function (model, changes, options) {
        options = options ? _.clone(options) : {};
        var isManufactured = this.get("isManufactured"),
          itemType = this.getValue("item.itemType"),
          K = XM.Item;

        if (isManufactured && itemType === K.MANUFACTURED) {
          this.setReadOnly("isCreateWorkOrdersForSalesOrders", false);
        } else {
          if (!options.isLoading) {
            this.set("isCreateWorkOrdersForSalesOrders", false);
          }
          this.setReadOnly("isCreateWorkOrdersForSalesOrders");
        }
      },

      statusReadyClean: function () {
        this.isManufacturedChanged(this, null, {isLoading: true});
      }
    });

    /**
      @class

      @extends XM.WorkflowSource
    */
    XM.PlannerCodeWorkOrderWorkflow = XM.WorkflowSource.extend(
      /** @lends XM.PlannerCodeWorkOrderWorkflow.prototype */{

      recordType: "XM.PlannerCodeWorkOrderWorkflow"

    });

  };

}());
