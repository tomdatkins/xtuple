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
        //validModel = _.isObject(model) ? !model.get("isShipped") : false;
        validModel = _.isObject(model);
      return hasPrivilege && validModel;
    };

    enyo.kind({
      name: "XV.IssueMaterial",
      kind: "XV.TransactionListContainer",
      prerequisite: "canIssueItem",
      notifyMessage: "_issueAll?".loc(),
      list: "XV.IssueMaterialList",
      hidePost: true,
      actions: [
        {name: "issueAll", label: "_issueAll".loc(),
          prerequisite: "canIssueItem" },
        {name: "postProduction", method: "postProduction",
          isViewMethod: true, notify: false,
          prerequisite: "canPostProduction"}
      ],
      canIssueItem: function () {
        var hasPrivilege = XT.session.privileges.get("IssueWoMaterials"),
          model = this.getModel(),
          validModel = _.isObject(model) ? true : false,
          hasOpenLines = this.$.list.value.length;
        return hasPrivilege && validModel && hasOpenLines;
      },
      canPostProduction: function () {
        var hasPrivilege = XT.session.privileges.get("PostProduction");
        return hasPrivilege;
      },

      create: function () {
        this.inherited(arguments);
        //Model set when called from Work Order List
        if (this.model) {
          this.$.parameterWidget.$.order.setValue(this.model);
        }
      },

      issueAll: function () {
        // transactAll is defined on XV.TransactionList
        this.$.list.transactAll();
      },

      postProduction: function () {
        var workOrder = this.getModel();
        this.doWorkspace({
          workspace: "XV.PostProductionWorkspace",
          id: workOrder.id
        });
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
      }
    });

    enyo.kind({
      name: "XV.ReturnMaterial",
      kind: "XV.TransactionListContainer",
      prerequisite: "canReturnItem",
      notifyMessage: "_returnAll?".loc(),
      list: "XV.ReturnMaterialList",
      hidePost: true,
      actions: [
        {name: "returnAll", label: "_returnAll".loc(),
          prerequisite: "canReturnItem" }
      ],
      canReturnItem: function () {
        var hasPrivilege = XT.session.privileges.get("ReturnWoMaterials"),
          model = this.getModel(),
          validModel = _.isObject(model) ? true : false,
          hasOpenLines = this.$.list.value.length;
        return hasPrivilege && validModel && hasOpenLines;
      },
      create: function () {
        this.inherited(arguments);
        //Model set when called from Work Order List
        if (this.model) {
          this.$.parameterWidget.$.order.setValue(this.model);
        }
      },
      returnAll: function () {
        // transactAll is defined on XV.TransactionList
        this.$.list.transactAll();
      }
    });
  };

}());
