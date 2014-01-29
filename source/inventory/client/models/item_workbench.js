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
        if (this.meta) { return; }
        this.meta = new Backbone.Model({
          site: null,
          selected: null
        });
        this.setStatus(XM.Model.READY_CLEAN);
      },

      itemChanged: function () {
        var item = this.get("item");

        if (_.isObject(item)) {
          this.fetch({id: item.id});
        } else {
          this.clear();
        }
      },

      statusReadyClean: function () {
        var sites = this.get("availability"),
          defaultSite = XT.defaultSite() || {},
          avail = _.find(sites.models, function (site) {
            return site.id === defaultSite.id;
          }) || sites.first();

        this.setValue("selected", avail);
        this.setReadOnly("site", !sites.length);
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ItemWorkbenchAlias = XM.Model.extend({

      recordType: "XM.ItemWorkbenchAlias"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ItemWorkbenchAvailability = XM.Model.extend({

      recordType: "XM.ItemWorkbenchAvailability"

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

      @extends XM.Model
    */
    XM.ItemWorkbenchOrder = XM.Model.extend({

      recordType: "XM.ItemWorkbenchOrder"

    });

    XM.ItemWorkbenchOrder = XM.ItemWorkbenchOrder.extend(XM.OrderMixin);

  };


}());

