/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSalesOrderModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderLineListItem = XM.Model.extend({

      recordType: 'XM.SalesOrderLineListItem'

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.SalesOrderLineListItemCollection = XM.Collection.extend({

      model: XM.SalesOrderLineListItem

    });


    XM.SalesOrder.prototype.augment({
      handlers: {
        'change:packDate': 'packDateDidChange'
      },

      holdTypeDidChange: function () {
        this.updateWorkflowItemPackDate();
      },

      packDateDidChange: function () {
        this.updateWorkflowItemPackDate();
      },

      saleTypeDidChange: function () {
        this.updateWorkflowItemPackDate();
        this.updateWorkflowItemShipDate();
      },

      updateWorkflowItemPackDate: function () {
        var that = this;

        _.each(this.get("workflow").where(
            {workflowType: XM.SalesOrderWorkflow.TYPE_PACK}),
            function (workflow) {
          workflow.set({dueDate: that.get("packDate")});
        });
      },

      updateWorkflowItemShipDate: function () {
        var that = this;

        _.each(this.get("workflow").where(
            {workflowType: XM.SalesOrderWorkflow.TYPE_SHIP}),
            function (workflow) {
          workflow.set({dueDate: that.get("scheduleDate")});
        });
      }
    });

    _.extend(XM.SalesOrderWorkflow, /** @lends XM.SalesOrderLine# */{

      TYPE_PACK: "P",

      TYPE_SHIP: "S"

    });
  };

}());
