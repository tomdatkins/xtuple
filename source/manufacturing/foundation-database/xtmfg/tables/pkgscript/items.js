/*
This file is part of the xtmfg Package for xTuple ERP,
and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
is licensed to you under the xTuple End-User License Agreement ("the
EULA"), the full text of which is available at www.xtuple.com/EULA.
While the EULA gives you access to source code and encourages your
involvement in the development process, this Package is not free
software.  By using this software, you agree to be bound by the
terms of the EULA.
*/

include("storedProcErrorLookup");
include("xtmfgErrors");

var _delete = mywindow.findChild("_delete");
var _list   = mywindow.list();

function sDelete()
{
  if (QMessageBox.question(mywindow, qsTr("Delete Item?"),
                           qsTr("Are you sure you want to delete this item?"),
                           QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
    return;

  var params = new Object;
  params.item_id = _list.id();
  var q = toolbox.executeQuery('SELECT xtmfg.deleteItem(<? value("item_id") ?>) AS result;',
                               params);
  if (q.first())
  {
    var result = q.value("result");
    if (result < 0)
    {
      QMessageBox.critical(mywindow, qsTr("Processing Error"),
                           storedProcErrorLookup("deleteItem", result, xtmfgErrors));
      return;
    }
    mainwindow.sBOMsUpdated(_list.id(), true);
    mainwindow.sBOOsUpdated(_list.id(), true);
  }
  else if (q.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), q.lastError().text);
    return;
  }
  mywindow.sFillList();
}

function sPopulateMenu(pMenu, pItem, pCol)
{
  try {
    if(pMenu == null)
      pMenu = _list.findChild("_menu");
  
    if(pMenu != null)
    {
      if (metrics.boolean("Routings") && pItem.rawValue("item_type") == "M")
      {
        var tmpact = pMenu.addAction(qsTr("Edit Item Routing..."));
        tmpact.enabled = privileges.check("MaintainBOOs");
        tmpact.triggered.connect(sEditBOO);
  
        tmpact = pMenu.addAction(qsTr("View Item Routing..."));
        tmpact.enabled = (privileges.check("MaintainBOOs") || privileges.check("ViewBOOs"));
        tmpact.triggered.connect(sViewBOO);
      }
    }
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }

  var oldDelete = mywindow.findChild("items.popup.delete");
  if (oldDelete)
  {
    toolbox.coreDisconnect(oldDelete, "triggered()", mywindow, "sDelete()");
    oldDelete.triggered.connect(sDelete);
  }
  else
    throw new Error("could not replace delete action");
}

function sEditBOO()
{
  var params = new Object;
  params.mode = "edit";
  params.item_id = _list.id();

  var wnd = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
  toolbox.lastWindow().set(params);
}

function sViewBOO()
{
  var params = new Object;
  params.mode = "view";
  params.item_id = _list.id();

  var wnd = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
  toolbox.lastWindow().set(params);
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
