/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, XM:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.manufacturing.initListRelations = function () {

    // ..........................................................
    // PLANNER CODE
    //

    enyo.kind({
      name: "XV.PlannerCodeWorkOrderWorkflowListRelations",
      kind: "XV.WorkflowListRelations",
      parentKey: "plannerCode"
    });

    // ..........................................................
    // POST PRODUCTION CREATE LOT SERIAL / DISTRIBUTE TO LOCATIONS
    //

    enyo.kind({
      name: "XV.PostProductionCreateLotSerialListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "quantity"}
      ],
      parentKey: "itemSite",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "quantity", classes: "bold"},
                {kind: "XV.ListAttr", attr: "trace", fit: true},
                {kind: "XV.ListAttr", attr: "expireDate"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "location.format", fit: true, style: "text-indent: 18px;"},
                {kind: "XV.ListAttr", attr: "warrantyDate", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // WORK ORDER MATERIALS
    //

    enyo.kind({
      name: "XV.WorkOrderMaterialListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "item.number"}
      ],
      parentKey: "workOrder",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "item.number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "dueDate", classes: "right"},
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "item.description1",
                  classes: "italic"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", formatter: "formatQuantities"},
                {kind: "XV.ListAttr", attr: "unit.name"},
                {kind: "XV.ListAttr", attr: "postedValue", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatQuantities: function (value, view, model) {
        var format = function (value) {
            return Globalize.format(value, "n" + XT.locale.quantityScale);
          },
          quantityRequired = model.get("quantityRequired"),
          quantityIssued = model.get("quantityIssued");
        return format(quantityIssued) + " / " + format(quantityRequired);

      }
    });

    // ..........................................................
    // WORK ORDER ROUTINGS
    //

    /** @private */
    var _format = function (value) {
      return Globalize.format(value, "n" + XT.MINUTES_SCALE);
    };

    enyo.kind({
      name: "XV.WorkOrderOperationListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "sequence"}
      ],
      parentKey: "workOrder",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "sequence", classes: "bold"},
                {kind: "XV.ListAttr", attr: "workCenter.code", fit: true},
                {kind: "XV.ListAttr", attr: "getOperationStatusString", classes: "right"},
              ]},
              {kind: "XV.ListAttr", attr: "description1", fit: true,
                style: "text-indent: 26px;", classes: "italic"},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", formatter: "formatSetup", fit: true,
                  style: "text-indent: 26px;"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", formatter: "formatRun", fit: true,
                  style: "text-indent: 26px;"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "postedQuantity",
                  formatter: "formatPostedQuantity",
                  style: "text-indent: 26px;"},
                {kind: "XV.ListAttr", attr: "postedValue", classes: "right"}
              ]},
            ]}
          ]}
        ]}
      ],
      formatPostedQuantity: function (value, view, model) {
        var postedQuantity = this.formatQuantity(value, view),
          expectedQuantity = this.formatQuantity(model.getValue("workOrder.quantity") * model.get("productionUnitRatio") || 1, view);
        return postedQuantity + " / " + expectedQuantity + " " + model.get("productionUnit");
      },
      formatRun: function (value, view, model) {
        var runTime = model.get("runTime"),
          runConsumed = model.get("runConsumed"),
          run = "_run".loc() + ": " + _format(runConsumed) + " / " + _format(runTime) + " " + "_min".loc();
        view.setShowing(runTime || runConsumed);
        return run;
      },
      formatSetup: function (value, view, model) {
        var setupTime = model.get("setupTime"),
          setupConsumed = model.get("setupConsumed"),
          setup = "_setup".loc() + ": " + _format(setupConsumed) + " / " + _format(setupTime) + " " + "_min".loc();
        view.setShowing(setupTime || setupConsumed);
        return setup;
      }
    });

    enyo.kind({
      name: "XV.WorkOrderTimeClockListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "timeIn"}
      ],
      toggleSelected: false,
      parentKey: "workOrder",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "operation.sequence",
                  classes: "bold"},
                {kind: "XV.ListAttr", attr: "operation.workCenter.code"},
                {kind: "XV.ListAttr", attr: "employee.code", classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "timeIn", formatter: "formatTime",
                  style: "width: 150px;"},
                {kind: "XV.ListAttr", attr: "timeOut", formatter: "formatTime",
                  placeholder: "_na".loc()}
              ]}
            ]}
          ]}
        ]}
      ],
      formatTime: function (value, view) {
        return value ? Globalize.format(value, {datetime: "short"}) : null;
      },
      formatOperation: function (value, view, model) {
        var operation = model.get("operation"),
          sequence = model.get("sequence"),
          workCenter = operation.getValue("workCenter.code");
        return sequence + " - " + workCenter;
      }
    });

    // ..........................................................
    // WORK ORDER TREE
    //

    enyo.kind({
      name: "XV.WorkOrderTreeListRelations",
      kind: "XV.ListRelations",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", formatter: "formatIcon",
                  ontap: "iconTapped"},
                {kind: "XV.ListAttr", formatter: "formatName"},
                {kind: "XV.ListAttr", formatter: "formatQuantityRequired",
                  classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", formatter: "formatDescription", fit: true},
                {kind: "XV.ListAttr", formatter: "formatDueDateRequired", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatDescription: function (value, view, model) {
        var child = model.get("model"),
          level = model.get("level"),
          isCollapsed = model.get("isCollapsed"),
          indent;

        // Indent the name if there's no icon to do it
        indent = level * 6 + 18;
        view.applyStyle("text-indent", indent + "px");

        switch (child.recordType)
        {
        case "XM.WorkOrder":
          this.addRemoveClass("italic", false);
          return this.formatStartDate(child.get("startDate"), view, model);
        case "XM.WorkOrderMaterial":
          value = child.getValue("item.description1");
          break;
        case "XM.WorkOrderOperation":
          value = child.get("description1");
          break;
        default:
          value = "";
        }

        this.addRemoveClass("italic", true);
        this.formatView(child.recordType, view);

        return value;
      },
      formatDueDateRequired: function (value, view, model) {
        var child = model.get("model");

        switch (child.recordType)
        {
        case "XM.WorkOrder":
        case "XM.WorkOrderMaterial":
          value = this.formatDueDate(child.get("dueDate"), view, model);
          break;
        case "XM.WorkOrderOperation":
          view.addRemoveClass("error", false);
          value = this.formatDate(child.get("scheduled"), view, model);
          break;
        default:
          value = "";
        }

        return value;
      },
      formatIcon: function (value, view, model) {
        var level = model.get("level"),
          isCollapsed = model.get("isCollapsed");

        if (_.isBoolean(isCollapsed)) {
          view.addRemoveClass("icon-collapse-alt", !isCollapsed);
          view.addRemoveClass("icon-expand-alt", isCollapsed);
        } else {
          view.addRemoveClass("icon-collapse-alt", false);
          view.addRemoveClass("icon-expand-alt", false);
        }
        view.applyStyle("text-indent", level * 6 + "px");
      },
      formatName: function (value, view, model) {
        var child = model.get("model"),
          level = model.get("level"),
          isCollapsed = model.get("isCollapsed"),
          indent;

        switch (child.recordType)
        {
        case "XM.WorkOrder":
          value = child.get("name") + "  " +
            child.getValue("getWorkOrderStatusString");
          break;
        case "XM.WorkOrderOperation":
          value = child.get("sequence") + "  " +
            child.getValue("workCenter.code");
          break;
        case "XM.WorkOrderMaterial":
          value = child.getValue("item.number");
          break;
        default:
          value = "";
        }

        // Indent the name if there's no icon to do it
        indent = _.isBoolean(isCollapsed) ? 0 : level * 6 + 4;
        view.applyStyle("text-indent", indent + "px");

        this.formatView(child.recordType, view);

        return value;
      },
      formatQuantityRequired: function (value, view, model) {
        var child = model.get("model");

        switch (child.recordType)
        {
        case "XM.WorkOrder":
          value = this.formatQuantity(child.get("quantity"), view) +
            " " + child.getValue("item.inventoryUnit.name");
          break;
        case "XM.WorkOrderMaterial":
          value = this.formatQuantity(child.get("quantityRequired"), view) +
            " " + child.getValue("unit.name");
          break;
        case "XM.WorkOrderOperation":
          value = this.formatQuantity(child.getValue("operationQuantity"), view) +
            " " + child.get("productionUnit") || "";
          break;
        default:
          value = "";
        }

        this.formatView(child.recordType, view);

        return value;
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
      formatView: function (recordType, view) {
        var isEmphasis = false,
          isHyperlink = false;

        switch (recordType)
        {
        case "XM.WorkOrder":
          isEmphasis = true;
          break;
        case "XM.WorkOrderOperation":
          isHyperlink = true;
        }

        view.addRemoveClass("emphasis", isEmphasis);
        view.addRemoveClass("hyperlink", isHyperlink);
        view.addRemoveClass("error", false);
      },
      iconTapped: function (isSender, inEvent) {
        var index = inEvent.index,
          model = this.readyModels()[index],
          isCollapsed = model.get("isCollapsed"),
          parent = this.getValue().parent;

        if (_.isBoolean(isCollapsed)) {
          if (isCollapsed) {
            parent.expand(index);
          } else {
            parent.collapse(index);
          }
          return true;
        }
      }

    });

  };

}());
