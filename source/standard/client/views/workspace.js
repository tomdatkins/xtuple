/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XV:true, enyo:true */

(function () {
  "use strict";

  XT.extensions.standard.initWorkspace = function () {

    var salesExtensions, preferencesExtensions;

    // can't guarantee that the sales extension is loaded
    if (XT.extensions.sales) {
      salesExtensions = [
        {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_multiSite".loc()},
        {kind: "XV.ToggleButtonWidget", container: "mainGroup", attr: "MultiWhs",
          label: "_enableMultipleSites".loc() }
      ];
      XV.appendExtension("XV.SalesWorkspace", salesExtensions);
    }

    preferencesExtensions = [
      {kind: "XV.SitePicker", container: "mainGroup", attr: "PreferredWarehouse",
        label: "_defaultSite".loc() }
    ];
    XV.appendExtension("XV.UserPreferenceWorkspace", preferencesExtensions);

    // Add support for Transfer Orders

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.mixin(XV.IssueStockWorkspace.prototype, {
      model: "XM.IssueToShippingMulti",
      kindComponents: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_order".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.OrderWidget", attr: "order"},
              {kind: "XV.ShipmentWidget", attr: "shipment"},
              {kind: "onyx.GroupboxHeader", content: "_item".loc()},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.QuantityWidget", attr: "ordered"},
              {kind: "XV.QuantityWidget", attr: "shipped"},
              {kind: "XV.QuantityWidget", attr: "returned"},
              {kind: "XV.QuantityWidget", attr: "balance"},
              {kind: "XV.QuantityWidget", attr: "atShipping"},
              {kind: "onyx.GroupboxHeader", content: "_issue".loc()},
              {kind: "XV.QuantityWidget", attr: "toIssue", name: "toIssue"},
            ]}
          ]},
          {kind: "XV.IssueToShippingDetailRelationsBox",
            attr: "itemSite.detail", name: "detail"}
        ]},
        {kind: "onyx.Popup", name: "distributePopup", centered: true,
          onHide: "popupHidden",
          modal: true, floating: true, components: [
          {content: "_quantity".loc()},
          {kind: "onyx.InputDecorator", components: [
            {kind: "onyx.Input", name: "quantityInput"}
          ]},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "distributeOk",
            classes: "onyx-blue xv-popup-button"},
          {kind: "onyx.Button", content: "_cancel".loc(), ontap: "distributeDone",
            classes: "xv-popup-button"},
        ]}
      ]
    });

    // ..........................................................
    // SHIPMENT
    //

    enyo.mixin(XV.ShipmentWorkspace.prototype, {
      model: "XM.ShipmentMulti",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "shipDate"},
              {kind: "XV.CheckboxWidget", attr: "isShipped"},
              {kind: "XV.ShipmentOrderWidget", attr: "order"},
              {kind: "XV.ShipViaCombobox", attr: "shipVia"},
              {kind: "XV.InputWidget", attr: "trackingNumber"},
              {kind: "XV.MoneyWidget",
                attr: {localValue: "freight", currency: "currency"},
                label: "_freight".loc()},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.ShipmentLineRelationsBox", attr: "lineItems"}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.ShipmentMultiListItem", "XV.ShipmentWorkspace");

    enyo.mixin(XV.ShipShipmentWorkspace.prototype, {
      model: "XM.ShipShipmentMulti",
      reportModel: "XM.ShipmentMulti",
      reportName: "Shipment",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "shipDate"},
              {kind: "XV.ShipmentOrderWidget", attr: "order"},
              {kind: "XV.MoneyWidget", label: "_value".loc(),
                attr: {localValue: "value", currency: "currency"}},
              {kind: "XV.ShipViaCombobox", attr: "shipVia"},
              {kind: "XV.InputWidget", attr: "trackingNumber"},
              {kind: "XV.MoneyWidget", label: "_freight".loc(),
                attr: {localValue: "freight", currency: "order.currency"}},
              {kind: "onyx.GroupboxHeader", content: "_options".loc()},
              {kind: "XV.StickyCheckboxWidget", label: "_printPacklist".loc(),
                name: "printPacklist"}
            ]}
          ]},
          {kind: "XV.ShipmentLineRelationsBox", attr: "lineItems"}
        ]}
      ]
    });

  };
}());
