/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, enyo:true, XM:true, Globalize:true, _:true*/

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
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true},
                {kind: "XV.ListAttr", attr: "getWorkOrderStatusString"},
                {kind: "XV.ListAttr", attr: "startDate", formatter: "formatStartDate",
                  classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", formatter: "formatItem", fit: true},
                {kind: "XV.ListAttr", attr: "quantity",  classes: "right"},
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "dueDate", classes: "text-align-right"},
              {kind: "XV.ListAttr", attr: "received", classes: "text-align-right"}
            ]},
            {kind: "XV.ListColumn", classes: "third", components: [
              {kind: "XV.ListAttr", attr: "priority", classes: "text-align-right"},
              {kind: "XV.ListAttr", attr: "item.inventoryUnit.name"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", formatter: "formatCondition"},
                {kind: "XV.ListAttr", attr: "postedValue", classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "site.code"},
                {kind: "XV.ListAttr", attr: "wipValue", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatCondition: function (value, view, model) {
        var today = XT.date.today(),
          date = XT.date.applyTimezoneOffset(model.get("dueDate"), true),
          isActive = model.isActive(),
          isLate = (isActive && XT.date.compareDate(value, today) < 1),
          K = XM.WorkOrder,
          message;
        view.addRemoveClass("error", isLate);
        if (!isActive) {
          message = "_closed".loc();
        } else {
          message = isLate ? "_overdue".loc() : "_onTime".loc();
        }
        return message;
      },
      formatItem: function (value, view, model) {
        var item = model.get("item");
        return item.get("number") + " - " + item.get("description1");
      },
      formatStartDate: function (value, view, model) {
        var status = model.get("status"),
          today = XT.date.today(),
          date = XT.date.applyTimezoneOffset(value, true),
          K = XM.WorkOrder,
          isLate = (status !== K.INPROCESS_STATUS &&
                    status !== K.CLOSED_STATUS &&
                    XT.date.compareDate(value, today) < 1);

        view.addRemoveClass("error", isLate);
        return value ? Globalize.format(date, "d") : "";
      },
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
