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
      backText: "_cancel".loc(),
      list: "XV.EnterReceiptList",
      handlers: {
        onToReceiveChanged: "enablePostButton"
      },
      actions: [
        {name: "issueAll", label: "_receiveAll".loc(),
          prerequisite: "canEnterReceipts" }
      ],
      canEnterReceipts: function () {
        var hasPrivilege = XT.session.privileges.get("EnterReceipts"),
          model = this.$.list.getModel(0),
          validModel = _.isObject(model) ? true : false,
          hasOpenLines = this.$.list.value.length;
        return hasPrivilege && validModel && hasOpenLines;
      },
      create: function () {
        this.inherited(arguments);
        var button = this.$.postButton;
        button.setShowing(true);
        //Model set when called from Order List
        if (this.model) {
          this.$.parameterWidget.$.order.setValue(this.model);
        }
      },
      issueAll: function () {
        this.$.list.issueAll();
      },
      enablePostButton: function () {
        this.$.postButton.setDisabled(false);
      },
      post: function () {
        var hasPrivilege = XT.session.privileges.get("CreateReceiptTrans"),
          model = this.$.parameterWidget.$.order.getValue(),
          order = model.id,
          options = {},
          hasQtyToReceive = _.compact(_.pluck(_.pluck(this.$.list.getValue().models, "attributes"), "toReceive"));
        if (hasPrivilege && hasQtyToReceive) {
          this.doPrevious();
          XM.Inventory.postReceipts(order, options);
        }
      },
      setList: function () {
        this.inherited(arguments);
        var model = this.$.list.getModel(0),
          validModel = _.isObject(model) ? true : false,
          hasQtyToReceive = _.compact(_.pluck(_.pluck(this.$.list.getValue().models, "attributes"), "toReceive"));
        //TODO - replace this hack to enable the Post button if there is qty to receive.
        if (hasQtyToReceive.length > 0) {
          this.$.postButton.setDisabled(false);
        }
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
          prerequisite: "canIssueItem" }
      ],
      handlers: {
        onShipmentChanged: "shipmentChanged"
      },
      canIssueItem: function () {
        var hasPrivilege = XT.session.privileges.get("IssueStockToShipping"),
          model = this.getModel(),
          validModel = _.isObject(model) ? !model.get("isShipped") : false,
          hasOpenLines = this.$.list.value.length;
        return hasPrivilege && validModel && hasOpenLines;
      },
      create: function () {
        this.inherited(arguments);
        var button = this.$.postButton;
        button.setContent("_ship".loc());
        button.setShowing(true);
      },
      issueAll: function () {
        this.$.list.issueAll();
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
      shipmentChanged: function (inSender, inEvent) {
        var disabled = _.isEmpty(inEvent.shipment) ||
                       !XT.session.privileges.get("ShipOrders");
        this.$.parameterWidget.$.shipment.setValue(inEvent.shipment);
        this.$.postButton.setDisabled(disabled);
      }
    });
  };

}());
