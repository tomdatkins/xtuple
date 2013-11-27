/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  XT.extensions.manufacturing.initListRelationsEditorBox = function () {

    // ..........................................................
    // POST PRODUCTION CREATE LOT/SERIAL/SELECT LOCATION
    //

    enyo.kind({
      name: "XV.PostProductionCreateLotSerialEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.QuantityWidget", attr: "quantity", name: "quantity", content: "qtyRemaining"},
          {kind: "XV.TraceCombobox", attr: "trace"},
          {kind: "XV.LocationPicker", attr: "location"},
          {kind: "XV.DateWidget", attr: "expireDate"},
          {kind: "XV.DateWidget", attr: "warrantyDate"}
          //{kind: "XV.CharacteristicTypePicker", attr: "characteristic"}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.PostProductionCreateLotSerialBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_lotSerial".loc(),
      editor: "XV.PostProductionCreateLotSerialEditor",
      parentKey: "itemSite",
      listRelations: "XV.PostProductionCreateLotSerialListRelations",
      events: {
        onDistributionLineDone: "",
        onDistributionLineNew: ""
      },
      doneItem: function () {
        this.inherited(arguments);
        if (this.getValue() ? this.getValue().length > 0 : false) {
          this.doDistributionLineDone();
        }
      },
      newItem: function () {
        this.inherited(arguments);
        if (this.getValue() ? this.getValue().length > 0 : false) {
          this.doDistributionLineNew();
        }
      }
    });

  };

}());
