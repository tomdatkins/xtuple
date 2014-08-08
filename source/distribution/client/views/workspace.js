/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true, async:true,
  window:true, setTimeout:true */

(function () {

  XT.extensions.distribution.initWorkspaces = function () {

    // ..........................................................
    // SALES ORDER
    //

    var salesOrder = XV.SalesOrderWorkspace.prototype;

    if (!salesOrder.actionButtons) { salesOrder.actionButtons = []; }
    salesOrder.actionButtons.push(
      {name: "expressCheckoutButton", label: "_expressCheckout".loc(),
        isViewMethod: true,
        icon: "shopping-cart",
        method: "expressCheckout",
        privilege: "IssueStockToShipping",
        prerequisite: "canIssueStockToShipping"}
    );

    // Add methods
    _.extend(salesOrder, {
      expressCheckout: function () {
        var K = XM.SalesOrder,
          that = this,
          model = this.getValue(),
          holdType = model.getValue("holdType"),
          message = "_unsavedChanges".loc() + " " + "_saveYourWork?".loc(),
          ids = _.map(this.value.get("lineItems").models, function (model) {
            return model.id;
          }),
          checkout = function () {
            async.map(ids, getIssueToShippingModel, function (err, res) {
              that.parent.parent.doPrevious();
              // res should be an array of READY_CLEAN IssueToShipping models
              that.issue(res);
            });
          },
          getIssueToShippingModel = function (id, done) {
            var model = new XM.IssueToShipping();
            model.fetch({id: id, success: function () {
              done(null, model);
            }, error: function () {
              done(null);
            }
            });
          };

        if (holdType === K.CREDIT_HOLD_TYPE) {
          this.doNotify({message: "_orderCreditHold".loc(), type: XM.Model.WARNING });
        } else if (holdType === K.PACKING_HOLD_TYPE) {
          this.doNotify({message: "_orderPackingHold".loc(), type: XM.Model.WARNING });
        } else if (holdType === K.SHIPPING_HOLD_TYPE) {
          this.doNotify({message: "_orderShippingHold".loc(), type: XM.Model.WARNING });
        } else if (model.isDirty()) {
          model.save(null, {success: checkout});
        } else {
          checkout();
        }
      }
    });

    // ..........................................................
    // SALES ORDER
    //

    var _soproto = XV.SalesOrderWorkspace.prototype,
      _attributesChanged = _soproto.attributesChanged;

    // Add actions
    if (!_soproto.actions) { _soproto.actions = []; }
    _soproto.actions.push(
      {name: "issueToShipping", isViewMethod: true,
        privilege: "IssueStockToShipping",
        prerequisite: "canIssueStockToShipping"}
    );

    // Add methods
    _.extend(_soproto, {
      attributesChanged: function () {
        _attributesChanged.apply(this, arguments);
        //  This Order has been saved, send event to be handled by the ItemSite Widget 
        //  and have it's published value, 'canEditItemSite' set to false.
        var model = this.getValue();
        if (model.status !== XM.Model.READY_NEW) {
          this.waterfallDown("onModelNotNew", {canEditItemSite: false});
        }
      },
      issueToShipping: function () {
        var K = XM.SalesOrder,
          model = this.getValue(),
          holdType = model.getValue("holdType"),
          afterClose = function () {
            model.fetch();
          };

        if (holdType === K.CREDIT_HOLD_TYPE) {
          this.doNotify({message: "_orderCreditHold".loc(), type: XM.Model.WARNING });
        } else if (holdType === K.PACKING_HOLD_TYPE) {
          this.doNotify({message: "_orderPackingHold".loc(), type: XM.Model.WARNING });
        } else {
          this.doTransactionList({
            kind: "XV.IssueToShipping",
            key: model.get("uuid"),
            callback: afterClose
          });
        }
      }
    });

    /**
        Refactor - copied/modified from TransactionList
    */
    XV.SalesOrderWorkspace.prototype.issue = function (models) {
      // Should we go here first to be there in case of error?
      //this.issueToShipping();
      var that = this,
        i = -1,
        callback,
        data = [];
      // Recursively transact everything we can
      // #refactor see a simpler implementation of this sort of thing
      // using async in inventory's ReturnListItem stomp
      callback = function (workspace) {
        var model,
          options = {},
          toTransact,
          transDate,
          params,
          dispOptions = {},
          wsOptions = {},
          wsParams,
          transFunction = "issueToShipping",
          transWorkspace = "XV.IssueStockWorkspace",
          shipment;

        // If argument is false, this whole process was cancelled
        if (workspace === false) {
          return;

        // If a workspace brought us here, process the information it obtained
        } else if (workspace) {
          model = workspace.getValue();
          toTransact = model.get(model.quantityAttribute);
          transDate = model.transactionDate || new Date();

          if (toTransact) {
            wsOptions.detail = model.formatDetail();
            wsOptions.asOf = transDate;
            wsOptions.expressCheckout = true;
            wsParams = {
              orderLine: model.id,
              quantity: toTransact,
              options: wsOptions
            };
            data.push(wsParams);
          }
          workspace.doPrevious();
        }

        i++;
        // If we've worked through all the models then forward to the server
        if (i === models.length) {
          if (data[0]) {
            /* TODO - add spinner and confirmation message.
                Also, refresh Sales Order List so that the processed order drops off list.

            that.doProcessingChanged({isProcessing: true});
            dispOptions.success = function () {
              that.doProcessingChanged({isProcessing: false});
            };*/
            dispOptions.success = function (dispReturn) {
              var invoiceNumber = dispReturn.invoiceNumber;

              model = new XM.Invoice();
              model.initialize(null, {isNew: true});
              model.fetch({number: invoiceNumber});

              var callback = function (response) {
                // Refresh the list and print invoice if requested
                XT.app.$.postbooks.$.navigator.$.contentPanels.getActive().fetch();
                // If Print Invoice, print invoice
                if (response.answer) {
                  var options = {};
                  options.model = model;
                  XT.app.$.postbooks.$.navigator.$.contentPanels.getActive().doPrint(options);
                }
              };
              XT.app.$.postbooks.$.navigator.doNotify({
                type: XM.Model.QUESTION,
                message: "_success!".loc() + " Invoice #" + invoiceNumber + " created, " +
                  "would you like to print it?",
                callback: callback,
                yesLabel: "_printInvoice".loc()
              });
            };
            XM.Inventory.transactItem(data, dispOptions, transFunction);
          } else {
            return;
          }

        // Else if there's something here we can transact, handle it
        } else {
          model = models[i];
          toTransact = model.get(model.quantityAttribute);
          if (toTransact === null) {
            toTransact = model.get("balance");
          }
          transDate = model.transactionDate || new Date();

          // See if there's anything to transact here
          if (toTransact) {

            // If prompt or distribution detail required,
            // open a workspace to handle it
            if (model.undistributed()) {
              // XXX - Refactor. Currently can't do that.doWorkspace
              // or send an event because we are navigating back further up.
              // Need to navigate back to list after success.
              XT.app.$.postbooks.$.navigator.doWorkspace({
                workspace: transWorkspace,
                id: model.id,
                callback: callback,
                allowNew: false,
                success: function (model) {
                  model.transactionDate = transDate;
                }
              });

            // Otherwise just use the data we have
            } else {
              options.asOf = transDate;
              options.detail = model.formatDetail();
              options.expressCheckout = true;
              params = {
                orderLine: model.id,
                quantity: toTransact,
                options: options
              };
              data.push(params);
              callback();
            }

          // Nothing to transact, move on
          } else {
            callback();
          }
        }
      };
      callback();
    };
  };
}());
