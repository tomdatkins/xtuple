/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.manufacturing.initLists = function () {

    // ..........................................................
    // WORK ORDER
    //

    enyo.kind({
      name: "XV.WorkOrderList",
      kind: "XV.List",
      label: "_workOrders".loc(),
      collection: "XM.WorkOrderListItemCollection",
      parameterWidget: "XV.WorkOrderListParameters",
      canAddNew: false,
      actions: [
        {name: "postProduction", method: "postProduction",
            isViewMethod: true, notify: false,
            prerequisite: "canPostProduction"},
        {name: "issueMaterial", method: "issueMaterial",
            isViewMethod: true, notify: false,
            prerequisite: "canIssueMaterial"}
      ],
      query: {orderBy: [
        {attribute: 'number'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "XV.ListAttr", attr: "number", fit: true},
              {kind: "XV.ListAttr", attr: "getWorkOrderStatusString"},
              {kind: "XV.ListAttr", attr: "dueDate", classes: "right"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "getWorkOrderStatusString"},
                {kind: "XV.ListAttr", attr: "itemSite.item.number",
                  classes: "bold"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "itemSite.item.description1", classes: "italic"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "dueDate", classes: "right"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "itemSite.item.inventoryUnit.name"},
                {kind: "XV.ListAttr", attr: "ordered"},
                {kind: "XV.ListAttr", attr: "quantityReceived"}
              ]}
            ]}
          ]}
        ]}
      ],
      issueMaterial: function (inEvent) {
        var index = inEvent.index,
          workOrder = this.getValue().at(index),
          that = this,
          panel = XT.app.$.postbooks.createComponent({kind: "XV.IssueMaterial", model: workOrder.id});
        panel.render();
        XT.app.$.postbooks.reflow();
        XT.app.$.postbooks.setIndex(XT.app.$.postbooks.getPanels().length - 1);
      },
      postProduction: function (inEvent) {
        var index = inEvent.index,
          workOrder = this.getValue().at(index),
          that = this,
          callback = function (resp) {
            var options = {
              success: function () {
                // Re-render the row if showing shipped, otherwise remove it
                var query = that.getQuery(),
                  param,
                  collection,
                  model;
                param = _.findWhere(query.parameters, {attribute: "getWorkOrderStatusString"});
                if (param === "Closed") {
                  collection = that.getValue();
                  model = collection.at(index);
                  collection.remove(model);
                  that.fetched();
                } else {
                  that.renderRow(index);
                }
              }
            };
            // Refresh row if shipped
            if (resp) { workOrder.fetch(options); }
          };
        this.doWorkspace({
          workspace: "XV.PostProductionWorkspace",
          id: workOrder.id,
          callback: callback
        });
      }
    });

    XV.registerModelList("XM.WorkOrderListItem", "XV.WorkOrderList");

  };

}());
