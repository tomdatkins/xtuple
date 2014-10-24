/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, _:true, enyo:true */

(function () {

  XT.extensions.inventory.initTransactionListContainer = function () {

    /** @private */
    var _canDo = function (priv) {
      var hasPrivilege = XT.session.privileges.get(priv),
        model = this.getModel(),
        //validModel = _.isObject(model) ? !model.get("isShipped") : false;
        validModel = _.isObject(model);
      return hasPrivilege && validModel;
    };

    enyo.kind({
      name: "XV.EnterReceipt",
      kind: "XV.TransactionListContainer",
      prerequisite: "canEnterReceipts",
      notifyMessage: "_issueAll?".loc(),
      list: "XV.EnterReceiptList",
      actions: [
        {name: "receiveAll", label: "_receiveAll".loc(), prerequisite: "canEnterReceipts"},
        // Todo - add print action to print labels for all applicable line items
      ],
      handlers: {
        onAtReceivingChanged: "enablePostButton"
      },
      /* TODO - change Save on EnterReceipt workspace to be a callback to the TransactionList.
        Modify TransactionList to format the detail distribution records or change Distribution
        to write to a table (recvext?) so that we can formatDetail() on the EnterReceipt model
        and use TransactionList / workspace Save as designed.
      */
      canEnterReceipts: function () {
        var hasPrivilege = XT.session.privileges.get("EnterReceipts"),
          // TODO - better way to enable enterReceipt action
          model = this.$.list.getModel(0),
          validModel = _.isObject(model) ? true : false,
          hasOpenLines = this.$.list.value.length;
        return hasPrivilege && validModel && hasOpenLines;
      },
      create: function () {
        this.inherited(arguments);
        var button = this.$.postButton;
        button.setShowing(true);
        // Model set when called from Order List
        if (this.model) {
          this.$.parameterWidget.$.order.setValue(this.model);
        }
      },
      enablePostButton: function () {
        this.$.postButton.setDisabled(false);
      },
      post: function () {
        var that = this,
          i = -1,
          callback,
          data = [],
          hasPrivilege = XT.session.privileges.get("CreateReceiptTrans"),
          hasQtyToReceive = _.compact(_.pluck(_.pluck(this.$.list.getValue().models, "attributes"), "atReceiving"));

        if (!hasPrivilege || !hasQtyToReceive) {
          // TODO - add error handler.
          return;
        }
        // Recursively receive everything we can
        callback = function () {
          var model,
            models = that.$.list.getValue().models,
            options = {},
            toReceive,
            receiptLine,
            transDate,
            params,
            dispOptions = {};

          if (!hasPrivilege || !hasQtyToReceive) {
            return;
          }

          i++;
          // If we've worked through all the models then forward to the server
          if (i === models.length) {
            if (data[0]) {
              dispOptions.success = function () {
                that.doPrevious();
              };
              XM.Inventory.transactItem(data, dispOptions, "postReceipt");
            } else {
              return;
            }

          // Else if there's something here we can issue, handle it
          } else {
            model = models[i];
            toReceive = model.get("atReceiving");
            receiptLine = model.getValue("receiptLine.uuid");

            // See if there's anything to receive here
            if (toReceive) {
              params = {
                receiptLine: receiptLine
              };
              data.push(params);
              callback();

            // Nothing to receive, move on
            } else {
              callback();
            }
          }
        };
        callback();
      },
      receiveAll: function () {
        this.$.list.transactAll();
      }
    });

    enyo.kind({
      name: "XV.IssueToShipping",
      kind: "XV.TransactionListContainer",
      prerequisite: "canIssueItem",
      notifyMessage: "_issueAll?".loc(),
      list: "XV.IssueToShippingList",
      actions: [
        {name: "issueAll", label: "_issueAll".loc(),
          prerequisite: "canIssueAll" }
      ],
      handlers: {
        onShipmentChanged: "shipmentChanged"
      },
      canIssueAll: function () {
        var hasPrivilege = XT.session.privileges.get("IssueStockToShipping"),
          hasLinesWithBal = _.find(this.$.list.value.models, function (model) {
            return model.get("balance") > 0;
          }) || false;
        return hasPrivilege && hasLinesWithBal;
      },
      create: function () {
        this.inherited(arguments);
        var button = this.$.postButton;
        button.setContent("_ship".loc());
        button.setShowing(true);
        //Model set when called from Sales Order/Transfer Order List
        if (this.model) {
          this.$.parameterWidget.$.order.setValue(this.model);
        }
      },
      issueAll: function () {
        this.$.list.transactAll();
      },
      post: function () {
        var that = this,
          shipment = this.$.parameterWidget.$.shipment.getValue(),
          callback = function (resp) {
            if (resp) { that.$.parameterWidget.$.order.setValue(null); }
          };
        this.doWorkspace({
          workspace: "XV.ShipShipmentWorkspace",
          id: shipment.id,
          callback: callback
        });
      },
      setList: function (options) {
        this.inherited(arguments);
      },
      shipmentChanged: function (inSender, inEvent) {
        var disabled = _.isEmpty(inEvent.shipment) ||
                       !XT.session.privileges.get("ShipOrders");
        this.$.parameterWidget.$.shipment.setValue(inEvent.shipment);
        this.$.postButton.setDisabled(disabled);
      }
    });
  };

}());
