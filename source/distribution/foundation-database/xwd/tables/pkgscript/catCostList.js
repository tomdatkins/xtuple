/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

debugger;

include("storedProcErrorLookup");
include("xwdErrors");

try
{
  mywindow.setWindowTitle(qsTr("Vendor Catalog Costs"));
  mywindow.setMetaSQLOptions('catcost','detail');
  mywindow.setQueryOnStartEnabled(true);
  mywindow.setSearchVisible(true);
  mywindow.setUseAltId(true);
  mywindow.setParameterWidgetVisible(false);
 
  var _list = mywindow.list();
  _list.addColumn(qsTr("Item #"),           XTreeWidget.itemColumn,    Qt.AlignLeft,    true,  "catcost_item_number"   );
  _list.addColumn(qsTr("Wholesale Price"),  XTreeWidget.itemColumn,    Qt.AlignRight,   true,  "catcost_wholesale_price"   );
  _list.addColumn(qsTr("Price UOM"),        XTreeWidget.itemColumn,    Qt.AlignCenter,  true,  "catcost_price_uom"   );
  _list.addColumn(qsTr("Item Number"),      XTreeWidget.itemColumn,    Qt.AlignLeft,    true,  "catcost_item_number"   );
  _list.addColumn(qsTr("PO Cost"),          XTreeWidget.moneyColumn,   Qt.AlignRight,   true,  "catcost_po_cost"  );
  _list.addColumn(qsTr("PO UOM"),           XTreeWidget.itemColumn,    Qt.AlignCenter,  true,  "catcost_po_uom"  );
  _list.addColumn(qsTr("PO Qty Break"),     XTreeWidget.qtyColumn,     Qt.AlignRight,   true,  "catcost_itemsrcp_qtybreak"  );
  _list.addColumn(qsTr("Vendor"),           XTreeWidget.itemColumn,    Qt.AlignLeft,    true,  "catcost_vend_number"  );
  _list.addColumn(qsTr("Inv To UOM Ratio"), XTreeWidget.itemColumn,    Qt.AlignRight,   true,  "catcost_cost_invvendoruomratio"  );
  _list.addColumn(qsTr("Item ID"),          XTreeWidget.itemColumn,    Qt.AlignRight,   true,  "catcost_id"  );

  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(sPopulateMenu)

  var _importCatCosts=toolbox.createWidget("QToolButton", mywindow.toolBar(), "_importCatCosts");
  _importCatCosts.text=qsTr("Import Cat Costs");
  var _importCatCostsAct=mywindow.toolBar().insertWidget(mywindow.querySeparator(), _importCatCosts);
  _importCatCosts.clicked.connect(sImportCatCosts);

  var _deleteCatCosts=toolbox.createWidget("QToolButton", mywindow.toolBar(), "_deleteCatCosts");
  _deleteCatCosts.text=qsTr("Delete Cat Costs");
   var _deleteCatCostsAct=mywindow.toolBar().insertWidget(mywindow.querySeparator(), _deleteCatCosts);
  _deleteCatCosts.clicked.connect(sDeleteCatCosts);

  var _updateCatalog=toolbox.createWidget("QToolButton", mywindow.toolBar(), "_updateCatalog");
  _updateCatalog.text=qsTr("Update Catalog");
  var _updateCatalogAct=mywindow.toolBar().insertWidget(mywindow.querySeparator(), _updateCatalog);
  _updateCatalog.clicked.connect(sUpdateCatalog);

  if(privileges.check("MaintainCatCost"))
  {
    _list.itemSelected.connect(sEdit);
  }
  else if(privileges.check("ViewCatCost"))
  {
    _list.itemSelected.connect(sView);
  }
}
catch (e)
{
  QMessageBox.critical(mywindow, "catCostList",
                       "catCostList.js exception: " + e);
}

