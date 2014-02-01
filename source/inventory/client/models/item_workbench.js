/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initItemWorkbenchModels = function () {

    /** @private 
     Sort orders by due date, then supply first, then order number
    */
    var _ordersComparator = function (a, b) {
      var aval = a.get("dueDate"),
        bval = b.get("dueDate"),
        res = XT.date.compareDate(aval, bval);

      if (!res) {
        aval = a.get("balance") > 0;
        bval = b.get("balance") > 0;
        if (aval & !bval) {
          return -1;
        } else if (bval && !aval) {
          return 1;
        } else {
          aval = a.get("number");
          bval = b.get("number");
          if (aval < bval) {
            return -1;
          } else if (aval > bval) {
            return 1;
          } else {
            return 0;
          }
        }
      }
      return res;
    };

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

      calculateRunningAvailability: function () {
        var options = this.getValue("options"),
          runningTotal = this.getValue("selected.onHand"),
          site = this.getValue("site"),
          orders = this.get("orders"),
          models;

        orders.comparator = _ordersComparator;
        orders.sort();
        models = orders.filter(function (model) {
          var showing = false,
            scale = XT.QTY_SCALE,
            balance;

          if (site === model.get("site").id) {
            balance = model.get("balance");
            runningTotal = XT.math.add(runningTotal, balance, scale);
            model.setValue("runningTotal", runningTotal);
            showing = true;
          }

          return showing;
        });

        this.getValue("runningAvailability").reset(models);
      },

      initialize: function (attributes, options) {
        var isNew = options && options.isNew;
        if (options) { delete options.isNew; } // Never create one of these
        XM.Model.prototype.initialize.call(this, attributes, options);
        if (isNew) { this.setStatus(XM.Model.READY_CLEAN); }
        if (this.meta) { return; }
        this.meta = new Backbone.Model({
          site: null,
          selected: null,
          runningAvailability: new Backbone.Collection()
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
        this.calculateRunningAvailability();
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
        this.calculateRunningAvailability();
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
        "onHand": 0,
        "orderMaxmimum": 0,
        "orderMinimum": 0,
        "orderMultiple": 0,
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

      recordType: "XM.ItemWorkbenchOrder",

      initialize: function () {
        XM.Info.prototype.initialize.apply(this, arguments);
        if (!this.meta) {
          this.meta = new Backbone.Model({
            runningTotal: 0
          });
        }
      },

      isActive: true // So due date gets formatted

    });

    XM.ItemWorkbenchOrder = XM.ItemWorkbenchOrder.extend(XM.OrderMixin);

  };


}());

