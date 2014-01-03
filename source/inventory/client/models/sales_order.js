/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XM.SalesOrder.prototype.augment({

    canIssueItem: function (callback) {
      var hasPrivilege = XT.session.privileges.get("IssueStockToShipping");
      if (callback) {
        callback(XM.SalesOrderBase.OPEN_STATUS && hasPrivilege);
      }
      return this;
    },

    doExpressCheckout: function () {
      this.notify("Not written yet.");
    },

    doIssueToShipping: function () {
      var that = this,
        uuid = this.get("uuid"),
        panel,
        prompt,
        message = "_save?".loc(),
        notifyOptions = {},
        options = {},
        goToIssueToShipping = function (response) {
          // Model was READY_CLEAN, no need to save, just navigate there.
          if (response === false) {
            panel = XT.app.$.postbooks.createComponent({kind: "XV.IssueToShipping", model: uuid});
            panel.render();
            XT.app.$.postbooks.setIndex(XT.app.$.postbooks.getPanels().length - 1);
          }
          if (response.answer) {
            that.save();
            if (that.getStatus() === XM.Model.READY_DIRTY) {
              return;
            } else {
              panel = XT.app.$.postbooks.createComponent({kind: "XV.IssueToShipping", model: uuid});
              panel.render();
              XT.app.$.postbooks.setIndex(XT.app.$.postbooks.getPanels().length - 1);
            }
          }
          if (response.answer === false) {
            options = {
              success: function () {
                that.fetch();
              },
              error: function () {
                XT.log("Error releasing lock.");
                // fetch anyway. Why not!?
                that.fetch();
              }
            };
            // first we want to release the lock we have on this record
            that.releaseLock(options);
            panel = XT.app.$.postbooks.createComponent({kind: "XV.IssueToShipping", model: uuid});
            panel.render();
            XT.app.$.postbooks.setIndex(XT.app.$.postbooks.getPanels().length - 1);
          } else {
            return;
          }
        };
      notifyOptions.type = XM.Model.YES_NO_CANCEL;
      notifyOptions.yesLabel = "_save".loc();
      notifyOptions.callback = goToIssueToShipping;
      
      if (that.isDirty()) {
        that.notify(message, notifyOptions);
      } else {
        goToIssueToShipping(false);
      }
    }

  });

  XM.SalesOrderListItem.prototype.augment({

    canIssueItem: function (callback) {
      var hasPrivilege = XT.session.privileges.get("IssueStockToShipping");
      if (callback) {
        callback(XM.SalesOrderBase.OPEN_STATUS && hasPrivilege);
      }
      return this;
    },

    doIssueToShipping: function (inSender, inEvent) {
      var panel,
        uuid = this.get("uuid");
      panel = XT.app.$.postbooks.createComponent({kind: "XV.IssueToShipping", model: uuid});
      panel.render();
      XT.app.$.postbooks.setIndex(XT.app.$.postbooks.getPanels().length - 1);
    }
  });

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
