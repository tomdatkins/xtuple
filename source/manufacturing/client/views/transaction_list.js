/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.manufacturing.initTransactionLists = function () {

    // ..........................................................
    // ISSUE WORK ORDER MATERIALS
    //

    enyo.kind({
      name: "XV.IssueMaterialList",
      kind: "XV.TransactionList",
      label: "_issueMaterial".loc(),
      collection: "XM.IssueMaterialCollection",
      parameterWidget: "XV.IssueMaterialParameters",
      query: {orderBy: [
        {attribute: "item.number"}
      ]},
      events: {
        onIssuedChanged: ""
      },
      showDeleteAction: false,
      actions: [
        // Renaming actions here, the *issue* methods are defined in XV.TransactionList
        {name: "issueMaterial", prerequisite: "canIssueItem",
          method: "transactItem", notify: false, isViewMethod: true},
        {name: "issueLine", prerequisite: "canIssueItem",
          method: "transactLine", notify: false, isViewMethod: true},
        // Defined, handled below
        {name: "returnMaterial", prerequisite: "canReturnItem",
          method: "returnMaterial", notify: false, isViewMethod: true},
        {name: "returnLine", prerequisite: "canReturnItem",
          method: "returnLine", notify: false, isViewMethod: true}
      ],
      published: {
        status: null,
        transFunction: "issueMaterial",
        transModule: XM.Manufacturing,
        transWorkspace: "XV.IssueMaterialWorkspace"
      },
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", formatter: "formatItem"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "startDate"},
                {kind: "XV.ListAttr", attr: "dueDate"}
              ]}
            ]},
            {kind: "XV.ListColumn", components: [
              {kind: "XV.ListAttr", attr: "itemSite.site.code", style: "text-align-right"}
            ]},
            {kind: "XV.ListColumn", components: [
              {kind: "XV.ListAttr", attr: "unit.name", style: "text-align-right"},
              {kind: "XV.ListAttr", attr: "getIssueMethodString"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", attr: "required", style: "text-align-right"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", attr: "balance", style: "text-align-right"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", attr: "issued", onValueChange: "issuedDidChange",
                style: "text-align-right"}
            ]}
          ]}
        ]}
      ],
      orderChanged: function () {
        this.doOrderChanged({order: this.getOrder()});
      },
      formatItem: function (value, view, model) {
        var item = model.getValue("itemSite.item");
        return item.get("number") + " - " + item.get("description1");
      },
      issuedDidChange: function (value, view, model) {
        if (model.getValue("issued") > 0) {this.doIssuedChanged(); }
      },
      returnAll: function () {
        var models = this.getValue().models;
        this.return(models);
      },
      returnLine: function () {
        var models = this.selectedModels();
        this.return(models);
      },
      returnMaterial: function () {
        var models = this.selectedModels();
        this.return(models, true);
      },
      /**
        XXX - Copied from lib/enyo-x/source/views/transaction_list.js...
        to handle returnMaterial actions without modifying enyo-x. Differences: 
          - The function name ("returnMaterial") can't be obtained from the 
          functionName published field which is set to "issueMaterial"
          - The workspace name ("XV.ReturnMaterialWorkspace") "..."
          - The quantity to use "issued" vs. using quantityAttribute off model 

        @param {Array} Models
        @param {Boolean} Prompt user for confirmation on every model
      */
      return: function (models, prompt) {
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
            transModule = that.getTransModule(),
            transFunction = "returnMaterial",
            transWorkspace = "XV.ReturnMaterialWorkspace";

          // If argument is false, this whole process was cancelled
          if (workspace === false) {
            return;

          // If a workspace brought us here, process the information it obtained
          } else if (workspace) {
            model = workspace.getValue();
            toTransact = model.get(model.quantityAttribute);
            transDate = model.transactionDate;

            if (toTransact) {
              if (transFunction === "receipt") {
                wsOptions.freight = model.get("freight");
              }
              wsOptions.detail = model.formatDetail();
              wsOptions.asOf = transDate;
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
              that.doProcessingChanged({isProcessing: true});
              dispOptions.success = function () {
                that.doProcessingChanged({isProcessing: false});
              };
              dispOptions.error = function () {
                that.doProcessingChanged({isProcessing: false});
              };
              transModule.transactItem(data, dispOptions, transFunction);
            } else {
              return;
            }

          // Else if there's something here we can transact, handle it
          } else {
            model = models[i];
            toTransact = model.get("issued"); //model.get(model.quantityAttribute);
            if (toTransact === null) {
              toTransact = model.get("balance");
            }
            transDate = model.transactionDate;

            // See if there's anything to transact here
            if (toTransact) {

              // If prompt or distribution detail required,
              // open a workspace to handle it
              if (prompt || model.requiresDetail() || model.undistributed()) {
                that.doWorkspace({
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
                if (transFunction === "receipt") {
                  options.freight = model.get("freight");
                }
                options.asOf = transDate;
                options.detail = model.formatDetail();
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
      },
      setupItem: function (inSender, inEvent) {
        this.inherited(arguments);
        var hasQtyIssued = _.find(this.getValue().models, function (model) {
          return model.get("issued") > 0;
        });
        if (hasQtyIssued) { this.doIssuedChanged(); }
      }
    });

  };
}());
