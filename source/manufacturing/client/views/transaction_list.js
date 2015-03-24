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
                  {kind: "XV.ListAttrLabeled", attr: "fifoLocation", formatter: "formatFifo",
                    label: "_location".loc()}
                ]},
                {kind: "XV.ListColumn", classes: "short", components: [
                  {kind: "XV.ListAttrLabeled", attr: "fifoTrace", formatter: "formatFifo",
                    label: "_lot".loc()},
                ]}
              ]}
            ]},
            {kind: "XV.ListColumn", style: "width: 75px;", components: [
              {kind: "XV.ListAttrLabeled", attr: "balance", formatter: "formatQuantity", style: "font-size: medium;",
                label: "_balance".loc()},
              {kind: "XV.ListAttrLabeled", attr: "issued", onValueChange: "issuedDidChange",
                formatter: "formatQuantity", label: "_issued".loc()}
            ]},
            {kind: "XV.ListColumn", style: "width: 35px;", components: [
              {kind: "XV.ListAttrLabeled", attr: "unit.name", label: "_unit".loc()},
              {kind: "XV.ListAttrLabeled", attr: "itemSite.site.code", label: "_site".loc()}
              
            ]},
            {kind: "XV.ListColumn", fit: false, style: "width: 75px;", components: [
              //TODO : {tag: "br", content: ""},
              {kind: "XV.ListAttrLabeled", attr: "method", label: "_method".loc()},
              {kind: "XV.ListAttrLabeled", attr: "dueDate", label: "_due".loc()}
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
      fetched: function (collection, data, options) {
        this.inherited(arguments);
        // Refresh model to disp. fifoDetail meta attribute which was set after list rendered.
        this.refreshModel();
      },
      formatItem: function (value, view, model) {
        var item = model.getValue("itemSite.item");
        return item.get("number") + " - " + item.get("description1");
      },
      /**
        Replace FIFO attributes with scanned data
      */
      formatFifo: function (value, view, model) {

        if (view.attr === "fifoLocation") {
          var locationScan = model.getValue("locationScan");
          if (locationScan) {
            value = locationScan;
          } else if (value && value !== view.placeholder) {
            value = value.format();
          }
        } else if (view.attr === "fifoTrace") {
          var traceScan = model.getValue("traceScan");
          if (traceScan) {
            value = traceScan;
          }
        }
        return value;
      },
      formatQoh: function (value, view, model) {
        if (value) {
          var scale = XT.locale.quantityScale,
            qoh = Globalize.format(model.getValue("itemSite.quantityOnHand"), "n" + scale);
          return  qoh + " - " + value;
        }
      },
      formatStatus: function (value, view, model) {
        var color = model.getValue("metaStatus").color;
        view.addStyles("color: " + color + "; font-size: 32px; text-align: center; " + 
          "vertical-align: middle; width: 32px; padding-bottom: 0px;");
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
