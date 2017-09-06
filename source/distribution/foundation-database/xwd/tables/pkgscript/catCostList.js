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

include("storedProcErrorLookup");
include("xwdErrors");
mywindow.setWindowTitle(qsTr("Display CatCosts"));
mywindow.setMetaSQLOptions('catcost', 'detail');
mywindow.setQueryOnStartEnabled(true);
mywindow.setSearchVisible(true);

var _parameterWidget     = mywindow.findChild("_parameterWidget");
var _catcost_id          = mywindow.findChild("_catcost_id");
var _catcost_item_number = mywindow.findChild("_catcost_item_number");
var _provider            = mywindow.findChild("_provider");

var _list = mywindow.list();

_list.addColumn(qsTr("Item #"),           -1, Qt.AlignLeft,   true,  "catcost_item_number"   );
_list.addColumn(qsTr("Wholesale Price"),  -1, Qt.AlignLeft,   true,  "wholesale_price"   );
_list.addColumn(qsTr("Price UOM"),        -1, Qt.AlignLeft,   true,  "catcost_price_uom"   );
_list.addColumn(qsTr("PO Cost"),          -1, Qt.AlignRight,  true,  "po_cost"  );
_list.addColumn(qsTr("PO UOM"),           -1, Qt.AlignRight,  true,  "catcost_po_uom"  );
_list.addColumn(qsTr("PO QTY BREAK"),     -1, Qt.AlignRight,  true,  "qtybreak"  );
_list.addColumn(qsTr("Vendor"),           -1, Qt.AlignRight,  true,  "catcost_vend_number"  );
_list.addColumn(qsTr("INV TO UOM Ratio"), -1, Qt.AlignRight,  true,  "catcost_invvendoruomratio"  );
_list.addColumn(qsTr("PO-WHS"),           -1, Qt.AlignRight,  true,  "warehous_code"  );
_list.addColumn(qsTr("Provider"),         -1, Qt.AlignRight,  true,  "provider"  );

mywindow.setParameterWidgetVisible(false);

var _updatecatcost=toolbox.createWidget("QToolButton", mywindow.toolBar(), "_updatecatcost");
_updatecatcost.text=qsTr("Populate CatCost");
var _updatecatcostAct=mywindow.toolBar().insertWidget(mywindow.querySeparator(), _updatecatcost);

var _deletecatcost=toolbox.createWidget("QToolButton", mywindow.toolBar(), "_deletecatcost");
_deletecatcost.text=qsTr("Clear CatCost Table");
var _deletecatcostAct=mywindow.toolBar().insertWidget(mywindow.querySeparator(), _deletecatcost);

var _updateitems=toolbox.createWidget("QToolButton", mywindow.toolBar(), "_updateitems");
_updateitems.text=qsTr("Update All Items From Catcost");
var _updateitemsAct=mywindow.toolBar().insertWidget(mywindow.querySeparator(), _updateitems);

function sUpdateCatCost()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Update CatCost?"),
                             qsTr("Are you sure you want to overwrite Catalog Costs "
                                + "with your current Item Costs?"),
                             QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.Yes))
    {
      var qry = toolbox.executeQuery("SELECT xwd.populatecatcostitems();");
      if (qry.lastError().type != QSqlError.NoError)
      {
        throw new Error(qry);
      }
      mywindow.sFillList();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList", "sUpdateCatCost exception: " + e);
  }
}

function sDeleteCatCost()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Delete All CatCost Items?"),
                             qsTr("Are you sure you want to clear the Catalog Costs?"),
                             QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.Yes)
    {
      var qry = toolbox.executeQuery("DELETE FROM xwd.catcost;");
      if (qry.lastError().type != QSqlError.NoError)
      {
        throw new Error(qry);
      }
      mywindow.sFillList();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList", "sDeleteCatCost exception: " + e);
  }
}

function sUpdateItems()
{
  try
  {
    var qry = "SELECT catconfig_provider"
            + "  FROM xwd.catconfig "
            + " ORDER BY catconfig_provider;";

    var data = toolbox.executeQuery(qry);
    if (data.lastError().type != QSqlError.NoError)
    {
      throw new Error(data.lastError().text);
    }
    while (data.next())
    {
      if (QMessageBox.question(mywindow, qsTr("Update item data?"),
                               qsTr("Are you sure you want to update all Catalog Costs using Provider %1?")
                                   .arg(data.value("catconfig_provider")),
                               QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.Yes)
      {
        var qry = toolbox.executeQuery("SELECT xwd.updatecatalog(<? value('catconfig_provider') ?>,'F','F');",
                                       { catconfig_provider: data.value("catconfig_provider") });

        if (qry.lastError().type != QSqlError.NoError)
        {
          throw new Error(qry.lastError().text);
        }
      }
      mywindow.sFillList();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList", "sUpdateitems exception: " + e);
  }
}

function sPopulateMenu(pMenu, pItem, pCol)
{
  try
  {
    var tmpact;

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

      tmpact = pMenu.addAction(qsTr("Delete CatCost Item..."));
      tmpact.enabled = (privileges.check("MaintainCatCost"));
      tmpact.triggered.connect(sDeleteItem);
    }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "catCostList", "sPopulateMenu exception: " + e);
  }
}

function opencatCost(params)
{
  try
  {
    var wnd = toolbox.openWindow("catCost", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    wnd.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList", "opencatCost exception: " + e);
  }
}

function sEdit()
{
  try
  {
    opencatCost( { mode: "edit", catcost_id: _list.id() } );
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList", "sEdit exception: " + e);
  }
}

function sView()
{
  try
  {
    opencatCost( { mode: "view", catcost_id: _list.id() } );
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList", "sView exception: " + e);
  }
}

function sUpdateItem()
{
  try
  {
    var qry = toolbox.executeQuery("SELECT xwd.updatecatcostitem(<? value('catcost_id') ?>);",
                                   { catcost_id = _list.id() });
    if (qry.lastError().type != QSqlError.NoError)
    {
      throw new Error(qry.lastError().text);
    }
    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList", "sUpdateItem exception: " + e);
  }
}

function sDeleteItem()
{
  try
  {
    var qry = toolbox.executeQuery("DELETE FROM xwd.catcost WHERE catcost_id = (<? value('catcost_id') ?>);",
                                   { catcost_id: _list.id() });
    if (qry.lastError().type != QSqlError.NoError)
    {
      throw new Error(qry.lastError().text);
    }
    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCostList", "sDeleteItem exception: " + e);
  }
}


if (privileges.check("MaintainCatCost"))
{
  _list.itemSelected.connect(sEdit);
}
else if (privileges.check("ViewCatCost"))
{
  _list.itemSelected.connect(sView);
}

_list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(sPopulateMenu)
_updatecatcost.clicked.connect(sUpdateCatCost);
_deletecatcost.clicked.connect(sDeleteCatCost);
_updateitems.clicked.connect(sUpdateItems);
