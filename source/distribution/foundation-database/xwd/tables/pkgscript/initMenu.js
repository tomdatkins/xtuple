/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

//debugger;

var tmpaction;

function sVendorCatalogList()
{
  try {
    toolbox.openWindow("catalogList", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sVendorCatalogList() exception @ " + e.lineNumber + ": " + e);
  }
}

function sCatCost()
{
  try {
    toolbox.newDisplay("catCostList", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sCatCost() exception @ " + e.lineNumber + ": " + e);
  }
}

function sVendorCatCommList()
{
  try {
    toolbox.openWindow("catComms", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sVendorCatCommList() exception @ " + e.lineNumber + ": " + e);
  }
}

function sGrossMarginCommissions()
{
  try {
    toolbox.newDisplay("dspGrossMarginCommissions", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sGrossMarginCommissions() exception @ " + e.lineNumber + ": " + e);
  }
}

function sLostSales()
{
  try {
    toolbox.newDisplay("dspLostSales", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sLostSales() exception @ " + e.lineNumber + ": " + e);
  }
}

try
{
  var menuProducts = mainwindow.findChild("menu.prod");
  var productItemsMenu = mainwindow.findChild("menu.prod.items");
  productItemsMenu.addSeparator();

  var tmpaction = productItemsMenu.addAction(qsTranslate("menuProducts", "External Vendor Catalog..."));
  tmpaction.enabled = privileges.value("ViewCatalog");
  tmpaction.setData("ViewCatalog");
  tmpaction.objectName = "prod.catalogList";
  tmpaction.triggered.connect(sVendorCatalogList);

  var tmpaction = productItemsMenu.addAction(qsTranslate("menuProducts", "Catalog Cost..."));
  tmpaction.enabled = privileges.value("ViewCatCost");
  tmpaction.setData("ViewCatCost");
  tmpaction.objectName = "prod.catcost";
  tmpaction.triggered.connect(sCatCost);

  var tmpaction = productItemsMenu.addAction(qsTranslate("menuProducts", "External Vendor Commodity Codes..."));
  tmpaction.enabled = privileges.value("ViewCatalog");
  tmpaction.setData("ViewCatalog");
  tmpaction.objectName = "prod.catComms";
  tmpaction.triggered.connect(sVendorCatCommList);

  var menuSales = mainwindow.findChild("menu.sales");
  var salesReportsMenu = mainwindow.findChild("menu.sales.reports");

//  salesReportsMenu.removeAction(mainwindow.findChild("so.dspEarnedCommissions"));
//  salesReportsMenu.removeAction(mainwindow.findChild("so.dspBriefEarnedCommissions"));
  var tmpaction = salesReportsMenu.addAction(qsTranslate("menuSales", "Gross Margin Commissions..."));
  tmpaction.enabled = privileges.value("ViewMarginCommissions");
  tmpaction.setData("ViewMarginCommissions");
  tmpaction.objectName = "so.grossMarginCommissions";
  tmpaction.triggered.connect(sGrossMarginCommissions);
  salesReportsMenu.insertAction(mainwindow.findChild("so.dspTaxHistory"), tmpaction);

  var tmpaction = salesReportsMenu.addAction(qsTranslate("menuSales", "Lost Sales..."));
  tmpaction.enabled = privileges.value("ViewSalesHistory");
  tmpaction.setData("ViewSalesHistory");
  tmpaction.objectName = "so.listSales";
  tmpaction.triggered.connect(sLostSales);
  salesReportsMenu.insertAction(mainwindow.findChild("so.dspTaxHistory"), tmpaction);
  } catch (e) {
    print("initMenu::xwd exception @ " + e.lineNumber + ": " + e);
  }
