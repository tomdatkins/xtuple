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

      readOnlyAttributes: [
        "itemType",
        "inventoryUnit"
      ],

      handlers: {
        "change:item": "itemChanged"
      },

      itemChanged: function () {
        var item = this.get("item");

        if (_.isObject(item)) {
          this.fetch({id: item.id});
        } else {
          this.clear();
        }
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

