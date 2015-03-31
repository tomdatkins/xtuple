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
      status: null,
      transFunction: "issueMaterial",
      transModule: XM.Manufacturing,
      transWorkspace: "XV.IssueMaterialWorkspace",
      components: [
        {name: 'divider', classes: 'xv-list-divider', fit: true},
        {kind: "XV.ListItem", name: "listItem", fit: true, components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListAttr", name: "status", attr: "formatStatus", formatter: "formatStatus"},
            {kind: "XV.ListColumn", classes: "medium", components: [
              {kind: "XV.ListAttr", name: "itemNumber", attr: "itemSite.item.number", style: "font-size: medium;"},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1", classes: "label-below", style: "padding-top: 0px; padding-left: 5px;"},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListColumn", classes: "short", components: [
                  {kind: "XV.ListAttrLabeled", attr: "formatTrace", label: "_lot".loc()}
                ]},
                {kind: "XV.ListColumn", classes: "short", components: [
                  {kind: "XV.ListAttrLabeled", attr: "fomatLocation", label: "_location".loc()}
                ]}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttrLabeled", attr: "balance", formatter: "formatQuantity", style: "font-size: medium;",
                label: "_balance".loc()},
              {kind: "XV.ListAttrLabeled", attr: "issued", onValueChange: "issuedDidChange",
                formatter: "formatQuantity", label: "_issued".loc()}
            ]},
            {kind: "XV.ListColumn", classes: "line-number", components: [
              {kind: "XV.ListAttrLabeled", attr: "unit.name", label: "_unit".loc()},
              {kind: "XV.ListAttrLabeled", attr: "itemSite.site.code", label: "_site".loc()}
            ]},
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttrLabeled", attr: "dueDate", label: "_due".loc()},
              {kind: "XV.ListAttrLabeled", attr: "method", label: "_method".loc()}
            ]}
            /**
              - Additional requested columns:
              - "qohOtherWhs"
            */
          ]}
        ]}
      ],
      orderChanged: function () {
        this.doOrderChanged({order: this.getOrder()});
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
