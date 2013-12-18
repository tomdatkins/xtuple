/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initReturnModels = function () {

    //
    // RETURN
    //

    // TODO: how to augment the mixin when I want to get this into invoice as well?
    // perhaps we don't augment the mixin, but augment both models with the same hash
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

      handlers: {
        'change:freight': 'calculateTotalTax',
        'change:shipto': 'shiptoDidChange',
        'change:shiptoName': 'shiptoAddressDidChange',
        'change:shiptoAddress1': 'shiptoAddressDidChange',
        'change:shiptoAddress2': 'shiptoAddressDidChange',
        'change:shiptoAddress3': 'shiptoAddressDidChange',
        'change:shiptoCity': 'shiptoAddressDidChange',
        'change:shiptoState': 'shiptoAddressDidChange',
        'change:shiptoPostalCode': 'shiptoAddressDidChange',
        'change:shiptoCountry': 'shiptoAddressDidChange'
      },

      defaults: function () {
        return {freight: 0};
      },

      applyCustomerSettings: function () {
        var customer = this.get("customer"),
          isFreeFormShipto = customer ? customer.get("isFreeFormShipto") : false;

        // Set read only state for free form shipto
        this.setReadOnly(this.shiptoAttrArray, !isFreeFormShipto);
      },

      applyIsPostedRules: function () {
        this.setReadOnly(["freight", "shipZone"], this.get("isPosted"));
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
        }, {silent: true});
        // we don't want an avanlance of triggers here, but we do want to update the view
        this.trigger("change", this);
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
      },

      /**
        Populate shipto defaults. Similar to the one on sales order
      */
      shiptoDidChange: function () {
        var shipto = this.get("shipto"),
          shiptoAddress = shipto ? shipto.get("address") : false,
          shiptoAttrs;

        if (!shipto) {
          this.unset("shiptoName")
            .unset("shiptoAddress1")
            .unset("shiptoAddress2")
            .unset("shiptoAddress3")
            .unset("shiptoCity")
            .unset("shiptoState")
            .unset("shiptoPostalCode")
            .unset("shiptoCountry");

          return;
        }

        shiptoAttrs = {
          shiptoName: shipto.get("name"),
          salesRep: shipto.get("salesRep"),
          commission: shipto.get("commission"),
          taxZone: shipto.get("taxZone"),
          shipZone: shipto.get("shipZone")
        };
        if (shiptoAddress) {
          _.extend(shiptoAttrs, {
            shiptoAddress1: shiptoAddress.getValue("line1"),
            shiptoAddress2: shiptoAddress.getValue("line2"),
            shiptoAddress3: shiptoAddress.getValue("line3"),
            shiptoCity: shiptoAddress.getValue("city"),
            shiptoState: shiptoAddress.getValue("state"),
            shiptoPostalCode: shiptoAddress.getValue("postalCode"),
            shiptoCountry: shiptoAddress.getValue("country")
          });
        }
        this.set(shiptoAttrs, {silent: true});
        // we don't want an avanlance of triggers here, but we do want to update the view
        this.trigger("change", this);
      },

      shiptoAddressDidChange: function () {
        // If the address was manually changed, then clear shipto
        this.unset("shipto", {silent: true});
        // we don't want an avanlance of triggers here, but we do want to update the view
        this.trigger("change", this);
      }

    });


    //
    // RETURN LINE
    //

    XM.ReturnLine.prototype.augment({
      handlers: {
        'change:item': 'setUpdateInventoryReadOnly',
        'change:site': 'setUpdateInventoryReadOnly'
      },

      initialize: function () {
        this.setReadOnly("updateInventory", true);
      },

      setUpdateInventoryReadOnly: function () {
        if (!this.getParent()) {
          return;
        }
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

    //
    // RETURN LIST ITEM
    //

    var oldPost = XM.ReturnListItem.prototype.doPost;
    // TODO: make XM.Transaction a mixin, and then augment it in to XM.ReturnListItem
    var requiresDetail = XM.Transaction.prototype.requiresDetail;
    XM.ReturnListItem.prototype.doPost = function () {
      var reqDetail = requiresDetail.apply(this);
      console.log("Do Post override", reqDetail);

      oldPost.apply(this, arguments);
    };


  };

}());

