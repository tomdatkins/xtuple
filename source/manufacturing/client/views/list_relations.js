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
                {kind: "XV.ListAttr", attr: "sequence", classes: "bold"},
                {kind: "XV.ListAttr", attr: "item.number", fit: true},
                {kind: "XV.ListAttr", attr: "quantity", classes: "right"},
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "item.description1",
                  fit: true,  style: "text-indent: 18px;"},
                {kind: "XV.ListAttr", attr: "unit.name",
                  classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // WORK ORDER ROUTINGS
    //

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
                {kind: "XV.ListAttr", attr: "quantity", classes: "right"},
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "productionUnit",
                  fit: true,  style: "text-indent: 18px;"},
                {kind: "XV.ListAttr", attr: "setupTime",
                  formatter: "formatSetup",
                  classes: "right"},
                {kind: "XV.ListAttr", attr: "runTime",
                  formatter: "formatSetup",
                  classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatRun: function (value) {
        return "_run".loc + ":" + Globalize.format(value, "n" + 2) + "_min".loc();
      },
      formatSetup: function (value) {
        return "_setup".loc + ":" + Globalize.format(value, "n" + 2) + "_min".loc();
      }
    });

  };

}());
