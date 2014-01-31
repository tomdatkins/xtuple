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
    // INVENTORY WORKBENCH ORDERS
    //

    enyo.kind({
      name: "XV.ItemWorkbenchOrdersBox",
      kind: "XV.ListRelationsBox",
      title: "_orders".loc(),
      parentKey: "item",
      listRelations: "XV.ItemWorkbenchOrdersListRelations"
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
