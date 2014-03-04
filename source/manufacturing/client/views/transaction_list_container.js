/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, _:true, enyo:true */

(function () {

  XT.extensions.manufacturing.initTransactionListContainer = function () {

    /** @private */
    var _canDo = function (priv) {
      var hasPrivilege = XT.session.privileges.get(priv),
        model = this.getModel(),
        validModel = _.isObject(model);
      return hasPrivilege && validModel;
    };

    enyo.kind({
      name: "XV.IssueMaterial",
      kind: "XV.TransactionListContainer",
      prerequisite: "canIssueItem",
      notifyMessage: "_issueAll?".loc(),
      list: "XV.IssueMaterialList",
      handlers: {
        onIssuedChanged: "enablePostButton"
      },
      actions: [
        {name: "issueAll", prerequisite: "canIssueItem" },
        {name: "returnAll", prerequisite: "canReturnItem"}
      ],
      canIssueItem: function () {
        var hasPrivilege = XT.session.privileges.get("IssueWoMaterials"),
          hasOpenLines = this.$.list.value ? this.$.list.value.models.length > 0 : false;
        return hasPrivilege && hasOpenLines;
      },
      canPostProduction: function () {
        var hasPrivilege = XT.session.privileges.get("PostProduction");
        return hasPrivilege;
      },
      canReturnItem: function () {
        var hasPrivilege = XT.session.privileges.get("ReturnWoMaterials"),
          hasIssuedItems = _.find(this.$.list.value.models, function (model) {
            return model.get("issued") > 0;
          });
        return hasPrivilege && hasIssuedItems;
      },
      create: function () {
        this.inherited(arguments);
        var button = this.$.postButton;
        button.setContent("_postProduction".loc());
        button.setShowing(true);
        //Model set when called from Sales Order/Transfer Order List
        if (this.model) {
          this.$.parameterWidget.$.order.setValue(this.model);
        }
      },
      enablePostButton: function () {
        this.$.postButton.setDisabled(false);
      },
      issueAll: function () {
        // transactAll is defined on XV.TransactionList
        this.$.list.transactAll();
      },
      post: function () {
        var workOrder = this.$.parameterWidget.$.order.getValue().id;
        if (workOrder) {
          this.doWorkspace({
            workspace: "XV.PostProductionWorkspace",
            id: workOrder
          });
        }
      },
      parameterChanged: function (inSender, inEvent) {
        this.inherited(arguments);
        var originator = inEvent ? inEvent.originator : false,
          name = originator ? originator.name : false,
          that = this;
        if (name === "order" && this.model !== -1) {
          if (inEvent.originator.$.input.getValue().id === that.model.id) {
            this.$.postButton.setDisabled(false);
          }
        } else {
          this.$.postButton.setDisabled(true);
        }
      },
      returnAll: function () {
        // Defined on XV.IssueMaterialList
        this.$.list.returnAll();
      }
    });
  };

}());
