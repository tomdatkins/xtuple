/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true, async:true */

(function () {
  "use strict";

  XT.extensions.inventory.initInvoiceModels = function () {

    XM.Invoice.prototype.augment({

      extraSubtotalFields: ["freight"],

      handlers: {
        "change:freight": "calculateTotals"
      },

      defaults: function () {
        return {freight: 0};
      }
    });

    //
    // INVOICE LINE
    //

    XM.InvoiceLine.prototype.augment({
      handlers: {
        'change:item': 'setUpdateInventoryReadOnly',
        'change:site': 'setUpdateInventoryReadOnly'
      },

      initialize: function () {
        this.setUpdateInventoryReadOnly();
      },

      setUpdateInventoryReadOnly: function () {
        if (!this.getParent() || this.getParent().get("isPosted") || !this.get("item") || !this.get("site")) {
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
    // INVOICE LIST ITEM
    //

    var oldPost = XM.InvoiceListItem.prototype.doPost;
    XM.InvoiceListItem.prototype.doPost = function () {
      var that = this,
        gatherDistributionDetail = function (lineArray) {
          var processLine = function (line, done) {
            var details;

            if (!line.invControl) {
              // XXX do not open up a workspace if the line is not under
              // inventory control.
              done(null, {
                id: line.uuid,
                billed: line.billed
              });
              return;
            }

            details = {
              workspace: "XV.IssueStockWorkspace",
              id: line.uuid,
              callback: function (workspace) {
                var lineModel = workspace.value; // must be gotten before doPrevious
                workspace.doPrevious();
                done(null, lineModel);
              }
            };
            // TODO: this will not stand
            XT.app.$.postbooks.addWorkspace(null, details);
          };
          async.mapSeries(lineArray, processLine, function (err, results) {
            var params = _.map(results, function (result) {
              return {
                orderLine: result.id,
                quantity: result.billed || result.get("toIssue"),
                options: {
                  post: true,
                  asOf: that.get("invoiceDate"),
                  detail: result.get ? result.getValue("itemSite.detail").map(function (detail) {
                    return {
                      quantity: detail.get("quantity"),
                      location: detail.getValue("location.uuid") || undefined,
                      trace: detail.getValue("trace.number") || undefined
                    };
                  }) : undefined
                }
              };
            }),
              dispatchSuccess = function (result, options) {
                // do we want to notify the user?
            },
              dispatchError = function () {
                console.log("dispatch error", arguments);
              };

            that.dispatch("XM.Invoice", "postWithInventory", [that.id, params], {
              success: dispatchSuccess,
              error: dispatchError
            });
          });
        },
        dispatchSuccess = function (lineArray) {
          if (lineArray.length === 0) {
            // this return is not under inventory control, so we can post per usual
            oldPost.apply(that, arguments);
          } else {
            gatherDistributionDetail(lineArray);
          }
        },
        dispatchError = function () {
          console.log("dispatch error", arguments);
        };
      this.dispatch("XM.Invoice", "getControlledLines", [this.id], {
        success: dispatchSuccess,
        error: dispatchError
      });
    };
  };

}());
