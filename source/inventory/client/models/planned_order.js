/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initPlannedOrderModels = function () {

    XM.PlannedOrderMixin = {

      formatNumber: function () {
        return this.get("number") + "-" + this.get("subNumber");
      },

      formatPlannedOrderType: function () {
        var type = this.get("plannedOrderType"),
          K = XM.PlannedOrder;

        switch (type)
        {
        case K.PURCHASE_ORDER:
          return "_purchaseOrder".loc();
        case K.TRANSFER_ORDER:
          return "_transferOrder".loc();
        default:
          return "";
        }
      }

    };

    XM.PlannedOrder = XM.Document.extend({

      recordType: "XM.PlannedOrder",

      readOnlyAttributes: [
        "formatNumber",
        "startDate",
        "supplySite"
      ],

      handlers: {
        "change:plannedOrderType": "plannedOrderTypeChanged",
        "status:READY_CLEAN": "statusReadyClean"
      },

      bindEvents: function () {
        XM.Document.prototype.bindEvents.apply(this, arguments);
        if (!this.meta) { this.meta = new Backbone.Model(); }

        this.setValue({
          plannedOrderTypes: new Backbone.Collection(),
          supplySites: new XM.SiteRelationCollection(),
          leadTime: 0,
          itemSite: null
        });

        this.meta.on("change:itemSite", this.itemSiteChanged, this)
                 .on("change:leadTime", this.leadTimeChanged, this);
      },

      calculateLeadTime: function () {
        var dueDate = this.get("dueDate"),
          startDate = this.get("startDate");

        this.meta.off("change:leadTime", this.leadTimeChanged, this);
        this.setValue("leadTime", XT.date.daysBetween(dueDate, startDate));
        this.meta.on("change:leadTime", this.leadTimeChanged, this);
      },

      fetchItemSite: function () {
        var item = this.get("item"),
          site = this.get("site"),
          itemSites = new XM.ItemSiteRelationCollection(),
          options = {},
          that = this,
          afterFetch = function () {
            if (itemSites.length) {
              that.setValue("itemSite", itemSites.first());
            }
          };

        if (item && site) {
          options.query = {
            parameters: [
              {attribute: "item", value: item},
              {attribute: "site", value: site}
            ]
          };
          options.success = afterFetch;
          itemSites.fetch(options);
        }
      },

      leadTimeChanged: function () {
        var leadTime = this.getValue("leadTime"),
          dueDate = this.get("dueDate"),
          startDate = new Date(dueDate);

        if (_.isDate(dueDate) && _.isNumber(leadTime)) {
          startDate.setDate(startDate.getDate() - leadTime);
          this.set("startDate", startDate);
        }
      },

      itemSiteChanged: function () {
        var itemSite = this.getValue("itemSite"),
          plannedOrderTypes = this.getValue("plannedOrderTypes"),
          supplySites = this.getValue("supplySites"),
          itemSites = new XM.ItemSiteRelationCollection(),
          options = {},
          that = this,
          K = XM.PlannedOrder,
          afterFetch = function () {
            itemSites.each(function (itemSite) {
              supplySites.add(itemSite.get("site"));
            });
          };

        plannedOrderTypes.reset();
        supplySites.reset();

        if (itemSite) {
          plannedOrderTypes.add({
            id: K.TRANSFER_ORDER,
            name: "_transferOrder".loc()
          });

          if (itemSite.get("isPurchased")) {
            plannedOrderTypes.add({
              id: K.PURCHASE_ORDER,
              name: "_purchaseOrder".loc()
            });
          }

          options.query = {
            parameters: [
              {attribute: "item", value: itemSite.get("item")},
              {attribute: "site", operator: "!=", value: itemSite.get("site")},
              {attribute: "isActive", value: true},
              {attribute: "site.isTransit", value: false}
            ]
          };
          options.success = afterFetch;
          itemSites.fetch(options);
        }
      },

      plannedOrderTypeChanged: function () {
        var plannedOrderType = this.get("plannedOrderType"),
          K = XM.PlannedOrder;

        if (plannedOrderType === K.TRANSFER_ORDER) {
          if (!_.contains(this.requiredAttributes, "supplySite")) {
            this.requiredAttributes.push("supplySite");
          }
        } else {
          this.requiredAttributes = _.without(this.requiredAttributes, "supplySite");
          this.unset("supplySite");
        }
        this.setReadOnly("supplySite", plannedOrderType !== K.TRANSFER_ORDER);
      },

      statusReadyClean: function () {
        this.fetchItemSite();
        this.plannedOrderTypeChanged();
        this.calculateLeadTime();
      }

    });

    XM.PlannedOrder.prototype.augment(XM.PlannedOrderMixin);

    _.extend(XM.PlannedOrder, {
      /** @scope XM.PlannedOrder */

      /**
        Purchase Order.

        @static
        @constant
        @type String
        @default P
      */
      PURCHASE_ORDER: "P",

      /**
        Transfer Order

        @static
        @constant
        @type String
        @default W
      */
      TRANSFER_ORDER: "T"

    });

    XM.PlannedOrderListItem = XM.Info.extend({

      recordType: "XM.PlannedOrderListItem",

      editableModel: "XM.PlannedOrder",

      canFirm: function (callback) {
        if (callback) { callback(!this.get("firm")); }
        return this;
      },

      canSoften: function (callback) {
        if (callback) { callback(this.get("firm")); }
        return this;
      }

    });

    XM.PlannedOrderListItem.prototype.augment(XM.PlannedOrderMixin);

    XM.PlannedOrderRelation = XM.Info.extend({
      
      recordType: "XM.PlannedOrderRelation",

      editableModel: "XM.PlannedOrder"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.PlannedOrderListItemCollection = XM.Collection.extend({

      model: XM.PlannedOrderListItem

    });

  };

}());

