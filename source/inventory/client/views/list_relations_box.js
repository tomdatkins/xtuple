/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global  enyo:true, XT: true */

(function () {

  XT.extensions.inventory.initListRelationsBox = function () {

    // ..........................................................
    // INVENTORY HISTORY DETAIL
    //

    enyo.kind({
      name: "XV.InventoryHistoryDetailBox",
      kind: "XV.ListRelationsBox",
      title: "_detail".loc(),
      parentKey: "detail",
      listRelations: "XV.InventoryHistoryDetailListRelations",
      canOpen: false
    });

    // ..........................................................
    // INVENTORY WORKBENCH AVAILABILITY
    //

    enyo.kind({
      name: "XV.ItemWorkbenchAvailabilityBox",
      style: "width: 500px",
      kind: "XV.ListRelationsBox",
      title: "_availability".loc(),
      parentKey: "item",
      canOpen: false,
      listRelations: "XV.ItemWorkbenchAvailabilityListRelations"
    });

    // ..........................................................
    // INVENTORY WORKBENCH ORDERS
    //

    enyo.kind({
      name: "XV.ItemWorkbenchOrdersBox",
      classes: "small-panel",
      kind: "XV.ListRelationsBox",
      title: "_orders".loc(),
      parentKey: "item",
      canOpen: false,
      handlers: {
        onValueChange: "filterValueChanged"
      },
      filterComponents: [
        {kind: "XV.StickyCheckboxWidget", label: "_supply".loc(),
          name: "showSupplyOrders", checked: true},
        {kind: "XV.StickyCheckboxWidget", label: "_demand".loc(),
          name: "showDemandOrders", checked: true},
        {kind: "XV.StickyCheckboxWidget", label: "_planned".loc(),
          name: "showPlannedOrders", checked: true}
      ],
      listRelations: "XV.ItemWorkbenchOrdersListRelations",
      setValue: function () {
        this.inherited(arguments);
        if (this.value && this.value.item) {
          this.value.item.setValue({
            showSupplyOrders: this.$.showSupplyOrders.checked,
            showDemandOrders: this.$.showDemandOrders.checked,
            showPlannedOrders: this.$.showPlannedOrders.checked
          });
        }
      },
      filterValueChanged: function (inSender, inEvent) {
        var name = inEvent.originator.name,
          item = this.value ? this.value.item : false;

        if (!item) { return; }

        switch (name)
        {
        case "showSupplyOrders":
          item.setValue("showSupplyOrders", this.$.showSupplyOrders.checked);
          break;
        case"showDemandOrders":
          item.setValue("showDemandOrders", this.$.showDemandOrders.checked);
          break;
        case"showPlannedOrders":
          item.setValue("showDemandOrders", this.$.showDemandOrders.checked);
          break;
        default:
          return;
        }

        return true;
      }
    });

    // ..........................................................
    // ISSUE TO SHIPPING LOCATIONS
    //

    enyo.kind({
      name: "XV.IssueStockDetailRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_detail".loc(),
      parentKey: "itemSite",
      listRelations: "XV.IssueStockDetailListRelations",
      canOpen: false,
      events: {
        onDetailSelectionChanged: ""
      },
      selectionChanged: function (inSender, inEvent) {
        var index = inEvent.index;
        this.doDetailSelectionChanged({
          index: index,
          model: this.$.list.readyModels()[index],
          isSelected: inEvent.originator.isSelected(index)
        });
      }
    });

    // ..........................................................
    // ITEM SITE
    //

    enyo.kind({
      name: "XV.ItemSiteRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_sites".loc(),
      parentKey: "item",
      listRelations: "XV.ItemSiteListRelations"
    });

    // ..........................................................
    // SHIPMENT LINE
    //

    enyo.kind({
      name: "XV.ShipmentLineRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_lineItems".loc(),
      parentKey: "shipment",
      listRelations: "XV.ShipmentLineListRelations",
      canOpen: false
    });

  };

}());
