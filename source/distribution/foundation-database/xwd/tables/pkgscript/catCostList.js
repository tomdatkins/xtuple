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
}
catch (e)
{
  QMessageBox.critical(mywindow, "catCostList",
                       "catCostList.js exception: " + e);
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
