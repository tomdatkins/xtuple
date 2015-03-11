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
      label: "_issueReturnMaterial".loc(),
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
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "fifoLocation", style: "font-weight: bold", classes: "emphasis",
                formatter: "formatLocation", placeholder: "_na".loc()},
              {kind: "XV.ListAttr", attr: "fifoTrace",
                style: "font-weight: bold", placeholder: "_na".loc()},
              {kind: "XV.ListAttr", attr: "fifoQuantity"}
            ]}
          ]}
        ]}
      ],
      orderChanged: function () {
        this.doOrderChanged({order: this.getOrder()});
      },
      fetched: function (collection, data, options) {
        this.inherited(arguments);
        // Refresh model to disp. fifoDetail meta attribute which was set after list rendered.
        this.refreshModel();
      },
      formatItem: function (value, view, model) {
        var item = model.getValue("itemSite.item");
        return item.get("number") + " - " + item.get("description1");
      },
      formatLocation: function (value, view, model) {
        if (value && value !== view.placeholder) {
          return value.format();
        }
        return value;
      },
      issuedDidChange: function (value, view, model) {
        if (model.getValue("issued") > 0) {this.doIssuedChanged(); }
      },
      returnLine: function () {
        var models = this.selectedModels();
        this.transact(models, false, "returnMaterial", "XV.ReturnMaterialWorkspace", "issued");
      },
      returnMaterial: function () {
        var models = this.selectedModels();
        this.transact(models, true, "returnMaterial", "XV.ReturnMaterialWorkspace");
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
