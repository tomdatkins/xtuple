/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.manufacturing.initListRelations = function () {

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
        var postedQuantity = this.formatQuantity(value),
          expectedQuantity = this.formatQuantity(model.getValue("workOrder.quantity") * model.get("productionUnitRatio") || 1);
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
      parentKey: "workOrder",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", formatter: "formatIcon"},
                {kind: "XV.ListAttr", formatter: "formatName"},
                {kind: "XV.ListAttr", formatter: "formatItem"},
                {kind: "XV.ListAttr", formatter: "formatQuantityRequired", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatIcon: function (value, view, model) {
        var level = model.get("level"),
          isCollapsed = model.get("isCollapsed");

        if (_.isBoolean(isCollapsed)) {
          view.addRemoveClass("icon-check-minus", !isCollapsed);
          view.addRemoveClass("icon-check-plus", isCollapsed);
        } else {
          view.addRemoveClass("icon-check-minus", false);
          view.addRemoveClass("icon-check-plus", false);
        }
        view.applyStyle("text-indent", level * 6 + "px");
      },
      formatItem: function (value, view, model) {
        var child = model.get("model");

        switch (child.recordType)
        {
        case "XM.WorkOrder":
          value = child.getValue("item.number");
          break;
        case "XM.WorkOrderOperation":
          value = child.getValue("workCenter.code");
          break;
        default:
          value = "";
        }

        this.formatView(child.recordType, view);

        return value;
      },
      formatName: function (value, view, model) {
        var child = model.get("model"),
          level = model.get("level"),
          isCollapsed = model.get("isCollapsed"),
          indent;

        switch (child.recordType)
        {
        case "XM.WorkOrder":
          value = child.get("name");
          break;
        case "XM.WorkOrderOperation":
          value = child.get("sequence");
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
          value = this.formatQuantity(child.get("quantity"));
          break;
        case "XM.WorkOrderMaterial":
          value = this.formatQuantity(child.get("quantityRequired"));
          break;
        case "XM.WorkOrderOperation":
          value = this.formatQuantity(
              child.getValue("workOrder.quantity") * child.get("productionUnitRatio")
            );
          break;
        default:
          value = "";
        }

        this.formatView(child.recordType, view);

        return value;
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
      }

    });

  };

}());
