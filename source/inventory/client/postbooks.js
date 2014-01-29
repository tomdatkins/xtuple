/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  XT.extensions.inventory.initPostbooks = function () {
    var module,
      panels,
      relevantPrivileges,
			configurationJson,
			configuration;

    // ..........................................................
    // APPLICATION
    //

    // Extend Setup
    panels = [
      {name: "costCategoryList", kind: "XV.CostCategoryList"},
      {name: "customerTypeList", kind: "XV.CustomerTypeList"},
      {name: "expenseCategoryList", kind: "XV.ExpenseCategoryList"},
      {name: "itemList", kind: "XV.ItemList"},
      {name: "itemGroupList", kind: "XV.ItemGroupList"},
      {name: "itemSiteList", kind: "XV.ItemSiteList"},
      {name: "locationList", kind: "XV.LocationList"},
      {name: "plannerCodeList", kind: "XV.PlannerCodeList"},
      {name: "reasonCodeList", kind: "XV.ReasonCodeList"},
      {name: "siteEmailProfileList", kind: "XV.SiteEmailProfileList"},
      {name: "siteList", kind: "XV.SiteList"},
      {name: "siteTypeList", kind: "XV.SiteTypeList"}
    ];
    XT.app.$.postbooks.appendPanels("setup", panels);

    // Extend Purchasing
    if (XT.extensions.purchasing) {
      panels = [
        {name: "purchaseAvailabilityList", kind: "XV.InventoryAvailabilityList"}
      ];
      XT.app.$.postbooks.appendPanels("purchasing", panels);
    }

    // Extend Inventory
    module = {
      name: "inventory",
      label: "_inventory".loc(),
      panels: [
        {name: "inventoryAvailabilityList", kind: "XV.InventoryAvailabilityList"},
        {name: "transferOrderList", kind: "XV.TransferOrderList"},
        {name: "activityList", kind: "XV.ActivityList"},
        {name: "shipmentList", kind: "XV.ShipmentList"},
        {name: "inventoryHistoryList", kind: "XV.InventoryHistoryList"}
      ],
      actions: [
        {name: "itemWorkbench", privilege: "ViewItemAvailabilityWorkbench",
          method: "openItemWorkbench", notify: false},
        {name: "issueToShipping", privilege: "IssueStockToShipping",
          method: "issueToShipping", notify: false},
        {name: "enterReceipt", privilege: "EnterReceipts",
          method: "enterReceipt", notify: false}
      ],
      issueToShipping: function (inSender, inEvent) {
        inEvent.kind = "XV.IssueToShipping";
        inSender.bubbleUp("onTransactionList", inEvent, inSender);
      },
      enterReceipt: function (inSender, inEvent) {
        inEvent.kind = "XV.EnterReceipt";
        inSender.bubbleUp("onTransactionList", inEvent, inSender);
      },
      openItemWorkbench: function (inSender, inEvent) {
        inEvent.workspace = "XV.ItemWorkbenchWorkspace";
        inEvent.id = false; // Don't load an existing model or make a new one
        inSender.bubbleUp("onWorkspace", inEvent, inSender);
      }
    };
    XT.app.$.postbooks.insertModule(module, 0);

    // Add configuration
    configurationJson = {
      model: "XM.inventory",
      name: "_inventory".loc(),
      description: "_inventoryDescription".loc(),
      workspace: "XV.InventoryWorkspace"
    };
    configuration = new XM.ConfigurationModel(configurationJson);
    XM.configurations.add(configuration);

    relevantPrivileges = [
      "AlterTransactionDates",
      "CreateAdjustmentTrans",
      "CreateItemMasters",
      "CreateReceiptTrans",
      "DeleteItemMasters",
      "DeleteItemSites",
      "EnterReceipts",
      "EnterShippingInformation",
      "IssueStockToShipping",
      "MaintainCharacteristics",
      "MaintainCostCategories",
      "MaintainItemMasters",
      "MaintainItemSites",
      "MaintainItemGroups",
      "MaintainLocations",
      "MaintainPackingListBatch",
      "MaintainReasonCodes",
      "MaintainShipVias",
      "MaintainSiteEmailProfiles",
      "MaintainSiteTypes",
      "MaintainTerms",
      "MaintainTransferOrders",
      "MaintainWarehouses",
      "RecallInvoicedShipment",
      "RecallOrders",
      "ReturnStockFromShipping",
      "SelectBilling",
      "ShipOrders",
      "ViewCostCategories",
      "ViewInventoryValue",
      "ViewItemAvailabilityWorkbench",
      "ViewItemMasters",
      "ViewItemSites",
      "ViewLocations",
      "ViewQOH",
      "ViewShipping",
      "ViewPackingListBatch",
      "ViewCharacteristics",
      "ViewInventoryAvailability",
      "ViewInventoryHistory",
      "ViewTransferOrders",
      "ViewWarehouses",
      "ViewSiteTypes"
      //"CreateScrapTrans",
      //"PostCountSlips",
      //"EnterCountSlips",
      //"DeleteCountTags",
      //"ZeroCountTags",
      //"ViewCountTags",
      //"PostCountTags",
      //"PurgeCountSlips",
      //"PurgeCountTags",
      //"RelocateInventory",
      //"ReassignLotSerial",
      //"UpdateCycleCountFreq",
      //"UpdateLeadTime",
      //"SummarizeInventoryTransactions",
      //"ThawInventory",
      //"DeleteCountSlips",
      //"PrintBillsOfLading",
      //"PurgeShippingRecords",
      //"EnterReturns",
      //"UpdateOUTLevels",
      //"UpdateReorderLevels",
      //"CreateExpenseTrans",
      //"UpdateABCClass",
      //"FreezeInventory",
      //"EnterMiscCounts",
      //"IssueCountTags",
      //"EnterCountTags",
      //"MaintainExternalShipping",
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

  };
}());
