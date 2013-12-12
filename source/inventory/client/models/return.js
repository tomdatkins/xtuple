/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initReturnModels = function () {

    // TODO: how to augment the mixin when I want to get this into invoice as well?
    XM.Return.prototype.augment({

      // like sales order, minus shipto phone
      shiptoAttrArray: [
        "shiptoName",
        "shiptoAddress1",
        "shiptoAddress2",
        "shiptoAddress3",
        "shiptoCity",
        "shiptoState",
        "shiptoPostalCode",
        "shiptoCountry",
      ],

      defaults: function () {
        return {freight: 0};
      },

      applyCustomerSettings: function () {
        var customer = this.get("customer"),
          isFreeFormShipto = customer ? customer.get("isFreeFormShipto") : false;

        // Set read only state for free form shipto
        this.setReadOnly(this.shiptoAttrArray, !isFreeFormShipto);
      },

      copyBilltoToShipto: function () {
        this.set({
          shipto: null,
          shiptoName: this.get("billtoName"),
          shiptoAddress1: this.get("billtoAddress1"),
          shiptoAddress2: this.get("billtoAddress2"),
          shiptoAddress3: this.get("billtoAddress3"),
          shiptoCity: this.get("billtoCity"),
          shiptoState: this.get("billtoState"),
          shiptoZip: this.get("billtoZip"),
          shiptoPostalCode: this.get("billtoPostalCode"),
          shiptoCountry: this.get("billtoCountry"),
          taxZone: this.get("customer") && this.getValue("customer.taxZone")
        });
      },

      customerDidChange: function () {
        var customer = this.get("customer"),
          defaultShipto;

        if (!customer) {
          return;
        }

        defaultShipto = customer.getDefaultShipto();
        if (defaultShipto) {
          this.set("shipto", defaultShipto.attributes);
        }

      }
    });

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

