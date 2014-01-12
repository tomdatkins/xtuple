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
      {name: "siteEmailProvileList", kind: "XV.SiteEmailProfileList"},
      {name: "siteList", kind: "XV.SiteList"},
      {name: "siteTypeList", kind: "XV.SiteTypeList"},
      {name: "termsList", kind: "XV.TermsList"}
    ];
    XT.app.$.postbooks.appendPanels("setup", panels);


    configurationJson = {
      model: "XM.inventory",
      name: "_inventory".loc(),
      description: "_inventoryDescription".loc(),
      workspace: "XV.InventoryWorkspace"
    };
    configuration = new XM.ConfigurationModel(configurationJson);
    XM.configurations.add(configuration);

    module = {
      name: "inventory",
      label: "_inventory".loc(),
      panels: [
        {name: "transferOrderList", kind: "XV.TransferOrderList"},
        {name: "activityList", kind: "XV.ActivityList"},
        {name: "shipmentList", kind: "XV.ShipmentList"},
        {name: "inventoryHistoryList", kind: "XV.InventoryHistoryList"}
      ],
      actions: [
        {name: "issueToShipping", privilege: "issueStockToShipping", method: "issueToShipping", notify: false},
        {name: "enterReceipt", privilege: "enterReceipts", method: "enterReceipt", notify: false}
      ],
      issueToShipping: function (inSender, inEvent) {
        inSender.bubbleUp("onIssueToShipping", inEvent, inSender);
      },
      enterReceipt: function (inSender, inEvent) {
        inSender.bubbleUp("onEnterReceipt", inEvent, inSender);
      }

    };
    XT.app.$.postbooks.insertModule(module, 0);

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
      "ShipOrders",
      "ViewCostCategories",
      "ViewInventoryValue",
      "ViewItemMasters",
      "ViewItemSites",
      "ViewLocations",
      "ViewQOH",
      "ViewShipping",
      "ViewPackingListBatch",
      "ViewCharacteristics",
      "ViewInventoryHistory",
      "ViewTransferOrders",
      "ViewWarehouses",
      "ViewSiteTypes"
      //"CreateScrapTrans",
      //"ViewInventoryAvailability",
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
      //"ViewItemAvailabilityWorkbench",
      //"UpdateABCClass",
      //"FreezeInventory",
      //"EnterMiscCounts",
      //"IssueCountTags",
      //"EnterCountTags",
      //"MaintainExternalShipping",
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

    // Postbooks level handler for the thing that is neither fish nor fowl
    XT.app.$.postbooks.handlers.onIssueToShipping = "issueToShipping";
    XT.app.$.postbooks.issueToShipping = function (inSender, inEvent) {
      var panel = this.createComponent({kind: "XV.IssueToShipping"});

      panel.render();
      this.reflow();
      if (inEvent.key) {
        panel.$.parameterWidget.$.order.setValue(inEvent.key);
      }
      this.setIndex(this.getPanels().length - 1);

      return true;
    };

    //Receive Purchase Order using Action button in nav bar at top
    XT.app.$.postbooks.handlers.onEnterReceipt = "enterReceipt";
    XT.app.$.postbooks.enterReceipt = function (inSender, inEvent) {
      var panel = this.createComponent({kind: "XV.EnterReceipt"});

      panel.render();
      this.reflow();
      if (inEvent.key) {
        panel.$.parameterWidget.$.order.setValue(inEvent.key);
      }
      this.setIndex(this.getPanels().length - 1);

      return true;
    };

  };
}());