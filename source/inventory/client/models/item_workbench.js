/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initItemWorkbenchModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.ItemWorkbench = XM.Model.extend({

      recordType: "XM.ItemWorkbench",

      handlers: {
        "change:item": "itemChanged",
        "status:READY_CLEAN": "statusReadyClean"
      },

      initialize: function (attributes, options) {
        if (options) { delete options.isNew; } // Never create one of these
        XM.Model.prototype.initialize.call(this, attributes, options);
        if (options) { this.setStatus(XM.Model.READY_CLEAN); }
        if (this.meta) { return; }
        this.meta = new Backbone.Model({
          site: null,
          selected: null
        });
        this.meta.on("change:site", this.siteChanged, this);
      },

      itemChanged: function () {
        var item = this.get("item");

        if (_.isObject(item)) {
          this.fetch({id: item.id});
        } else {
          this.clear();
          this.siteChanged();
          this.setStatus(XM.Model.READY_CLEAN);
        }
      },

      siteChanged: function () {
        var site = this.getValue("site"),
          itemSites = this.get("availability"),
          itemSite = _.find(itemSites.models, function (itemSite) {
            return itemSite.get("site") === site;
          }) || new XM.ItemWorkbenchAvailability();

        this.setValue("selected", itemSite);
      },

      statusReadyClean: function () {
        var itemSites = this.get("availability"),
          defaultSite = XT.defaultSite() || {},
          itemSite = _.find(itemSites.models, function (itemSite) {
            return itemSite.get("site") === defaultSite.id;
          }) || itemSites.first(),
          site;

        if (itemSite) {
          site = _.find(XM.siteRelations.models, function (site) {
            return site.id === itemSite.get("site");
          });
        }

        this.setValue({
          selected: itemSite || new XM.ItemWorkbenchAvailability(),
          site: site ? site.id : undefined
        });
        this.setReadOnly("site", !itemSites.length);
      }

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ItemWorkbenchAlias = XM.Info.extend({

      recordType: "XM.ItemWorkbenchAlias"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ItemWorkbenchAvailability = XM.Info.extend({

      recordType: "XM.ItemWorkbenchAvailability",

      defaults: {
        "reorderLevel": 0,
        "orderMultiple": 0,
        "onHand": 0,
        "orderTo": 0
      }

    });

    XM.ItemWorkbenchAvailability = XM.ItemWorkbenchAvailability.extend(XM.OrderMixin);

    /**
      @class

      @extends XM.Comment
    */
    XM.ItemWorkbenchComment = XM.Comment.extend({

      recordType: "XM.ItemWorkbenchComment"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ItemWorkbenchOrder = XM.Info.extend({

      recordType: "XM.ItemWorkbenchOrder"

    });

    XM.ItemWorkbenchOrder = XM.ItemWorkbenchOrder.extend(XM.OrderMixin);

  };


}());

