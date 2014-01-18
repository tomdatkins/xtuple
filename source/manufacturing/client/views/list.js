/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, XV:true, enyo:true, XM:true, Globalize:true, _:true*/

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
      canAddNew: true,
      actions: [
        {name: "postProduction", method: "postProduction",
            isViewMethod: true, notify: false,
            prerequisite: "canPostProduction"},
        {name: "issueMaterial", method: "issueMaterial",
            isViewMethod: true, notify: false,
            prerequisite: "canIssueMaterial"}
      ],
      query: {orderBy: [
        {attribute: 'number'},
        {attribute: 'subNumber'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "name", isKey: true},
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
              {kind: "XV.ListAttr", formatter: "formatCondition"},
              {kind: "XV.ListAttr", attr: "item.inventoryUnit.name"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "priority"},
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
      /**
        Custom delete implementation because of Work Order's special situation with
        children. Performs dispatches ond XM.WorkOrder.delete that obtains a lock on 
        all children before deleting. Also update the list collection to remove said
        children along with the parent.
      */
      deleteItem: function (inEvent) {
        var collection = this.getValue(),
          model = inEvent.model,
          that = this,
          options = {};

        options.success = function (resp) {
          var message;

          // If delete succeeded, remove selected record and all children
          if (resp.deleted) {
            _.each(resp.ids, function (id) {
              collection.remove(collection.get(id));
            });

          // Send notification if the delete failed
          } else {
            message = "_noDeleteWorkOrder".loc();
            message = message.replace("{username}", resp.lock.username);
            this.doNotify({message: message});
          }
          
          that.fetched();
          if (inEvent.done) {
            inEvent.done();
          }
        };
        model.destroy(options);
      },
      formatCondition: function (value, view, model) {
        var  K = XM.WorkOrder,
          today = XT.date.today(),
          dueDate = XT.date.applyTimezoneOffset(model.get("dueDate"), true),
          startDate = XT.date.applyTimezoneOffset(model.get("startDate"), true),
          isActive = model.isActive(),
          lateFinish = (isActive && XT.date.compareDate(dueDate, today) < 1),
          lateStart = (isActive && model.get("status") !== K.INPROCESS_STATUS &&
            XT.date.compareDate(startDate, today) < 1),
          message;
        view.addRemoveClass("error", lateStart || lateFinish);
        if (!isActive) {
          message = "_closed".loc();
        } else if (lateFinish) {
          message = "_overdue".loc();
        } else if (lateStart) {
          message = "_lateStart".loc();
        } else {
          message = "_onTime".loc();
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
          model = this.value.at(index),
          that = this,
          panel = XT.app.$.postbooks.createComponent({kind: "XV.IssueMaterial", model: model.id});
        panel.render();
        XT.app.$.postbooks.reflow();
        XT.app.$.postbooks.setIndex(XT.app.$.postbooks.getPanels().length - 1);
      },
      postProduction: function (inEvent) {
        var index = inEvent.index,
          model = this.value.at(index);
        this.doWorkspace({workspace: "XV.PostProductionWorkspace", id: model.id});
      }
    });

    XV.registerModelList("XM.WorkOrderListItem", "XV.WorkOrderList");

  };

}());
