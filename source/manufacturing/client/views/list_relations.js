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
                {kind: "XV.ListAttr", attr: "item.number", isBold: true},
                {kind: "XV.ListAttr", formatter: "formatQuantities",
                  classes: "right"},
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "item.description1",
                  classes: "italic"},
                {kind: "XV.ListAttr", attr: "unit.name", classes: "right"}
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
                  style: "text-indent: 26px;"},
                {kind: "XV.ListAttr", attr: "postedValue", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
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

  };

}());
