{
  "name": "distribution_foundation",
  "version": "",
  "comment": "Distribution foundation",
  "loadOrder": 65,
  "defaultSchema": "xwd",
  "databaseScripts": [
    "update_version.sql",

    "xwd/patches/setMetrics.sql",

    "xwd/tables/pkgreport/Quote.xml",
    "xwd/tables/pkgreport/GrossMarginCommissions.xml",
    "xwd/tables/pkgreport/Invoice.xml",
    "xwd/tables/pkgreport/SalesOrderAcknowledgement.xml",

    "xwd/tables/pkguiform/catalog.ui",
    "xwd/tables/pkguiform/catalogList.ui",
    "xwd/tables/pkguiform/catalogListDiag.ui",
    "xwd/tables/pkguiform/catComm.ui",
    "xwd/tables/pkguiform/catComms.ui",
    "xwd/tables/pkguiform/catConfig.ui",
    "xwd/tables/pkguiform/catConfigs.ui",
    "xwd/tables/pkguiform/catConvert.ui",
    "xwd/tables/pkguiform/dspGrossMarginCommissions.ui",
    "xwd/tables/pkguiform/dspLostSales.ui",
    "xwd/tables/pkguiform/favorites.ui",
    "xwd/tables/pkguiform/itemAliasList.ui",
    "xwd/tables/pkguiform/lostSale.ui",
    "xwd/tables/pkguiform/salesOrderAddend.ui",
    "xwd/tables/pkguiform/smoothMargin.ui",

    "xwd/tables/pkgscript/initMenu.js",
    "xwd/tables/pkgscript/xwdErrors.js",
    "xwd/tables/pkgscript/catalog.js",
    "xwd/tables/pkgscript/catalogList.js",
    "xwd/tables/pkgscript/catalogListDiag.js",
    "xwd/tables/pkgscript/catComm.js",
    "xwd/tables/pkgscript/catComms.js",
    "xwd/tables/pkgscript/catConfig.js",
    "xwd/tables/pkgscript/catConfigs.js",
    "xwd/tables/pkgscript/catConvert.js",
    "xwd/tables/pkgscript/configureIM.js",
    "xwd/tables/pkgscript/creditMemoItem.js",
    "xwd/tables/pkgscript/distributeInventory.js",
    "xwd/tables/pkgscript/dspAllocations.js",
    "xwd/tables/pkgscript/dspGrossMarginCommissions.js",
    "xwd/tables/pkgscript/dspInventoryAvailability.js",
    "xwd/tables/pkgscript/dspInventoryAvailabilityByCustomerType.js",
    "xwd/tables/pkgscript/dspLostSales.js",
    "xwd/tables/pkgscript/dspPoItemReceivingsByVendor.js",
    "xwd/tables/pkgscript/dspPurchaseReqsByPlannerCode.js",
    "xwd/tables/pkgscript/favorites.js",
    "xwd/tables/pkgscript/item.js",
    "xwd/tables/pkgscript/itemAliasList.js",
    "xwd/tables/pkgscript/items.js",
    "xwd/tables/pkgscript/itemSites.js",
    "xwd/tables/pkgscript/itemSources.js",
    "xwd/tables/pkgscript/lostSale.js",
    "xwd/tables/pkgscript/purchaseOrder.js",
    "xwd/tables/pkgscript/purchaseOrderItem.js",
    "xwd/tables/pkgscript/salesOrder.js",
    "xwd/tables/pkgscript/salesOrderItem.js",
    "xwd/tables/pkgscript/setup.js",
    "xwd/tables/pkgscript/shipOrder.js",
    "xwd/tables/pkgscript/smoothMargin.js",
    "xwd/tables/pkgscript/unpostedPurchaseOrders.js",
    "xwd/tables/pkgscript/vendor.js",
    "xwd/tables/pkgscript/vendors.js",

    "xwd/tables/pkgmetasql/catalog-detail.mql",
    "xwd/tables/pkgmetasql/catcomm-detail.mql",
    "xwd/tables/pkgmetasql/customer-favorites.mql",
    "xwd/tables/pkgmetasql/inventoryAvailability-byCustOrSOxwd.mql",
    "xwd/tables/pkgmetasql/inventoryAvailability-generalxwd.mql",
    "xwd/tables/pkgmetasql/itemalias-search.mql",
    "xwd/tables/pkgmetasql/items-detailxwd.mql",
    "xwd/tables/pkgmetasql/itemSites-detailxwd.mql",
    "xwd/tables/pkgmetasql/itemSources-detailxwd.mql",
    "xwd/tables/pkgmetasql/lostSales-detail.mql",
    "xwd/tables/pkgmetasql/openpurchaseorders-freightallowed.mql",
    "xwd/tables/pkgmetasql/purchaseorder-purchaserequestsxwd.mql",
    "xwd/tables/pkgmetasql/receivings-detail.mql",
    "xwd/tables/pkgmetasql/salesHistory-commissions.mql",
    "xwd/tables/pkgmetasql/vendors-detailxwd.mql",

    "xwd/functions/calcpurchaseorderweight.sql",
    "xwd/functions/convertcatalog.sql",
    "xwd/functions/convertcatalogitemsrc.sql",
    "xwd/functions/convtoint.sql",
    "xwd/functions/convtonum.sql",
    "xwd/functions/copyvenditemsrc.sql",
    "xwd/functions/explodecomm.sql",
    "xwd/functions/findcommlevel.sql",
    "xwd/functions/importimageonly.sql",
    "xwd/functions/importpricesvc.sql",
    "xwd/functions/indentcomm.sql",
    "xwd/functions/issueorderavail.sql",
    "xwd/functions/itemcost.sql",
    "xwd/functions/movecoitemdown.sql",
    "xwd/functions/movecoitemup.sql",
    "xwd/functions/movepoitemdown.sql",
    "xwd/functions/movepoitemup.sql",
    "xwd/functions/movequitemdown.sql",
    "xwd/functions/movequitemup.sql",
    "xwd/functions/quickitemadd.sql",
    "xwd/functions/releasevendorpr.sql",
    "xwd/functions/smoothmargin.sql",
    "xwd/functions/updatecatalog.sql",
    "xwd/functions/updatecommlevel.sql",
    "xwd/functions/updateimages.sql",

    "xwd/trigger_functions/catcomm.sql",
    "xwd/trigger_functions/recv.sql"
  ]
}