function sImportCatCosts()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Import Cat Costs?"),
                          qsTr("This will import Cat Costs from your current Item Pricing."),
                          QMessageBox.No, QMessageBox.Yes | QMessageBox.Default) == QMessageBox.Yes)
    {
      var data = toolbox.executeQuery("SELECT xwd.importCatCosts();");
      if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        return;
      }

      mywindow.sFillList();
    }

    return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList",
                         "sImportCatCost exception: " + e);
  }
}

function sDeleteCatCosts()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Delete All Cat Costs?"),
                          qsTr("This will delete all Cat Costs. Use Import Cat Costs to "
                             + "populate with your current Item Pricing."),
                          QMessageBox.No, QMessageBox.Yes | QMessageBox.Default) == QMessageBox.Yes)       
    {
      var data = toolbox.executeQuery("SELECT xwd.deleteCatCosts();");
      if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        return;
      }

      mywindow.sFillList();
    }

    return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList",
                         "sDeleteCatCosts exception: " + e);
  }
}

function sUpdateCatalog()
{
  try
  {
    var qry = "SELECT catconfig_provider "
            + "FROM xwd.catconfig "
            + "ORDER BY catconfig_provider;";

    var data = toolbox.executeQuery(qry);
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }

    while (data.next())
    {
      if (QMessageBox.question(mywindow, qsTr("Update your current Item data?"),
                               qsTr("Update Catalog Item data using Provider %1?")
                               .arg(data.value("catconfig_provider")),
                               QMessageBox.Yes, QMessageBox.No | QMessageBox.Default) == QMessageBox.Yes)       
      {
        data2 = toolbox.executeQuery("SELECT xwd.updateCatalog(<? value('catconfig_provider') ?>, "
                                  + "false, false);",
                                     { catconfig_provider: data.value("catconfig_provider") });
        if (data2.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"),
                               data2.lastError().text);
          return;
        }
      }
    }

    mywindow.sFillList();
    return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList",
                         "sUpdateCatalog exception: " + e);
  }
}

function sPopulateMenu(pMenu, pItem, pCol)
{
  try
  {
    if(pMenu == null)
      pMenu = _list.findChild("_menu");

    if(pMenu != null)
    {
      tmpact = pMenu.addAction(qsTr("Edit..."));
      tmpact.enabled = (privileges.check("MaintainCatCost"));
      tmpact.triggered.connect(sEdit);

      tmpact = pMenu.addAction(qsTr("View..."));
      tmpact.enabled = (privileges.check("MaintainCatCost") || privileges.check("ViewCatCost"));
      tmpact.triggered.connect(sView);

      tmpact = pMenu.addAction(qsTr("Update Item..."));
      tmpact.enabled = (privileges.check("MaintainCatCost"));
      tmpact.triggered.connect(sUpdateItem);

      tmpact = pMenu.addAction(qsTr("Delete Item..."));
      tmpact.enabled = (privileges.check("MaintainCatCost"));
      tmpact.triggered.connect(sDeleteItem);
     }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "catCostList",
                         "sPopulateMenu exception: " + e);
  }
}

function openCatCost(params)
{
  try
  {
    var wnd = toolbox.openWindow("catCost", mywindow, Qt.ApplicationModal, Qt.Dialog);
    var tmp = toolbox.lastWindow().set(params);
    wnd.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList",
                         "openCatcost exception: " + e);
  }
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.catcost_id = _list.id();  

  openCatCost(params);
  mywindow.sFillList();	
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.catcost_id = _list.id();

  openCatCost(params);
}

function sUpdateItem()
{
  try
  {
    var data = toolbox.executeQuery("SELECT xwd.updateCatCostItem(<? value('catcost_id') ?>);",
                                    { catcost_id: _list.id() });
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }

    mywindow.sFillList();
    return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList",
                         "sUpdateItem exception: " + e);
  }
}

function sDeleteItem()
{
  try
  {
    var data = toolbox.executeQuery("SELECT xwd.deleteCatCostItem(<? value('catcost_id') ?>);",
                                    { catcost_id: _list.id() });
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }

    mywindow.sFillList();
    return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList",
                         "sDeleteItem exception: " + e);
  }
}
