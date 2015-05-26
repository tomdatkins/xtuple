/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, _:true*/

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
        {name: "purchaseAvailabilityList", kind: "XV.InventoryAvailabilityList"},
        {name: "purchaseRequestList", kind: "XV.PurchaseRequestList"}
      ];
      XT.app.$.postbooks.appendPanels("purchasing", panels);
    }

    // Extend Inventory
    module = {
      name: "inventory",
      label: "_inventory".loc(),
      panels: [
        {name: "inventoryAvailabilityList", kind: "XV.InventoryAvailabilityList"},
        {name: "plannedOrderList", kind: "XV.PlannedOrderList"},
        {name: "transferOrderList", kind: "XV.TransferOrderList"},
        {name: "inventory_activityList", kind: "XV.ActivityList"},
        {name: "shipmentList", kind: "XV.ShipmentList"},
        {name: "inventoryHistoryList", kind: "XV.InventoryHistoryList",
          toggleSelected: false}
      ],
      actions: [
        {name: "itemWorkbench", privilege: "ViewItemAvailabilityWorkbench",
          method: "openItemWorkbench", notify: false},
        {name: "issueToShipping", privilege: "IssueStockToShipping",
          method: "issueToShipping", notify: false},
        {name: "enterReceipt", privilege: "EnterReceipts",
          method: "enterReceipt", notify: false},
        {name: "scrapTransaction", privilege: "CreateScrapTrans",
          method: "scrapTransaction", notify: false},
        {name: "relocate", privilege: "RelocateInventory",
          method: "relocateInventory", notify: false}
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
        inSender.bubbleUp("onWorkspace", inEvent, inSender);
      },
      scrapTransaction: function (inSender, inEvent) {
        inEvent.workspace = "XV.ScrapTransactionWorkspace";
        inSender.bubbleUp("onWorkspace", inEvent, inSender);
      },
      relocateInventory: function (inSender, inEvent) {
        inEvent.workspace = "XV.RelocateInventoryWorkspace";
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
      "CreatePlannedOrders",
      "CreateItemMasters",
      "CreateReceiptTrans",
      "DeleteItemMasters",
      "DeleteItemSites",
      "DeletePlannedOrders",
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
      "MaintainPurchaseRequests",
      "MaintainReasonCodes",
      "MaintainShipVias",
      "MaintainSiteEmailProfiles",
      "MaintainSiteTypes",
      "MaintainTerms",
      "MaintainTransferOrders",
      "MaintainWarehouses",
      "RecallInvoicedShipment",
      "RecallOrders",
      "ReleasePlannedOrders",
      "ReturnStockFromShipping",
      "SelectBilling",
      "ShipOrders",
      "SoftenPlannedOrders",
      "ViewCostCategories",
      "ViewInventoryValue",
      "ViewItemAvailabilityWorkbench",
      "ViewItemMasters",
      "ViewItemSites",
      "ViewLocations",
      "ViewPlannedOrders",
      "ViewQOH",
      "ViewShipping",
      "ViewShipVias",
      "ViewPackingListBatch",
      "ViewPurchaseRequests",
      "ViewCharacteristics",
      "ViewInventoryAvailability",
      "ViewInventoryHistory",
      "ViewTransferOrders",
      "ViewWarehouses",
      "ViewSiteTypes",
      "CreateScrapTrans",
      //"PostCountSlips",
      //"EnterCountSlips",
      //"DeleteCountTags",
      //"ZeroCountTags",
      //"ViewCountTags",
      //"PostCountTags",
      //"PurgeCountSlips",
      //"PurgeCountTags",
      "RelocateInventory",
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
    XT.session.privilegeSegments.plannedOrder = [
      "CreatePlannedOrders",
      "DeletePlannedOrders",
      "FirmPlannedOrders",
      "ReleasePlannedOrders",
      "SoftenPlannedOrders",
      "ViewPlannedOrders"
    ];


    //
    // Add barcode scanner key capture to XT.app
    //
    XV.App.prototype.captureBarcodeScanner = function (value) {
      this.$.postbooks.getActive().waterfall("onBarcodeCapture", {data: value});
    };

    XM.Tuplespace.once("activate", function () {
      var formatSetting = function (s) {
          if (!_.isNaN(parseInt(s, 10))) {
            // if it looks like a number, treat it as a number
            return [parseInt(s, 10)];
          }
          // otherwise convert the each char of the string to ascii and return an array of integers
          return _.map(s.split(""), function (c) {
            return c.charCodeAt(0);
          });
        },
        prefix = formatSetting(XT.session.settings.get("BarcodeScannerPrefix")),
        suffix = formatSetting(XT.session.settings.get("BarcodeScannerSuffix"));

      XT.app.getKeyCapturePatterns().push({method: "captureBarcodeScanner", start: prefix, end: suffix});
    });
  };
}());
