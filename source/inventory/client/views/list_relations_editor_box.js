/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, _:true, XV:true, enyo:true*/

(function () {

  XT.extensions.inventory.initListRelationsEditorBox = function () {

    // ..........................................................
    // RECEIPT CREATE LOT/SERIAL/SELECT LOCATION
    //
    enyo.kind({
      name: "XV.ReceiptCreateLotSerialEditor",
      kind: "XV.RelationsEditor",
      handlers: {
        onBarcodeCapture: "captureBarcode"
      },
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.QuantityWidget", attr: "quantity", name: "quantity"},
          {kind: "XV.TraceWidget", attr: "trace", label: "_lot".loc()},
          {kind: "XV.LocationWidget", attr: "location"},
          {kind: "XV.DateWidget", attr: "expireDate"},
          {kind: "XV.DateWidget", attr: "warrantyDate"}
          //{kind: "XV.CharacteristicTypePicker", attr: "characteristic"}
        ]}
      ],
      /**
        Handle a barcode scan
      */
      captureBarcode: function (inSender, inEvent) {
        if (!this.value || !this.value.isReady()) {
          return this.doNotify({message: "_noDetailDistributionRecordSelected".loc()});
        }
        var that = this,
          model = that.value,
          scan = inEvent.data,
          trace = _.contains(model.requiredAttributes, "trace") ? model.getValue("trace") : true,
          location = _.contains(model.requiredAttributes, "location") ? model.getValue("location")
            : true;

        // Rules:
        if (!trace) { // If trace is required and not populated yet, handle scan data as trace
          model.setValue("trace", scan);
        } else if (trace && !location) { // else if location is required and null, populate as loc.
          that.$.locationWidget.fetchCollection(scan, 1, function (resp) {
            if (!resp.models.length) {
              return that.doNotify({message: "_locationScanReqMessage".loc() + scan});
            } else if (resp.models.length > 1) {
              return that.doNotify({message: "_multipleLocationModels".loc()});
            }
            that.$.locationWidget.setValue(resp.models[0]);
          });
        } else if (trace && location) {
          that.doNotify({
            message: "_requiredDetailFulfilled".loc(),
            type: XM.Model.OK
          });
        }

        return true;
      }
    });

    enyo.kind({
      name: "XV.ReceiptCreateLotSerialBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_distribute".loc(),
      editor: "XV.ReceiptCreateLotSerialEditor",
      parentKey: "itemSite",
      listRelations: "XV.ReceiptCreateLotSerialListRelations",
      events: {
        onDistributionLineDone: ""
      },
      doneItem: function () {
        this.inherited(arguments);
        if (this.getValue() ? this.getValue().length > 0 : false) {
          this.doDistributionLineDone();
        }
      }
    });

    // ..........................................................
    // SALES ORDER LINE
    //

    XV.SalesOrderLineItemEditor.notify = XV.SalesOrderNotify;

    // ..........................................................
    // TRANSFER ORDER LINE
    //

    enyo.kind({
      name: "XV.TransferOrderLineEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "lineNumber"},
          {kind: "XV.ItemWidget", attr: "item"},
          {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
          {kind: "XV.QuantityWidget", attr: "quantity", label: "_ordered".loc()},
          {kind: "XV.QuantityWidget", attr: "shipped"},
          {kind: "XV.QuantityWidget", attr: "received"},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", attr: "scheduleDate"},
          {kind: "XV.DateWidget", attr: "promiseDate"},
          {kind: "onyx.GroupboxHeader", content: "_cost".loc()},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "unitCost"},
            label: "_freight".loc(), currencyShowing: false},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.TransferOrderLineBox",
      kind: "XV.ListRelationsEditorBox",
      classes: "xv-list-relations-box",
      title: "_lines".loc(),
      editor: "XV.TransferOrderLineEditor",
      parentKey: "transferOrder",
      listRelations: "XV.TransferOrderLineListRelations",
      fitButtons: false
    });

  };

}());
