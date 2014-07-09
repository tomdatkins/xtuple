/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true, async:true */

(function () {
  "use strict";

  XT.extensions.inventory.initReturnModels = function () {

    //
    // RETURN
    //

    XM.Return.prototype.augment(XM.InvoiceAndReturnInventoryMixin);

    //
    // RETURN LINE
    //

    XM.ReturnLine.prototype.augment(XM.InventoryAndReturnLineInventoryMixin);

    //
    // RETURN LIST ITEM
    //

    var oldPost = XM.ReturnListItem.prototype.doPost;
    XM.ReturnListItem.prototype.doPost = function () {
      var that = this,
        gatherDistributionDetail = function (lineArray) {
          var processLine = function (line, done) {
            var details;

            if (!line.invControl) {
              // XXX do not open up a workspace if the line is not under
              // inventory control. But do we want the user to be
              // able to specify the quantity returned?
              done(null, {
                id: line.uuid,
                received: line.returned
              });
              return;
            }

            details = {
              workspace: "XV.EnterReceiptWorkspace",
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
                quantity: result.received || result.get("received"),
                options: {
                  post: true,
                  asOf: that.get("returnDate"),
                  detail: result.get ? result.get("detail").map(function (detail) {
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

            that.dispatch("XM.Return", "postWithInventory", [that.id, params], {
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
      this.dispatch("XM.Return", "getControlledLines", [this.id], {
        success: dispatchSuccess,
        error: dispatchError
      });
    };
  };
}());

